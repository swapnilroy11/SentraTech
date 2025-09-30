"""
LEGACY Enterprise WebSocket Service - DISABLED FOR NEW CRM INTEGRATION
OLD dashboard WebSocket service removed to prevent conflicts
"""
import asyncio
import json
import os
import time
import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional, Set
from fastapi import WebSocket, WebSocketDisconnect
import logging

logger = logging.getLogger("websocket_service")

class WebSocketConnectionManager:
    def __init__(self):
        # Active WebSocket connections
        self.active_connections: Dict[str, WebSocket] = {}
        
        # Message history for replay functionality
        self.message_history: List[Dict] = []
        self.max_history = 1000  # Keep last 1000 messages
        
        # Acknowledgment tracking
        self.pending_acks: Dict[str, Dict] = {}  # connection_id -> {message_id: timestamp}
        
        # Heartbeat configuration
        self.heartbeat_interval = int(os.getenv('WS_HEARTBEAT_INTERVAL', '30000')) / 1000  # 30s
        self.max_retries = int(os.getenv('WS_MAX_RETRIES', '3'))
        
        # Message sequence tracking
        self.message_sequence = 0
        
    def generate_connection_id(self) -> str:
        """Generate unique connection ID"""
        return f"conn_{uuid.uuid4().hex[:8]}_{int(time.time())}"
    
    def generate_message_id(self) -> str:
        """Generate unique message ID"""
        self.message_sequence += 1
        return f"msg_{self.message_sequence}_{int(time.time())}"
    
    async def connect(self, websocket: WebSocket, last_received_id: Optional[str] = None) -> str:
        """Accept new WebSocket connection and handle replay if needed"""
        await websocket.accept()
        
        connection_id = self.generate_connection_id()
        self.active_connections[connection_id] = websocket
        self.pending_acks[connection_id] = {}
        
        logger.info(f"New WebSocket connection: {connection_id}")
        
        # Send welcome message
        welcome_msg = {
            'type': 'connection',
            'connectionId': connection_id,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'message': 'Connected to SentraTech real-time service'
        }
        await self.send_message(connection_id, welcome_msg, require_ack=False)
        
        # Replay missed messages if requested
        if last_received_id:
            await self.replay_messages(connection_id, last_received_id)
        
        # Start heartbeat for this connection
        asyncio.create_task(self.heartbeat_loop(connection_id))
        
        return connection_id
    
    async def disconnect(self, connection_id: str):
        """Handle WebSocket disconnection"""
        if connection_id in self.active_connections:
            del self.active_connections[connection_id]
        if connection_id in self.pending_acks:
            del self.pending_acks[connection_id]
        logger.info(f"WebSocket disconnected: {connection_id}")
    
    async def send_message(self, connection_id: str, message: Dict, require_ack: bool = True) -> bool:
        """Send message to specific connection with optional ACK requirement"""
        if connection_id not in self.active_connections:
            logger.warning(f"Attempted to send message to disconnected client: {connection_id}")
            return False
        
        websocket = self.active_connections[connection_id]
        message_id = self.generate_message_id()
        
        # Enhance message with metadata
        enhanced_message = {
            **message,
            'messageId': message_id,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'requiresAck': require_ack
        }
        
        try:
            await websocket.send_text(json.dumps(enhanced_message))
            logger.debug(f"Sent message {message_id} to {connection_id}")
            
            if require_ack:
                # Track for acknowledgment
                self.pending_acks[connection_id][message_id] = {
                    'timestamp': time.time(),
                    'message': enhanced_message,
                    'retries': 0
                }
                
                # Start retry task
                asyncio.create_task(self.wait_for_ack(connection_id, message_id))
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to send message to {connection_id}: {e}")
            await self.disconnect(connection_id)
            return False
    
    async def broadcast_message(self, message: Dict, exclude_connections: Set[str] = None):
        """Broadcast message to all connected clients"""
        exclude_connections = exclude_connections or set()
        
        # Store in history for replay
        self.message_history.append({
            **message,
            'messageId': self.generate_message_id(),
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
        
        # Trim history if needed
        if len(self.message_history) > self.max_history:
            self.message_history = self.message_history[-self.max_history:]
        
        # Send to all active connections
        tasks = []
        for conn_id in list(self.active_connections.keys()):
            if conn_id not in exclude_connections:
                tasks.append(self.send_message(conn_id, message))
        
        if tasks:
            results = await asyncio.gather(*tasks, return_exceptions=True)
            successful = sum(1 for r in results if r is True)
            logger.info(f"Broadcasted message to {successful}/{len(tasks)} connections")
    
    async def replay_messages(self, connection_id: str, last_received_id: str):
        """Replay messages since last received message ID"""
        try:
            # Find index of last received message
            start_index = 0
            for i, msg in enumerate(self.message_history):
                if msg.get('messageId') == last_received_id:
                    start_index = i + 1
                    break
            
            # Replay messages
            messages_to_replay = self.message_history[start_index:]
            logger.info(f"Replaying {len(messages_to_replay)} messages to {connection_id}")
            
            for msg in messages_to_replay:
                replay_msg = {
                    **msg,
                    'isReplay': True
                }
                await self.send_message(connection_id, replay_msg, require_ack=False)
                
        except Exception as e:
            logger.error(f"Error replaying messages for {connection_id}: {e}")
    
    async def handle_acknowledgment(self, connection_id: str, message_id: str):
        """Handle message acknowledgment from client"""
        if connection_id in self.pending_acks and message_id in self.pending_acks[connection_id]:
            del self.pending_acks[connection_id][message_id]
            logger.debug(f"Received ACK for message {message_id} from {connection_id}")
            return True
        return False
    
    async def wait_for_ack(self, connection_id: str, message_id: str):
        """Wait for acknowledgment and retry if needed"""
        max_wait_time = 10.0  # 10 seconds max wait
        retry_interval = 2.0  # 2 seconds between retries
        
        for attempt in range(self.max_retries):
            await asyncio.sleep(retry_interval)
            
            # Check if ACK received
            if (connection_id not in self.pending_acks or 
                message_id not in self.pending_acks[connection_id]):
                return  # ACK received
            
            # Retry sending message
            pending_info = self.pending_acks[connection_id][message_id]
            pending_info['retries'] += 1
            
            logger.warning(f"Retrying message {message_id} to {connection_id} (attempt {attempt + 1})")
            
            try:
                websocket = self.active_connections[connection_id]
                retry_msg = {
                    **pending_info['message'],
                    'isRetry': True,
                    'retryAttempt': attempt + 1
                }
                await websocket.send_text(json.dumps(retry_msg))
                
            except Exception as e:
                logger.error(f"Failed to retry message {message_id}: {e}")
                await self.disconnect(connection_id)
                return
        
        # Max retries exceeded
        logger.error(f"Max retries exceeded for message {message_id} to {connection_id}")
        if connection_id in self.pending_acks and message_id in self.pending_acks[connection_id]:
            del self.pending_acks[connection_id][message_id]
    
    async def heartbeat_loop(self, connection_id: str):
        """Send periodic heartbeat pings to maintain connection"""
        while connection_id in self.active_connections:
            try:
                await asyncio.sleep(self.heartbeat_interval)
                
                if connection_id not in self.active_connections:
                    break
                
                ping_msg = {
                    'type': 'ping',
                    'timestamp': datetime.now(timezone.utc).isoformat()
                }
                
                await self.send_message(connection_id, ping_msg, require_ack=False)
                
            except Exception as e:
                logger.error(f"Heartbeat error for {connection_id}: {e}")
                await self.disconnect(connection_id)
                break
    
    async def notify_form_submission(self, form_type: str, submission_data: Dict):
        """Notify all clients of new form submission"""
        notification = {
            'type': 'form_submission',
            'formType': form_type,
            'submissionId': submission_data.get('submissionId'),
            'sequence': self.message_sequence,
            'data': submission_data
        }
        
        await self.broadcast_message(notification)
        logger.info(f"Notified {len(self.active_connections)} clients of {form_type} submission")
    
    def get_connection_stats(self) -> Dict:
        """Get WebSocket service statistics"""
        return {
            'active_connections': len(self.active_connections),
            'message_history_size': len(self.message_history),
            'pending_acks': sum(len(acks) for acks in self.pending_acks.values()),
            'current_sequence': self.message_sequence,
            'connection_ids': list(self.active_connections.keys())
        }

# Global WebSocket manager instance
ws_manager = WebSocketConnectionManager()

import os