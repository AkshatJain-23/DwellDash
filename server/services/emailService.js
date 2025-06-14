const nodemailer = require('nodemailer');

// Email configuration
const createTransporter = async () => {
  // For development, you can use Gmail with App Password
  // For production, use a proper email service like SendGrid, Mailgun, etc.
  
  if (process.env.EMAIL_SERVICE === 'gmail') {
    console.log('📧 Configuring Gmail SMTP...');
    console.log(`📧 Email User: ${process.env.EMAIL_USER}`);
    console.log(`📧 Email From: ${process.env.EMAIL_FROM}`);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Gmail SMTP configuration incomplete!');
      console.error('❌ Please set EMAIL_USER and EMAIL_PASS environment variables');
      throw new Error('Gmail SMTP configuration incomplete');
    }
    
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your Gmail App Password
      }
    });
  }
  
  // Default to Ethereal Email for testing
  console.log('📧 Using Ethereal Email for testing...');
  
  try {
    // Create a test account automatically
    const testAccount = await nodemailer.createTestAccount();
    
    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (error) {
    console.log('⚠️  Failed to create Ethereal test account, using fallback...');
    
    // Fallback configuration
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'test@dwelldash.demo',
        pass: process.env.EMAIL_PASS || 'demo123'
      }
    });
  }
};

// Send password reset email
const sendPasswordResetEmail = async (userEmail, resetToken, userName = '') => {
  try {
    const transporter = await createTransporter();
    
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: {
        name: 'DwellDash',
        address: process.env.EMAIL_FROM || 'dwelldash3@gmail.com'
      },
      to: userEmail,
      subject: 'Reset Your DwellDash Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Reset Your Password - DwellDash</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background-color: #059669; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .button { display: inline-block; background-color: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .button:hover { background-color: #047857; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .warning { background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 DwellDash</h1>
              <p>Password Reset Request</p>
            </div>
            
            <div class="content">
              <h2>Hello${userName ? ` ${userName}` : ''}!</h2>
              
              <p>We received a request to reset your password for your DwellDash account associated with <strong>${userEmail}</strong>.</p>
              
              <p>Click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset My Password</a>
              </div>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background-color: #f1f5f9; padding: 10px; border-radius: 5px;">
                ${resetUrl}
              </p>
              
              <div class="warning">
                <strong>⚠️ Important Security Information:</strong>
                <ul>
                  <li>This link will expire in <strong>1 hour</strong></li>
                  <li>If you didn't request this password reset, please ignore this email</li>
                  <li>Never share this link with anyone</li>
                  <li>We will never ask for your password via email</li>
                </ul>
              </div>
              
              <p>If you're having trouble with the password reset process, please contact our support team.</p>
              
              <p>Best regards,<br>The DwellDash Team</p>
            </div>
            
            <div class="footer">
              <p>© 2024 DwellDash. All rights reserved.</p>
              <p>This is an automated email. Please do not reply to this email.</p>
              <p>If you did not request this password reset, please ignore this email or contact support if you have concerns.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hello${userName ? ` ${userName}` : ''}!

We received a request to reset your password for your DwellDash account.

Please click the following link to reset your password:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request this password reset, please ignore this email.

Best regards,
The DwellDash Team

---
© 2024 DwellDash. All rights reserved.
This is an automated email. Please do not reply.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('\n✅ Password reset email sent successfully!');
    console.log('📧 Email ID:', info.messageId);
    
    // For Ethereal Email testing, provide preview URL
    if (info.messageId && process.env.NODE_ENV === 'development') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('🔗 Preview URL (for testing):', previewUrl);
      }
    }
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: process.env.NODE_ENV === 'development' ? nodemailer.getTestMessageUrl(info) : null
    };
    
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    throw new Error('Failed to send email. Please try again later.');
  }
};

// Send welcome email (optional)
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: {
        name: 'DwellDash',
        address: process.env.EMAIL_FROM || 'dwelldash3@gmail.com'
      },
      to: userEmail,
      subject: 'Welcome to DwellDash! 🏠',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Welcome to DwellDash</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background-color: #059669; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .button { display: inline-block; background-color: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 Welcome to DwellDash!</h1>
            </div>
            
            <div class="content">
              <h2>Hello ${userName}!</h2>
              
              <p>Welcome to DwellDash - your premier destination for finding the perfect PG accommodation!</p>
              
              <p>Your account has been successfully created and you can now:</p>
              <ul>
                <li>🔍 Browse thousands of verified PG properties</li>
                <li>💬 Chat directly with property owners</li>
                <li>📱 Contact owners via WhatsApp-style messaging</li>
                <li>🏠 List your own properties (if you're an owner)</li>
                <li>📊 Manage your listings from the dashboard</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:3001'}/properties" class="button">Start Exploring Properties</a>
              </div>
              
              <p>If you have any questions or need assistance, our support team is here to help!</p>
              
              <p>Happy house hunting!</p>
              <p>The DwellDash Team</p>
            </div>
            
            <div class="footer">
              <p>© 2024 DwellDash. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', info.messageId);
    
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    // Don't throw error for welcome email - it's not critical
    return { success: false, error: error.message };
  }
};

