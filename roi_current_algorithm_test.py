#!/usr/bin/env python3
"""
ROI Calculator Current Algorithm Testing
Testing the current algorithm with valid parameters to understand its behavior
"""

import requests
import json
import time
from datetime import datetime

# Backend URL from environment
BACKEND_URL = "https://real-time-dash.preview.emergentagent.com/api"

def test_current_algorithm():
    """Test current ROI algorithm with valid parameters"""
    print("🔍 Testing Current ROI Algorithm Behavior")
    print("=" * 60)
    
    # Test with valid parameters (cost_per_agent > 500)
    test_scenarios = [
        {
            "name": "India Baseline Test",
            "agent_count": 50,
            "average_handle_time": 300,  # 5 minutes
            "monthly_call_volume": 10000,
            "cost_per_agent": 500  # India baseline (minimum allowed)
        },
        {
            "name": "Philippines Baseline Test", 
            "agent_count": 50,
            "average_handle_time": 300,  # 5 minutes
            "monthly_call_volume": 10000,
            "cost_per_agent": 600  # Philippines baseline
        },
        {
            "name": "Vietnam Baseline Test",
            "agent_count": 50,
            "average_handle_time": 300,  # 5 minutes
            "monthly_call_volume": 10000,
            "cost_per_agent": 550  # Vietnam baseline
        }
    ]
    
    for scenario in test_scenarios:
        try:
            print(f"\n📊 {scenario['name']}: {scenario['agent_count']} agents, ${scenario['cost_per_agent']}/agent")
            response = requests.post(f"{BACKEND_URL}/roi/calculate", json=scenario, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                
                traditional_cost = result.get("traditional_total_cost", 0)
                ai_cost = result.get("ai_total_cost", 0)
                monthly_savings = result.get("monthly_savings", 0)
                cost_reduction = result.get("cost_reduction_percentage", 0)
                roi_percentage = result.get("roi_percentage", 0)
                
                print(f"   Traditional Cost: ${traditional_cost:,.2f}")
                print(f"   AI Cost: ${ai_cost:,.2f}")
                print(f"   Monthly Savings: ${monthly_savings:,.2f}")
                print(f"   Cost Reduction: {cost_reduction:.1f}%")
                print(f"   ROI Percentage: {roi_percentage:.1f}%")
                
                # Check if cost reduction is in expected range
                if 30 <= cost_reduction <= 70:
                    print(f"   ✅ Cost reduction within 30-70% range")
                else:
                    print(f"   ❌ Cost reduction {cost_reduction:.1f}% outside 30-70% range")
                
                # Calculate expected AI cost with $200/agent (30% profit margin)
                expected_ai_cost_per_agent = 200
                expected_total_ai_cost = scenario['agent_count'] * expected_ai_cost_per_agent
                
                print(f"   Expected AI Cost (30% margin): ${expected_total_ai_cost:,.2f}")
                print(f"   Actual vs Expected AI Cost: ${ai_cost:,.2f} vs ${expected_total_ai_cost:,.2f}")
                
                if abs(ai_cost - expected_total_ai_cost) <= expected_total_ai_cost * 0.2:
                    print(f"   ✅ AI cost close to expected $200/agent")
                else:
                    print(f"   ❌ AI cost differs significantly from expected $200/agent")
                
            else:
                print(f"   ❌ API Error: {response.status_code}")
                print(f"   Response: {response.text}")
                
        except Exception as e:
            print(f"   ❌ Exception: {str(e)}")
    
    # Test validation boundaries
    print(f"\n🔍 Testing Validation Boundaries")
    
    # Test minimum cost_per_agent (should fail with 500)
    boundary_test = {
        "agent_count": 10,
        "average_handle_time": 300,
        "monthly_call_volume": 2000,
        "cost_per_agent": 500  # Exactly at boundary
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/roi/calculate", json=boundary_test, timeout=15)
        if response.status_code == 200:
            print(f"   ✅ cost_per_agent=500 accepted")
        else:
            print(f"   ❌ cost_per_agent=500 rejected: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"   ❌ Exception testing boundary: {str(e)}")
    
    # Test below minimum (should fail with 499)
    below_boundary_test = {
        "agent_count": 10,
        "average_handle_time": 300,
        "monthly_call_volume": 2000,
        "cost_per_agent": 499  # Below boundary
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/roi/calculate", json=below_boundary_test, timeout=15)
        if response.status_code == 422:
            print(f"   ✅ cost_per_agent=499 correctly rejected")
        else:
            print(f"   ❌ cost_per_agent=499 unexpectedly accepted: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Exception testing below boundary: {str(e)}")

if __name__ == "__main__":
    test_current_algorithm()