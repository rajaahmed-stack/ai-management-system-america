const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with your API key
sgMail.setApiKey(functions.config().sendgrid.key);

exports.sendWelcomeEmail = functions.firestore
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
      
      const msg = {
        to: adminData.email,
        from: {
          email: 'rb4733164@gmail.com', // Your verified SendGrid email
          name: 'NexusAI'
        },
        templateId: 'your-sendgrid-template-id', // Optional: Create template in SendGrid
        dynamic_template_data: {
          organizationName: organization.name,
          organizationId: organization.organizationId,
          adminName: adminData.fullName,
          loginUrl: 'https://yourapp.com/organization-login'
        }
      };

      await sgMail.send(msg);
      console.log('Welcome email sent to:', adminData.email);
      
    } catch (error) {
      console.error('Error sending email:', error);
    }
  });