// Send contact form email
const sendContactEmail = async (contactData) => {
  try {
    const transporter = await createTransporter();
    
    const { firstName, lastName, email, subject, message } = contactData;
    
    const mailOptions = {
      from: {
        name: 'DwellDash Contact Form',
        address: process.env.EMAIL_FROM || 'dwelldash3@gmail.com'
      },
      to: 'dwelldash3@gmail.com', // Always send to this email
      replyTo: email, // Allow easy reply to the sender
      subject: `Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Contact Form Submission - DwellDash</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background-color: #059669; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .info-box { background-color: #f1f5f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .message-box { background-color: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
            .label { font-weight: bold; width: 30%; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 Contact Form Submission</h1>
              <p>New message from DwellDash website</p>
            </div>
            
            <div class="content">
              <h2>Contact Details</h2>
              
              <div class="info-box">
                <table>
                  <tr>
                    <td class="label">Name:</td>
                    <td>${firstName} ${lastName}</td>
                  </tr>
                  <tr>
                    <td class="label">Email:</td>
                    <td><a href="mailto:${email}">${email}</a></td>
                  </tr>
                  <tr>
                    <td class="label">Subject:</td>
                    <td>${subject}</td>
                  </tr>
                  <tr>
                    <td class="label">Date:</td>
                    <td>${new Date().toLocaleString()}</td>
                  </tr>
                </table>
              </div>
              
              <h3>Message:</h3>
              <div class="message-box">
                <p style="white-space: pre-wrap; margin: 0;">${message}</p>
              </div>
              
              <p><em>You can reply directly to this email to respond to the sender.</em></p>
            </div>
            
            <div class="footer">
              <p>© 2024 DwellDash Contact Form System</p>
              <p>This email was automatically generated from the contact form on DwellDash website.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Contact Form Submission - DwellDash

From: ${firstName} ${lastName}
Email: ${email}
Subject: ${subject}
Date: ${new Date().toLocaleString()}

Message:
${message}

---
You can reply directly to this email to respond to the sender.
© 2024 DwellDash Contact Form System
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('\n✅ Contact form email sent successfully!');
    console.log('📧 Email ID:', info.messageId);
    console.log(`📧 From: ${firstName} ${lastName} (${email})`);
    console.log(`📧 Subject: ${subject}`);
    
    // For Ethereal Email testing, provide preview URL
    if (info.messageId && process.env.NODE_ENV === 'development') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('🔗 Preview URL (for testing):', previewUrl);
      }
    }
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: process.env.NODE_ENV === 'development' ? nodemailer.getTestMessageUrl(info) : null
    };
    
  } catch (error) {
    console.error('❌ Failed to send contact form email:', error);
    throw new Error('Failed to send contact form email. Please try again later.');
  }
};

// Send verification email
const sendVerificationEmail = async (userEmail, userName, verificationToken) => {
  try {
    const transporter = await createTransporter();
    
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3001'}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: {
        name: 'DwellDash',
        address: process.env.EMAIL_FROM || 'dwelldash3@gmail.com'
      },
      to: userEmail,
      subject: 'Verify Your DwellDash Email Address 📧',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Verify Your Email - DwellDash</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background-color: #059669; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .button { display: inline-block; background-color: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .button:hover { background-color: #047857; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .info-box { background-color: #e0f2fe; border: 1px solid #0891b2; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 DwellDash</h1>
              <p>Email Verification Required</p>
            </div>
            
            <div class="content">
              <h2>Hello ${userName}!</h2>
              
              <p>Thank you for joining DwellDash! To complete your account setup and access all features, please verify your email address.</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <div class="info-box">
                <p><strong>Why verify your email?</strong></p>
                <ul>
                  <li>🔒 Secure your account</li>
                  <li>📧 Receive important notifications</li>
                  <li>🔄 Enable password reset functionality</li>
                  <li>✅ Access all DwellDash features</li>
                </ul>
              </div>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background-color: #f1f5f9; padding: 10px; border-radius: 5px;">
                ${verificationUrl}
              </p>
              
              <p><strong>Note:</strong> This verification link will expire in 24 hours for security reasons.</p>
              
              <p>If you didn't create a DwellDash account, please ignore this email.</p>
              
              <p>Best regards,<br>The DwellDash Team</p>
            </div>
            
            <div class="footer">
              <p>© 2024 DwellDash. All rights reserved.</p>
              <p>This is an automated email. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hello ${userName}!

Thank you for joining DwellDash! To complete your account setup, please verify your email address.

Click the following link to verify your email:
${verificationUrl}

This verification link will expire in 24 hours.

If you didn't create a DwellDash account, please ignore this email.

Best regards,
The DwellDash Team

---
© 2024 DwellDash. All rights reserved.
This is an automated email. Please do not reply.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('\n✅ Verification email sent successfully!');
    console.log('📧 Email ID:', info.messageId);
    
    // For Ethereal Email testing, provide preview URL
    if (info.messageId && process.env.NODE_ENV === 'development') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('🔗 Preview URL (for testing):', previewUrl);
      }
    }
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: process.env.NODE_ENV === 'development' ? nodemailer.getTestMessageUrl(info) : null
    };
    
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    throw new Error('Failed to send verification email. Please try again later.');
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendContactEmail,
  sendVerificationEmail
}; 