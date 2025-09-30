// Comprehensive Data Types for SentraTech Admin Dashboard
// Based on website form analysis and backend integration

export const FormTypes = {
  ROI_CALCULATOR: 'roi_calculator',
  DEMO_REQUEST: 'demo_request', 
  CONTACT_SALES: 'contact_sales',
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  JOB_APPLICATION: 'job_application'
};

export const StatusTypes = {
  NEW: 'new',
  CONTACTED: 'contacted', 
  PROCESSED: 'processed',
  CLOSED: 'closed'
};

// ROI Calculator Data Structure
export const ROICalculatorSchema = {
  id: 'string',
  email: 'string',
  country: 'string', // Bangladesh, India, Philippines, Vietnam
  call_volume: 'number',
  interaction_volume: 'number', 
  monthly_volume: 'number',
  total_volume: 'number',
  bpo_spending: 'number',
  sentratech_spending: 'number',
  monthly_savings: 'number',
  annual_savings: 'number',
  roi_percentage: 'number',
  cost_reduction: 'number',
  typical_range: 'string',
  client_info: {
    user_agent: 'string',
    url: 'string',
    referrer: 'string'
  },
  timestamp: 'datetime',
  created_at: 'datetime',
  status: 'enum',
  notes: 'string'
};

// Demo Request Data Structure 
export const DemoRequestSchema = {
  id: 'string',
  full_name: 'string',
  name: 'string',
  work_email: 'string', 
  email: 'string',
  company_name: 'string',
  company: 'string',
  phone: 'string',
  call_volume: 'number',
  interaction_volume: 'number',
  monthly_volume: 'number',
  preferred_demo_date: 'string',
  demo_time_preference: 'string',
  notes: 'string',
  message: 'string',
  client_info: {
    user_agent: 'string',
    url: 'string', 
    referrer: 'string'
  },
  timestamp: 'datetime',
  created_at: 'datetime',
  status: 'enum',
  follow_up_date: 'datetime'
};

// Contact Sales Data Structure
export const ContactSalesSchema = {
  id: 'string',
  full_name: 'string',
  work_email: 'string',
  company_name: 'string', 
  phone: 'string',
  industry: 'string',
  company_size: 'string',
  plan_selected: 'string', // Essential, Professional, Enterprise
  message: 'string',
  requirements: 'array',
  client_info: {
    user_agent: 'string',
    url: 'string',
    referrer: 'string'
  },
  timestamp: 'datetime',
  created_at: 'datetime',
  status: 'enum',
  priority: 'enum', // low, medium, high
  assigned_to: 'string'
};

// Newsletter Signup Data Structure
export const NewsletterSchema = {
  id: 'string',
  email: 'string',
  source: 'string', // footer, modal, header, popup
  opt_in_date: 'datetime',
  double_opt_in: 'boolean',
  preferences: {
    product_updates: 'boolean',
    industry_insights: 'boolean', 
    case_studies: 'boolean'
  },
  client_info: {
    user_agent: 'string',
    url: 'string',
    referrer: 'string'
  },
  timestamp: 'datetime',
  created_at: 'datetime',
  status: 'enum', // active, unsubscribed, bounced
  engagement_score: 'number'
};

// Job Application Data Structure
export const JobApplicationSchema = {
  id: 'string',
  applicant_name: 'string',
  full_name: 'string',
  email: 'string',
  phone: 'string',
  position_applied: 'string',
  department: 'string',
  experience_level: 'string', // entry, mid, senior, executive
  resume_url: 'string',
  resume_filename: 'string',
  cover_letter: 'string',
  portfolio_url: 'string',
  linkedin_profile: 'string',
  expected_salary: 'string',
  availability: 'string',
  location_preference: 'string',
  remote_preference: 'string', // remote, hybrid, onsite
  skills: 'array',
  client_info: {
    user_agent: 'string',
    url: 'string',
    referrer: 'string'
  },
  timestamp: 'datetime',
  created_at: 'datetime',
  status: 'enum', // new, screening, interview, offer, hired, rejected
  screening_notes: 'string',
  interview_scheduled: 'datetime'
};

