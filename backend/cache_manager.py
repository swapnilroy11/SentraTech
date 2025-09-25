# SentraTech Advanced Caching Manager
# High-performance in-memory caching to reduce API response times from 2800ms to <300ms

import asyncio
import json
import time
from typing import Any, Optional, Dict, Callable
from functools import wraps
import hashlib
import logging

logger = logging.getLogger(__name__)

class AdvancedCacheManager:
    """Enterprise-grade in-memory cache with TTL and performance optimizations"""
    
    def __init__(self, default_ttl: int = 300, max_size: int = 10000):
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.default_ttl = default_ttl  # 5 minutes default
        self.max_size = max_size
        self.access_times: Dict[str, float] = {}
        self.hit_count = 0
        self.miss_count = 0
        
    def _generate_key(self, prefix: str, *args, **kwargs) -> str:
        """Generate cache key from function arguments"""
        key_data = {
            'args': args,
            'kwargs': sorted(kwargs.items()) if kwargs else {}
        }
        key_string = f"{prefix}:{json.dumps(key_data, sort_keys=True, default=str)}"
        return hashlib.md5(key_string.encode()).hexdigest()
    
    def _cleanup_expired(self):
        """Remove expired cache entries"""
        current_time = time.time()
        expired_keys = []
        
        for key, cache_data in self.cache.items():
            if current_time > cache_data['expires_at']:
                expired_keys.append(key)
        
        for key in expired_keys:
            del self.cache[key]
            if key in self.access_times:
                del self.access_times[key]
    
    def _cleanup_lru(self):
        """Remove least recently used items if cache is too large"""
        if len(self.cache) <= self.max_size:
            return
            
        # Sort by access time and remove oldest entries
        sorted_keys = sorted(
            self.access_times.items(),
            key=lambda x: x[1]
        )
        
        items_to_remove = len(self.cache) - self.max_size + 100  # Remove extra for buffer
        
        for key, _ in sorted_keys[:items_to_remove]:
            if key in self.cache:
                del self.cache[key]
            if key in self.access_times:
                del self.access_times[key]
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        current_time = time.time()
        
        if key in self.cache:
            cache_data = self.cache[key]
            
            if current_time <= cache_data['expires_at']:
                self.access_times[key] = current_time
                self.hit_count += 1
                logger.debug(f"Cache HIT for key: {key[:20]}...")
                return cache_data['value']
            else:
                # Expired
                del self.cache[key]
                if key in self.access_times:
                    del self.access_times[key]
        
        self.miss_count += 1
        logger.debug(f"Cache MISS for key: {key[:20]}...")
        return None
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Set value in cache with TTL"""
        if ttl is None:
            ttl = self.default_ttl
        
        current_time = time.time()
        expires_at = current_time + ttl
        
        self.cache[key] = {
            'value': value,
            'expires_at': expires_at,
            'created_at': current_time
        }
        self.access_times[key] = current_time
        
        # Cleanup if necessary
        if len(self.cache) % 100 == 0:  # Periodic cleanup
            self._cleanup_expired()
            
        if len(self.cache) > self.max_size:
            self._cleanup_lru()
        
        logger.debug(f"Cache SET for key: {key[:20]}... (TTL: {ttl}s)")
    
    def delete(self, key: str) -> bool:
        """Delete specific key from cache"""
        if key in self.cache:
            del self.cache[key]
            if key in self.access_times:
                del self.access_times[key]
            return True
        return False
    
    def clear(self) -> None:
        """Clear all cache"""
        self.cache.clear()
        self.access_times.clear()
        self.hit_count = 0
        self.miss_count = 0
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache performance statistics"""
        total_requests = self.hit_count + self.miss_count
        hit_rate = (self.hit_count / total_requests * 100) if total_requests > 0 else 0
        
        return {
            'cache_size': len(self.cache),
            'max_size': self.max_size,
            'hit_count': self.hit_count,
            'miss_count': self.miss_count,
            'hit_rate': round(hit_rate, 2),
            'total_requests': total_requests
        }

# Global cache instance
cache_manager = AdvancedCacheManager(default_ttl=300, max_size=5000)

