/**
 * Test script to verify SentraTech Career Site Integration with Admin Dashboard
 * Following the exact specifications from the integration prompt
 */

// Sample test data matching the prompt schema
const testApplicationData = {
  "full_name": "Test Candidate",
  "email": "test@example.com",
  "phone": "+1-555-0123",
  "location": "New York, NY",
  "portfolio_website": "https://testcandidate.com",
  "resume_file": {
    "name": "test_resume.pdf",
    "data": "JVBERi0xLjMKJcTl8uXrp/Og0MTGCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL091dGxpbmVzIDIgMCBSCi9QYWdlcyAzIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvT3V0bGluZXMKL0NvdW50IDAKPJ4K",
    "type": "application/pdf",
    "size": 156789
  },
  "relevant_experience": "5 years of full-stack development with React and Node.js",
  "preferred_shifts": "Full-time",
  "availability_start_date": "2024-02-01",
  "why_sentratech": "Excited about AI-powered solutions and the opportunity to work with cutting-edge technology in customer support automation.",
  "cover_letter": "I am passionate about creating innovative solutions that bridge AI and human experience. My background in full-stack development aligns perfectly with SentraTech's mission.",
  "work_authorization": "US Citizen",
  "consent_for_storage": true,
  "consent_for_contact": true,
  "position": "Software Engineer",
  "source": "careers_page"
};

// API integration test function from the prompt
const submitApplication = async (formData) => {
  try {
    console.log('🚀 Testing SentraTech Dashboard Integration...');
    console.log('📊 Sending application data:', JSON.stringify(formData, null, 2));
    
    const response = await fetch('https://sentra-admin-dash.preview.emergentagent.com/api/ingest/job_applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-INGEST-KEY': 'test-ingest-key-12345'
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
    console.log('📋 Response Data:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      // Success! Application submitted
      console.log('✅ SUCCESS: Application submitted successfully!');
      console.log(`🆔 Application ID: ${result.application_id}`);
      console.log('🎯 Expected Dashboard Features:');
      console.log('   - AI-Powered Candidate Scoring');
      console.log('   - Automated Email Notifications');
      console.log('   - Recruitment Analytics');
      console.log('   - Resume Management');
      console.log('   - Real-time KPI Dashboard');
      
      return { success: true, data: result };
    } else {
      throw new Error(result.detail || 'Submission failed');
    }
  } catch (error) {
    console.error('❌ ERROR: Application submission failed:', error.message);
    console.log('🔧 Troubleshooting:');
    console.log('   1. Check internet connectivity');
    console.log('   2. Verify dashboard endpoint is accessible');
    console.log('   3. Confirm X-INGEST-KEY is correct');
    console.log('   4. Check dashboard logs for errors');
    
    return { success: false, error: error.message };
  }
};

// File upload test function from the prompt
const testFileUpload = (mockFile) => {
  return new Promise((resolve, reject) => {
    console.log('📎 Testing file upload functionality...');
    
    if (!mockFile) {
      resolve(null);
      return;
    }
    
    // Validate file type and size (from prompt specifications)
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(mockFile.type)) {
      reject('Only PDF and Word documents are allowed');
      return;
    }
    
    if (mockFile.size > maxSize) {
      reject('File size must be less than 5MB');
      return;
    }
    
    console.log('✅ File validation passed');
    console.log(`📄 File: ${mockFile.name} (${mockFile.type}, ${mockFile.size} bytes)`);
    
    // Mock successful file processing
    resolve({
      name: mockFile.name,
      data: mockFile.data,
      type: mockFile.type,
      size: mockFile.size
    });
  });
};

// Integration verification checklist
const verifyIntegration = async () => {
  console.log('🔍 SentraTech Career Site Integration Verification');
  console.log('================================================');
  
  // Test 1: Data Schema Validation
  console.log('\n1️⃣ Testing Data Schema...');
  const requiredFields = ['full_name', 'email', 'position', 'source'];
  const missingFields = requiredFields.filter(field => !testApplicationData[field]);
  
  if (missingFields.length === 0) {
    console.log('✅ All required fields present');
  } else {
    console.log('❌ Missing required fields:', missingFields);
  }
  
  // Test 2: File Upload Validation
  console.log('\n2️⃣ Testing File Upload...');
  try {
    const fileResult = await testFileUpload(testApplicationData.resume_file);
    if (fileResult) {
      console.log('✅ File upload validation successful');
    } else {
      console.log('ℹ️ No file provided (optional)');
    }
  } catch (error) {
    console.log('❌ File upload error:', error);
  }
  
  // Test 3: API Integration
  console.log('\n3️⃣ Testing API Integration...');
  const result = await submitApplication(testApplicationData);
  
  if (result.success) {
    console.log('\n🎉 Integration Test PASSED!');
    console.log('✅ Career site successfully connected to SentraTech Admin Dashboard');
    
    console.log('\n📊 Next Steps:');
    console.log('1. Verify data appears in dashboard: https://sentra-admin-dash.preview.emergentagent.com/candidates');
    console.log('2. Check AI analysis generates scores and insights');
    console.log('3. Test email notifications are sent');
    console.log('4. Verify resume file upload and download');
    
  } else {
    console.log('\n❌ Integration Test FAILED!');
    console.log('Please review the integration setup and try again.');
  }
  
  return result.success;
};

// Run the integration test
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  global.fetch = fetch;
  verifyIntegration();
} else {
  // Browser environment
  console.log('🌐 Run in browser console or Node.js environment');
  window.testDashboardIntegration = verifyIntegration;
}

module.exports = {
  submitApplication,
  testFileUpload,
  verifyIntegration,
  testApplicationData
};