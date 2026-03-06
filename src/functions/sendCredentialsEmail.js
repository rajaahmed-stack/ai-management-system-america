const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

exports.sendCredentialsEmail = functions.firestore
  .document('organizations/{orgId}')
  .onCreate(async (snap, context) => {
    const organization = snap.data();
    const orgId = context.params.orgId;

    try {
      // Get admin user data
      const adminUser = await admin.firestore()
        .collection('users')
        .where('organizationId', '==', orgId)
        .where('role', '==', 'admin')
        .get();

      if (adminUser.empty) return null;

      const adminData = adminUser.docs[0].data();

      const mailOptions = {
        from: `NexusAI <${gmailEmail}>`,
        to: adminData.email,
        subject: `Welcome to NexusAI - Your Organization ${organization.name} is Ready!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .credentials { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #8B5CF6; margin: 20px 0; }
              .credential-item { margin: 15px 0; }
              .label { font-weight: bold; color: #666; }
              .value { font-family: monospace; background: #f4f4f4; padding: 8px 12px; border-radius: 4px; margin-top: 5px; display: inline-block; }
              .button { background: #8B5CF6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Welcome to NexusAI!</h1>
                <p>Your organization is ready for AI transformation</p>
              </div>
              <div class="content">
                <h2>Hello ${adminData.fullName},</h2>
                <p>Your organization <strong>${organization.name}</strong> has been successfully created in the <strong>${organization.industry}</strong> industry.</p>
                
                <div class="credentials">
                  <h3>🔐 Your Login Credentials</h3>
                  <div class="credential-item">
                    <div class="label">Organization ID:</div>
                    <div class="value">${organization.organizationId}</div>
                  </div>
                  <div class="credential-item">
                    <div class="label">Password:</div>
                    <div class="value">[System Generated Password]</div>
                  </div>
                  <div class="credential-item">
                    <div class="label">Email:</div>
                    <div class="value">${adminData.email}</div>
                  </div>
                </div>

                <a href="https://yourapp.com/organization-login" class="button">
                  Access Your Dashboard ›
                </a>

                <div style="background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107;">
                  <strong>⚠️ Important Security Notice:</strong>
                  <p>Please save these credentials securely. For security reasons, we don't include the password in this email. You should have received it during the registration process.</p>
                </div>

                <div class="footer">
                  <p>Need help? Contact our support team at support@nexusai.com</p>
                  <p>© 2024 NexusAI. All rights reserved.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await mailTransport.sendMail(mailOptions);
      console.log('Credentials email sent to:', adminData.email);
      
    } catch (error) {
      console.error('Error sending email:', error);
    }
  });