// KPI Definitions
export const KPIMetrics = {
  TOTAL_SUBMISSIONS: 'total_submissions',
  CONVERSION_RATES: 'conversion_rates',
  AVERAGE_ROI: 'average_roi',
  DEMO_CONVERSION: 'demo_conversion', 
  LEAD_RESPONSE_TIME: 'lead_response_time',
  MONTHLY_NEW_APPLICANTS: 'monthly_new_applicants',
  NEWSLETTER_GROWTH_RATE: 'newsletter_growth_rate',
  CUSTOMER_ACQUISITION_COST: 'customer_acquisition_cost'
};

// Chart Types
export const ChartTypes = {
  LINE: 'line',
  BAR: 'bar', 
  PIE: 'pie',
  AREA: 'area',
  DONUT: 'donut'
};

// Table Configurations
export const TableColumns = {
  roi_calculator: [
    { key: 'timestamp', label: 'Date', sortable: true, filterable: true },
    { key: 'email', label: 'Email', sortable: true, filterable: true },
    { key: 'country', label: 'Country', sortable: true, filterable: true },
    { key: 'total_volume', label: 'Volume', sortable: true, filterable: true },
    { key: 'roi_percentage', label: 'ROI %', sortable: true, filterable: true },
    { key: 'monthly_savings', label: 'Savings', sortable: true, filterable: true },
    { key: 'status', label: 'Status', sortable: true, filterable: true },
    { key: 'actions', label: 'Actions', sortable: false, filterable: false }
  ],
  demo_request: [
    { key: 'timestamp', label: 'Date', sortable: true, filterable: true },
    { key: 'full_name', label: 'Name', sortable: true, filterable: true },
    { key: 'work_email', label: 'Email', sortable: true, filterable: true },
    { key: 'company_name', label: 'Company', sortable: true, filterable: true },
    { key: 'monthly_volume', label: 'Volume', sortable: true, filterable: true },
    { key: 'status', label: 'Status', sortable: true, filterable: true },
    { key: 'actions', label: 'Actions', sortable: false, filterable: false }
  ],
  contact_sales: [
    { key: 'timestamp', label: 'Date', sortable: true, filterable: true },
    { key: 'full_name', label: 'Name', sortable: true, filterable: true },
    { key: 'work_email', label: 'Email', sortable: true, filterable: true },
    { key: 'company_name', label: 'Company', sortable: true, filterable: true },
    { key: 'plan_selected', label: 'Plan', sortable: true, filterable: true },
    { key: 'priority', label: 'Priority', sortable: true, filterable: true },
    { key: 'status', label: 'Status', sortable: true, filterable: true },
    { key: 'actions', label: 'Actions', sortable: false, filterable: false }
  ],
  newsletter_signup: [
    { key: 'timestamp', label: 'Date', sortable: true, filterable: true },
    { key: 'email', label: 'Email', sortable: true, filterable: true },
    { key: 'source', label: 'Source', sortable: true, filterable: true },
    { key: 'engagement_score', label: 'Engagement', sortable: true, filterable: true },
    { key: 'status', label: 'Status', sortable: true, filterable: true },
    { key: 'actions', label: 'Actions', sortable: false, filterable: false }
  ],
  job_application: [
    { key: 'timestamp', label: 'Date', sortable: true, filterable: true },
    { key: 'applicant_name', label: 'Name', sortable: true, filterable: true },
    { key: 'email', label: 'Email', sortable: true, filterable: true },
    { key: 'position_applied', label: 'Position', sortable: true, filterable: true },
    { key: 'experience_level', label: 'Experience', sortable: true, filterable: true },
    { key: 'status', label: 'Status', sortable: true, filterable: true },
    { key: 'actions', label: 'Actions', sortable: false, filterable: false }
  ]
};

export default {
  FormTypes,
  StatusTypes, 
  ROICalculatorSchema,
  DemoRequestSchema,
  ContactSalesSchema,
  NewsletterSchema,
  JobApplicationSchema,
  KPIMetrics,
  ChartTypes,
  TableColumns
};