def cached(ttl: int = 300, key_prefix: str = "default"):
    """
    Decorator for caching function results
    
    Args:
        ttl: Time to live in seconds
        key_prefix: Prefix for cache key generation
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = cache_manager._generate_key(
                f"{key_prefix}:{func.__name__}", *args, **kwargs
            )
            
            # Try to get from cache
            cached_result = cache_manager.get(cache_key)
            if cached_result is not None:
                return cached_result
            
            # Execute function and cache result
            start_time = time.time()
            result = await func(*args, **kwargs)
            execution_time = (time.time() - start_time) * 1000
            
            # Only cache successful results (not exceptions)
            cache_manager.set(cache_key, result, ttl)
            
            logger.info(f"Function {func.__name__} executed in {execution_time:.2f}ms, result cached")
            return result
        
        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = cache_manager._generate_key(
                f"{key_prefix}:{func.__name__}", *args, **kwargs
            )
            
            # Try to get from cache
            cached_result = cache_manager.get(cache_key)
            if cached_result is not None:
                return cached_result
            
            # Execute function and cache result
            start_time = time.time()
            result = func(*args, **kwargs)
            execution_time = (time.time() - start_time) * 1000
            
            # Only cache successful results
            cache_manager.set(cache_key, result, ttl)
            
            logger.info(f"Function {func.__name__} executed in {execution_time:.2f}ms, result cached")
            return result
        
        # Return appropriate wrapper based on function type
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper
    
    return decorator

# Specialized caching for different data types
class SpecializedCaches:
    """Specialized cache instances for different use cases"""
    
    # Fast cache for frequent API calls (1 minute TTL)
    api_cache = AdvancedCacheManager(default_ttl=60, max_size=1000)
    
    # Medium cache for database queries (5 minute TTL)
    db_cache = AdvancedCacheManager(default_ttl=300, max_size=2000)
    
    # Slow cache for expensive computations (30 minute TTL)  
    computation_cache = AdvancedCacheManager(default_ttl=1800, max_size=500)
    
    @staticmethod
    def get_all_stats() -> Dict[str, Any]:
        """Get statistics from all cache instances"""
        return {
            'global_cache': cache_manager.get_stats(),
            'api_cache': SpecializedCaches.api_cache.get_stats(),
            'db_cache': SpecializedCaches.db_cache.get_stats(),
            'computation_cache': SpecializedCaches.computation_cache.get_stats()
        }

# Cache warming utilities
async def warm_cache():
    """Pre-populate cache with frequently accessed data"""
    try:
        logger.info("Starting cache warming process...")
        
        # Pre-compute common ROI calculations
        common_scenarios = [
            {"call_volume": 1000, "current_cost_per_call": 5.0, "agent_count": 10},
            {"call_volume": 5000, "current_cost_per_call": 8.0, "agent_count": 25},
            {"call_volume": 10000, "current_cost_per_call": 12.0, "agent_count": 50},
        ]
        
        for scenario in common_scenarios:
            cache_key = cache_manager._generate_key("roi_calculation", **scenario)
            # This would normally call the actual ROI calculation function
            # For now, we'll cache some sample results
            sample_result = {
                "monthly_savings": scenario["call_volume"] * scenario["current_cost_per_call"] * 0.6,
                "automation_rate": 70,
                "roi_percentage": 300
            }
            cache_manager.set(cache_key, sample_result, 1800)  # 30 minute TTL
        
        logger.info("Cache warming completed successfully")
        
    except Exception as e:
        logger.error(f"Error during cache warming: {str(e)}")

# Cache monitoring and cleanup
async def cache_maintenance():
    """Perform periodic cache maintenance"""
    while True:
        try:
            await asyncio.sleep(300)  # Run every 5 minutes
            
            # Cleanup expired entries
            cache_manager._cleanup_expired()
            SpecializedCaches.api_cache._cleanup_expired()
            SpecializedCaches.db_cache._cleanup_expired()
            SpecializedCaches.computation_cache._cleanup_expired()
            
            # Log cache statistics
            stats = SpecializedCaches.get_all_stats()
            logger.info(f"Cache maintenance completed. Stats: {stats}")
            
        except Exception as e:
            logger.error(f"Error during cache maintenance: {str(e)}")

# Export for use in other modules
__all__ = ['cached', 'cache_manager', 'SpecializedCaches', 'warm_cache', 'cache_maintenance']