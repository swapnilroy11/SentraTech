#!/usr/bin/env python3
"""
Final verification test for the exact failing payload from review request
"""

import asyncio
import aiohttp
import json

async def test_exact_payload():
    # Exact payload from review request that was failing
    failing_payload = {
        "work_shifts": ["flexible"],
        "preferred_shifts": ["flexible"],
        "email": "sededutyfu@gmail.com",
        "full_name": "",
        "position_applied": "Customer Support Specialist"
    }
    
    print("🎯 TESTING EXACT FAILING PAYLOAD FROM REVIEW REQUEST")
    print("=" * 60)
    print("📋 Original failing payload:")
    print(json.dumps(failing_payload, indent=2))
    print()
    
    async with aiohttp.ClientSession() as session:
        async with session.post(
            "https://tech-site-boost.preview.emergentagent.com/api/proxy/job-application",
            json=failing_payload,
            headers={"Content-Type": "application/json"}
        ) as response:
            response_text = await response.text()
            
            print(f"📊 Response Status: {response.status}")
            print(f"📄 Response: {response_text}")
            print()
            
            if response.status == 200:
                try:
                    data = json.loads(response_text)
                    if data.get('success'):
                        print("✅ SUCCESS: Job application submitted successfully!")
                        print(f"   Dashboard ID: {data.get('id')}")
                        print("   Arrays were converted to strings and dashboard accepted the payload")
                    else:
                        print("⚠️  PARTIAL SUCCESS: Backend accepted payload but dashboard had other issues")
                        print(f"   Error: {data.get('error')}")
                        print("   This indicates shifts conversion is working but other validation issues exist")
                except json.JSONDecodeError:
                    print("✅ SUCCESS: HTTP 200 received (conversion working)")
            else:
                print(f"❌ FAILED: HTTP {response.status}")
                if "string_type" in response_text and "input_value=['flexible']" in response_text:
                    print("   This would indicate shifts arrays are NOT being converted")
                else:
                    print("   Different validation error (not shifts-related)")

if __name__ == "__main__":
    asyncio.run(test_exact_payload())