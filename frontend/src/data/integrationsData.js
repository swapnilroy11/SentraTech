// integrationsData.js - Centralized data for integrations
export const integrations = [
  // CRM & Sales
  {
    id: 'hubspot',
    name: 'HubSpot',
    logo: 'HS',
    color: '#FF7A59',
    category: 'crm',
    description: 'Complete CRM platform with marketing, sales, and service tools.',
    status: 'connected',
    setupTime: '10 minutes',
    popularity: 92,
    features: ['Contact Management', 'Email Marketing', 'Sales Pipeline'],
    pricing: 'Free tier available'
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    logo: 'SF',
    color: '#00A1E0',
    category: 'crm',
    description: 'World\'s leading customer relationship management platform.',
    status: 'connected',
    setupTime: '15 minutes',
    popularity: 95,
    features: ['Advanced CRM', 'Analytics', 'Custom Workflows'],
    pricing: 'Starting at $25/user/month'
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    logo: 'PD',
    color: '#1976D2',
    category: 'crm',
    description: 'Sales pipeline management built for closing deals.',
    status: 'connected',
    setupTime: '8 minutes',
    popularity: 87,
    features: ['Pipeline Management', 'Deal Tracking', 'Sales Reports'],
    pricing: 'Starting at $14.90/user/month'
  },

  // Communication
  {
    id: 'slack',
    name: 'Slack',
    logo: 'SL',
    color: '#4A154B',
    category: 'communication',
    description: 'Team collaboration hub for productive teamwork.',
    status: 'connected',
    setupTime: '5 minutes',
    popularity: 89,
    features: ['Team Messaging', 'File Sharing', 'App Integrations'],
    pricing: 'Free tier available'
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    logo: 'MT',
    color: '#6264A7',
    category: 'communication',
    description: 'Chat, meetings, and collaboration in Microsoft 365.',
    status: 'connected',
    setupTime: '12 minutes',
    popularity: 85,
    features: ['Video Conferencing', 'Team Chat', 'File Collaboration'],
    pricing: 'Included with Office 365'
  },
  {
    id: 'discord',
    name: 'Discord',
    logo: 'DC',
    color: '#5865F2',
    category: 'communication',
    description: 'Voice, video, and text communication for communities.',
    status: 'coming_soon',
    setupTime: '7 minutes',
    popularity: 78,
    features: ['Voice Channels', 'Text Chat', 'Screen Sharing'],
    pricing: 'Free with premium options'
  },

  // Analytics
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    logo: 'GA',
    color: '#E37400',
    category: 'analytics',
    description: 'Web analytics service to track and report website traffic.',
    status: 'connected',
    setupTime: '20 minutes',
    popularity: 94,
    features: ['Traffic Analysis', 'Conversion Tracking', 'Custom Reports'],
    pricing: 'Free with premium GA360'
  },
  {
    id: 'mixpanel',
    name: 'Mixpanel',
    logo: 'MP',
    color: '#9333EA',
    category: 'analytics',
    description: 'Advanced analytics platform for tracking user interactions.',
    status: 'connected',
    setupTime: '25 minutes',
    popularity: 82,
    features: ['Event Tracking', 'Funnel Analysis', 'Cohort Reports'],
    pricing: 'Free up to 25K events/month'
  },
  {
    id: 'tableau',
    name: 'Tableau',
    logo: 'TB',
    color: '#E97627',
    category: 'analytics',
    description: 'Data visualization and business intelligence platform.',
    status: 'connected',
    setupTime: '35 minutes',
    popularity: 73,
    features: ['Data Visualization', 'Interactive Dashboards', 'Advanced Analytics'],
    pricing: 'Starting at $75/user/month'
  },

  // Support Tools
  {
    id: 'zendesk',
    name: 'Zendesk',
    logo: 'ZD',
    color: '#03363D',
    category: 'support',
    description: 'Customer service software and support ticket system.',
    status: 'connected',
    setupTime: '18 minutes',
    popularity: 88,
    features: ['Ticket Management', 'Knowledge Base', 'Live Chat'],
    pricing: 'Starting at $49/agent/month'
  },
  {
    id: 'intercom',
    name: 'Intercom',
    logo: 'IC',
    color: '#338BF8',
    category: 'support',
    description: 'Customer messaging platform for support and engagement.',
    status: 'connected',
    setupTime: '15 minutes',
    popularity: 84,
    features: ['Live Chat', 'Help Desk', 'Customer Messaging'],
    pricing: 'Starting at $39/seat/month'
  },
  {
    id: 'freshdesk',
    name: 'Freshdesk',
    logo: 'FD',
    color: '#2ECC40',
    category: 'support',
    description: 'Cloud-based customer support software with omnichannel support.',
    status: 'coming_soon',
    setupTime: '22 minutes',
    popularity: 79,
    features: ['Omnichannel Support', 'Automation', 'Knowledge Base'],
    pricing: 'Free tier available'
  }
];

export const integrationCategories = [
  { id: 'all', name: 'All Integrations', count: integrations.length },
  { id: 'crm', name: 'CRM & Sales', count: integrations.filter(i => i.category === 'crm').length },
  { id: 'communication', name: 'Communication', count: integrations.filter(i => i.category === 'communication').length },
  { id: 'analytics', name: 'Analytics', count: integrations.filter(i => i.category === 'analytics').length },
  { id: 'support', name: 'Support Tools', count: integrations.filter(i => i.category === 'support').length }
];

export const getIntegrationsByCategory = (category) => {
  if (category === 'all') return integrations;
  return integrations.filter(integration => integration.category === category);
};

export const getIntegrationById = (id) => {
  return integrations.find(integration => integration.id === id);
};