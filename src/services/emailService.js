// Free email service using various APIs that don't require accounts
class EmailService {
  constructor() {
    this.services = [
      this.web3Forms.bind(this),
      this.resendFallback.bind(this),
      this.smtpJS.bind(this)
    ];
  }

  // Method 1: Web3Forms (Free, no account needed for testing)
  async web3Forms(email, organizationId, password, organizationName, adminName) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apikey: 'b7a4c0c8-8a4a-4b3e-9c9a-8b3a2c1d4e5f', // Demo key - get free one at web3forms.com
          subject: `Welcome to NexusAI - ${organizationName}`,
          from_name: 'NexusAI',
          email: email,
          message: this.createEmailTemplate(organizationId, password, organizationName, adminName)
        })
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.log('Web3Forms failed, trying next service...');
      return false;
    }
  }

  // Method 2: Simple fetch to any email API
  async resendFallback(email, organizationId, password, organizationName, adminName) {
    try {
      // This is a template - you can use any free email API
      const response = await fetch('https://your-email-service.com/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: `Welcome to NexusAI - ${organizationName}`,
          html: this.createEmailTemplate(organizationId, password, organizationName, adminName)
        })
      });
      
      return response.ok;
    } catch (error) {
      console.log('Resend fallback failed');
      return false;
    }
  }

  // Method 3: SMTP.js (Client-side email)
  async smtpJS(email, organizationId, password, organizationName, adminName) {
    // SMTP.js requires minimal setup but works client-side
    return new Promise((resolve) => {
      // This would require including SMTP.js script
      console.log('SMTP.js method available with minimal setup');
      resolve(false);
    });
  }

  // Create email template
  createEmailTemplate(organizationId, password, organizationName, adminName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .credentials { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #8B5CF6; margin: 20px 0; }
          .button { background: #8B5CF6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to NexusAI!</h1>
            <p>Your organization is ready for AI transformation</p>
          </div>
          <div class="content">
            <h2>Hello ${adminName},</h2>
            <p>Your organization <strong>${organizationName}</strong> has been successfully created!</p>
            
            <div class="credentials">
              <h3>🔐 Your Login Credentials</h3>
              <p><strong>Organization ID:</strong> ${organizationId}</p>
              <p><strong>Password:</strong> ${password}</p>
              <p><strong>Email:</strong> ${email}</p>
            </div>

            <a href="http://localhost:3000/organization-login" class="button">
              Access Your Dashboard ›
            </a>

            <p><strong>Important:</strong> Save these credentials securely.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Main send method that tries all services
  async sendEmail(email, organizationId, password, organizationName, adminName) {
    // Always log to console for development
    console.log('=== EMAIL CREDENTIALS ===');
    console.log('To:', email);
    console.log('Organization ID:', organizationId);
    console.log('Password:', password);
    console.log('Organization:', organizationName);
    console.log('=======================');

    // Try each email service until one works
    for (const service of this.services) {
      try {
        const success = await service(email, organizationId, password, organizationName, adminName);
        if (success) {
          console.log('✅ Email sent successfully');
          return true;
        }
      } catch (error) {
        console.log('Service failed, trying next...');
      }
    }

    // If all services fail, create a mailto link as fallback
    this.createMailtoLink(email, organizationId, password, organizationName, adminName);
    return false;
  }

  // Ultimate fallback: Create mailto link
  createMailtoLink(email, organizationId, password, organizationName, adminName) {
    const subject = `Welcome to NexusAI - ${organizationName}`;
    const body = `
Hello ${adminName},

Your organization "${organizationName}" has been created!

Credentials:
Organization ID: ${organizationId}
Password: ${password}
Login: http://localhost:3000/organization-login

Save these credentials securely.

Best regards,
NexusAI Team
    `.trim();

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Store this link for the user to click
    localStorage.setItem('lastEmailLink', mailtoLink);
    console.log('📧 Email draft created. User can click to send:', mailtoLink);
    
    return mailtoLink;
  }
}

export default new EmailService();