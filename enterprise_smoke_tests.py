#!/usr/bin/env python3
"""
Enterprise Smoke Test Suite for SentraTech Production Deployment
Tests all form endpoints, WebSocket connectivity, and real-time sync
"""
import asyncio
import aiohttp
import websockets
import json
import time
import uuid
from datetime import datetime, timezone
from typing import Dict, List

class EnterpriseSmokeTests:
    def __init__(self):
        # Production URLs
        self.base_url = "https://sentratech.net"
        self.admin_url = "https://admin.sentratech.net"
        self.ws_url = "wss://admin.sentratech.net/ws"
        
        # Form endpoints to test
        self.form_endpoints = {
            "roi-calculator": "https://admin.sentratech.net/api/forms/roi-calculator",
            "demo-request": "https://admin.sentratech.net/api/forms/demo-request", 
            "contact-sales": "https://admin.sentratech.net/api/forms/contact-sales",
            "newsletter-signup": "https://admin.sentratech.net/api/forms/newsletter-signup",
            "job-application": "https://admin.sentratech.net/api/forms/job-application"
        }
        
        # Proxy endpoints
        self.proxy_endpoints = {
            "roi-calculator": f"{self.base_url}/api/proxy/roi-calculator",
            "demo-request": f"{self.base_url}/api/proxy/demo-request",
            "contact-sales": f"{self.base_url}/api/proxy/contact-sales", 
            "newsletter-signup": f"{self.base_url}/api/proxy/newsletter-signup",
            "job-application": f"{self.base_url}/api/proxy/job-application"
        }
        
        self.api_key = "sk-emergent-7A236FdD2Ce8d9b52C"
        self.test_results = []
    
    def generate_test_data(self, form_type: str) -> Dict:
        """Generate realistic test data for each form type"""
        base_id = f"test_{uuid.uuid4().hex[:8]}"
        timestamp = datetime.now(timezone.utc).isoformat()
        
        form_data = {
            "roi-calculator": {
                "company": "Test Company",
                "industry": "Technology", 
                "employees": "100-500",
                "currentCosts": "50000",
                "expectedSavings": "20000",
                "email": f"test+{base_id}@sentratech.net",
                "phone": "+1-555-123-4567"
            },
            "demo-request": {
                "firstName": "John",
                "lastName": "Doe",
                "email": f"demo+{base_id}@sentratech.net",
                "company": "Test Corp",
                "jobTitle": "CTO",
                "phone": "+1-555-987-6543",
                "useCase": "Customer support automation"
            },
            "contact-sales": {
                "firstName": "Jane",
                "lastName": "Smith", 
                "email": f"sales+{base_id}@sentratech.net",
                "company": "Enterprise Inc",
                "message": "Interested in enterprise features",
                "budget": "$10,000-$50,000"
            },
            "newsletter-signup": {
                "email": f"newsletter+{base_id}@sentratech.net",
                "firstName": "Newsletter",
                "lastName": "Subscriber",
                "interests": ["AI", "Customer Support"]
            },
            "job-application": {
                "firstName": "Career",
                "lastName": "Seeker",
                "email": f"jobs+{base_id}@sentratech.net",
                "position": "Software Engineer",
                "experience": "5+ years",
                "resume": "https://example.com/resume.pdf"
            }
        }
        
        return {
            "submissionId": f"smoke_test_{base_id}",
            "timestamp": timestamp,
            "formType": form_type,
            "source": "smoke_test",
            "data": form_data.get(form_type, {})
        }
    
    async def test_proxy_endpoint(self, form_type: str) -> Dict:
        """Test proxy endpoint submission"""
        test_name = f"proxy_{form_type}"
        start_time = time.time()
        
        try:
            test_data = self.generate_test_data(form_type)
            url = self.proxy_endpoints[form_type]
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    url,
                    json=test_data,
                    headers={'Content-Type': 'application/json'},
                    timeout=aiohttp.ClientTimeout(total=15)
                ) as response:
                    response_data = await response.json()
                    elapsed = time.time() - start_time
                    
                    success = response.status == 200 and response_data.get('success', False)
                    
                    return {
                        'test': test_name,
                        'success': success,
                        'status_code': response.status,
                        'response_time': round(elapsed, 3),
                        'submission_id': test_data['submissionId'],
                        'response_data': response_data,
                        'error': None if success else f"HTTP {response.status}: {response_data}"
                    }
        
        except Exception as e:
            elapsed = time.time() - start_time
            return {
                'test': test_name,
                'success': False,
                'status_code': None,
                'response_time': round(elapsed, 3),
                'submission_id': None,
                'response_data': None,
                'error': str(e)
            }
    
    async def test_dashboard_endpoint(self, form_type: str) -> Dict:
        """Test direct dashboard API endpoint"""
        test_name = f"dashboard_{form_type}"
        start_time = time.time()
        
        try:
            test_data = self.generate_test_data(form_type)
            url = self.form_endpoints[form_type]
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    url,
                    json=test_data,
                    headers={
                        'Content-Type': 'application/json',
                        'X-API-Key': self.api_key
                    },
                    timeout=aiohttp.ClientTimeout(total=15)
                ) as response:
                    response_data = await response.json()
                    elapsed = time.time() - start_time
                    
                    success = response.status == 200 and response_data.get('ack', False)
                    
                    return {
                        'test': test_name,
                        'success': success,
                        'status_code': response.status,
                        'response_time': round(elapsed, 3),
                        'submission_id': test_data['submissionId'],
                        'ack_received': response_data.get('ack', False),
                        'response_data': response_data,
                        'error': None if success else f"HTTP {response.status}: {response_data}"
                    }
        
        except Exception as e:
            elapsed = time.time() - start_time
            return {
                'test': test_name,
                'success': False,
                'status_code': None,
                'response_time': round(elapsed, 3),
                'submission_id': None,
                'ack_received': False,
                'response_data': None,
                'error': str(e)
            }
    
    async def test_websocket_connection(self) -> Dict:
        """Test WebSocket connectivity and real-time notifications"""
        test_name = "websocket_connection"
        start_time = time.time()
        
        try:
            messages_received = []
            
            async with websockets.connect(self.ws_url) as websocket:
                # Wait for welcome message
                welcome_msg = await asyncio.wait_for(websocket.recv(), timeout=10)
                messages_received.append(json.loads(welcome_msg))
                
                # Send a test form submission while connected
                test_data = self.generate_test_data("demo-request")
                
                # Submit via proxy while WebSocket is connected
                submit_task = self.test_proxy_endpoint("demo-request")
                
                # Listen for real-time notification
                notification_task = asyncio.wait_for(websocket.recv(), timeout=10)
                
                # Wait for both submission and notification
                submit_result, notification_msg = await asyncio.gather(
                    submit_task,
                    notification_task,
                    return_exceptions=True
                )
                
                if not isinstance(notification_msg, Exception):
                    messages_received.append(json.loads(notification_msg))
                
                elapsed = time.time() - start_time
                
                success = (
                    len(messages_received) >= 1 and  # At least welcome message
                    messages_received[0].get('type') == 'connection' and
                    submit_result.get('success', False) if isinstance(submit_result, dict) else False
                )
                
                return {
                    'test': test_name,
                    'success': success,
                    'connection_time': round(elapsed, 3),
                    'messages_received': len(messages_received),
                    'real_time_sync': len(messages_received) > 1,
                    'messages': messages_received,
                    'error': None
                }
        
        except Exception as e:
            elapsed = time.time() - start_time
            return {
                'test': test_name,
                'success': False,
                'connection_time': round(elapsed, 3),
                'messages_received': 0,
                'real_time_sync': False,
                'messages': [],
                'error': str(e)
            }
    
    async def test_ssl_certificates(self) -> Dict:
        """Test SSL certificate validity for all domains"""
        test_name = "ssl_certificates"
        start_time = time.time()
        
        domains_to_test = [
            "https://sentratech.net",
            "https://www.sentratech.net", 
            "https://admin.sentratech.net"
        ]
        
        ssl_results = {}
        
        try:
            async with aiohttp.ClientSession() as session:
                for url in domains_to_test:
                    try:
                        async with session.get(f"{url}/health", timeout=aiohttp.ClientTimeout(total=10)) as response:
                            ssl_results[url] = {
                                'accessible': response.status < 500,
                                'status_code': response.status,
                                'ssl_valid': True  # If we got here, SSL worked
                            }
                    except Exception as e:
                        ssl_results[url] = {
                            'accessible': False,
                            'status_code': None,
                            'ssl_valid': False,
                            'error': str(e)
                        }
            
            elapsed = time.time() - start_time
            all_valid = all(result.get('ssl_valid', False) for result in ssl_results.values())
            
            return {
                'test': test_name,
                'success': all_valid,
                'check_time': round(elapsed, 3),
                'domains': ssl_results,
                'error': None if all_valid else "Some SSL certificates are invalid"
            }
        
        except Exception as e:
            elapsed = time.time() - start_time
            return {
                'test': test_name,
                'success': False,
                'check_time': round(elapsed, 3),
                'domains': ssl_results,
                'error': str(e)
            }
    
    async def run_all_tests(self) -> Dict:
        """Run complete test suite"""
        print("🚀 Starting Enterprise Smoke Test Suite for SentraTech")
        print("="*60)
        
        start_time = time.time()
        all_results = []
        
        # Test SSL certificates first
        print("🔒 Testing SSL certificates...")
        ssl_result = await self.test_ssl_certificates()
        all_results.append(ssl_result)
        print(f"   SSL Test: {'✅ PASS' if ssl_result['success'] else '❌ FAIL'}")
        
        # Test all form endpoints via proxy
        print("🌐 Testing proxy endpoints...")
        for form_type in self.form_endpoints.keys():
            result = await self.test_proxy_endpoint(form_type)
            all_results.append(result)
            print(f"   Proxy {form_type}: {'✅ PASS' if result['success'] else '❌ FAIL'} ({result['response_time']}s)")
        
        # Test dashboard API endpoints
        print("📊 Testing dashboard API endpoints...")
        for form_type in self.form_endpoints.keys():
            result = await self.test_dashboard_endpoint(form_type)
            all_results.append(result)
            print(f"   Dashboard {form_type}: {'✅ PASS' if result['success'] else '❌ FAIL'} ({result['response_time']}s)")
        
        # Test WebSocket connectivity
        print("🔌 Testing WebSocket real-time sync...")
        ws_result = await self.test_websocket_connection()
        all_results.append(ws_result)
        print(f"   WebSocket: {'✅ PASS' if ws_result['success'] else '❌ FAIL'} ({ws_result['connection_time']}s)")
        
        # Calculate overall results
        total_time = time.time() - start_time
        successful_tests = sum(1 for r in all_results if r['success'])
        total_tests = len(all_results)
        success_rate = (successful_tests / total_tests) * 100
        
        overall_success = success_rate >= 90  # 90% pass rate required
        
        # Summary
        print("\n" + "="*60)
        print("📋 ENTERPRISE SMOKE TEST SUMMARY")
        print("="*60)
        print(f"🎯 Overall Status: {'✅ PASS' if overall_success else '❌ FAIL'}")
        print(f"📊 Success Rate: {success_rate:.1f}% ({successful_tests}/{total_tests})")
        print(f"⏱️  Total Time: {total_time:.2f}s")
        print(f"🌐 Website: {self.base_url}")
        print(f"📊 Dashboard: {self.admin_url}") 
        print(f"🔌 WebSocket: {self.ws_url}")
        
        if not overall_success:
            print("\n❌ FAILED TESTS:")
            for result in all_results:
                if not result['success']:
                    print(f"   - {result['test']}: {result.get('error', 'Unknown error')}")
        
        return {
            'overall_success': overall_success,
            'success_rate': success_rate,
            'total_tests': total_tests,
            'successful_tests': successful_tests,
            'total_time': round(total_time, 2),
            'test_results': all_results,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }

async def main():
    """Run enterprise smoke tests"""
    smoke_tests = EnterpriseSmokeTests()
    results = await smoke_tests.run_all_tests()
    
    # Save results to file
    with open('/app/smoke_test_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    # Exit with appropriate code
    exit_code = 0 if results['overall_success'] else 1
    print(f"\n🏁 Smoke tests completed. Results saved to smoke_test_results.json")
    print(f"Exit code: {exit_code}")
    
    return exit_code

if __name__ == "__main__":
    asyncio.run(main())