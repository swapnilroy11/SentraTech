/**
 * SpaceMail Client for SentraTech Demo Booking Email Notifications
 * Custom implementation for SpaceMail API integration
 */

class SpaceMail {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || 'https://api.spacemail.com'; // Assumed API endpoint
  }

  async send(emailData) {
    try {
      const response = await fetch(`${this.baseURL}/v1/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify({
          from: emailData.from,
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text || null
        })
      });

      if (!response.ok) {
        throw new Error(`SpaceMail API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        messageId: result.messageId || result.id,
        data: result
      };
    } catch (error) {
      console.error('SpaceMail send error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Helper method to send demo request notifications
  async sendDemoRequestNotification(formData) {
    const emailContent = this.createDemoRequestEmailHTML(formData);
    
    return await this.send({
      from: 'no-reply@sentratech.net',
      to: ['info@sentratech.net'],
      subject: `New Demo Request from ${formData.company}`,
      html: emailContent
    });
  }

  // Helper method to create formatted email HTML
  createDemoRequestEmailHTML(formData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Demo Request - SentraTech</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0A0A0A; color: #00FF41; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; }
          .field { margin: 10px 0; }
          .label { font-weight: bold; color: #0A0A0A; }
          .value { margin-left: 10px; }
          .footer { background: #0A0A0A; color: #fff; padding: 10px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 New Demo Request Received</h1>
            <p>SentraTech AI Customer Support Platform</p>
          </div>
          
          <div class="content">
            <h2>Contact Information</h2>
            
            <div class="field">
              <span class="label">Full Name:</span>
              <span class="value">${formData.name}</span>
            </div>
            
            <div class="field">
              <span class="label">Email:</span>
              <span class="value">${formData.email}</span>
            </div>
            
            <div class="field">
              <span class="label">Company:</span>
              <span class="value">${formData.company}</span>
            </div>
            
            ${formData.phone ? `
            <div class="field">
              <span class="label">Phone:</span>
              <span class="value">${formData.phone}</span>
            </div>
            ` : ''}
            
            ${formData.call_volume ? `
            <div class="field">
              <span class="label">Monthly Call Volume:</span>
              <span class="value">${formData.call_volume}</span>
            </div>
            ` : ''}
            
            ${formData.message ? `
            <div class="field">
              <span class="label">Message:</span>
              <div class="value" style="margin-top: 5px; padding: 10px; background: white; border-left: 3px solid #00FF41;">
                ${formData.message}
              </div>
            </div>
            ` : ''}
            
            <div class="field">
              <span class="label">Submitted:</span>
              <span class="value">${new Date().toLocaleString()}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from the SentraTech demo request system.</p>
            <p>Please respond to the customer within 24 hours for the best conversion rate.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

// Initialize SpaceMail client
const spacemailApiKey = process.env.REACT_APP_SPACEMAIL_API_KEY;

if (!spacemailApiKey) {
  console.warn('SpaceMail API key not found. Email notifications will not be sent.');
}

export const spacemail = new SpaceMail({
  apiKey: spacemailApiKey
});

// Helper function to send demo request notification
export const sendDemoRequestEmail = async (formData) => {
  if (!spacemailApiKey) {
    console.warn('SpaceMail not configured. Skipping email notification.');
    return { success: false, error: 'SpaceMail not configured' };
  }

  try {
    return await spacemail.sendDemoRequestNotification(formData);
  } catch (error) {
    console.error('Failed to send demo request email:', error);
    return { success: false, error: error.message };
  }
};

export default SpaceMail;