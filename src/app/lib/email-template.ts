// Base email template with generic branding and styling
const getBaseTemplate = (content: string, title = "Your Store"): string => {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          
          body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              line-height: 1.6;
              color: #131a31;
              background-color: #f8f9fa;
          }
          
          .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .email-header {
              background: #000000;
              color: white;
              padding: 40px 30px;
              text-align: center;
          }
          
          .email-header h1 {
              font-size: 28px;
              font-weight: 700;
              margin-bottom: 8px;
          }
          
          .email-header p {
              font-size: 16px;
              opacity: 0.9;
          }
          
          .email-body {
              padding: 40px 30px;
          }
          
          .email-body h2 {
              color: #131a31;
              font-size: 24px;
              margin-bottom: 20px;
          }
          
          .email-body p {
              margin-bottom: 16px;
              font-size: 16px;
              line-height: 1.6;
              color: #131a31;
          }
          
          .button {
              display: inline-block;
              background: #000000;
              color: white;
              text-decoration: none;
              padding: 14px 28px;
              border-radius: 6px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
              transition: transform 0.2s ease;
          }
          
          .button:hover {
              transform: translateY(-1px);
          }
          
          .info-box {
              background-color: #f7fafc;
              border-left: 4px solid #000000;
              padding: 16px 20px;
              margin: 20px 0;
              border-radius: 4px;
          }
          
          .info-box p {
              color: #131a31;
          }
          
          .email-footer {
              background-color: #131a31;
              color: white;
              padding: 30px;
              text-align: center;
          }
          
          .email-footer p {
              font-size: 14px;
              color: #ffffff;
              opacity: 0.8;
              margin-bottom: 8px;
          }
          
          .social-links {
              margin: 20px 0;
          }
          
          .social-links a {
              display: inline-block;
              margin: 0 10px;
              color: #000000;
              text-decoration: none;
          }
          
          .social-links a:hover {
              color: #ffffff;
          }
          
          @media (max-width: 600px) {
              .email-container {
                  margin: 0;
                  border-radius: 0;
              }
            
              .email-header,
              .email-body,
              .email-footer {
                  padding: 20px;
              }
            
              .email-header h1 {
                  font-size: 24px;
              }
            
              .button {
                  display: block;
                  text-align: center;
                  margin: 20px 0;
              }
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="email-header">
              <h1>FINEYST</h1>
              <p>Premium Quality Jackets</p>
          </div>
          
          <div class="email-body">
              ${content}
          </div>
          
          <div class="email-footer">
              <p>© ${new Date().getFullYear()} Fineyst. All rights reserved.</p>
              <p>You received this email because you have an account with us.</p>
              <div class="social-links">
                  <a href="#">Facebook</a>
                  <a href="#">Instagram</a>
                  <a href="#">Twitter</a>
              </div>
              <p style="font-size: 12px; opacity: 0.6;">
                  If you no longer wish to receive these emails, you can 
                  <a href="#" style="color: #000000;">unsubscribe here</a>.
              </div>
          </div>
      </div>
  </body>
  </html>
    `
  }
  
  // Welcome email template
  export const getWelcomeEmailTemplate = (name: string): string => {
    const content = `
      <h2>Welcome to Fineyst, ${name}! 🧥</h2>
      
      <p>Thank you for joining our community of jacket enthusiasts! We're excited to help you discover premium quality jackets that combine style, comfort, and durability.</p>
      
      <p>Here's what you can expect from us:</p>
      
      <div class="info-box">
          <p><strong>🧥 Premium Quality:</strong> Handcrafted jackets with finest materials</p>
          <p><strong>🚚 Free Shipping:</strong> Complimentary shipping on all orders</p>
          <p><strong>⚡ Fast Delivery:</strong> Quick processing and shipping</p>
          <p><strong>💯 Quality Guarantee:</strong> 100% satisfaction guarantee</p>
          <p><strong>🔄 Easy Returns:</strong> Hassle-free return policy</p>
      </div>
      
      <p>Ready to explore our collection?</p>
      
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/shop" class="button">Shop Now</a>
      
      <p>From leather jackets to denim, letterman to trench coats, we've got you covered with premium materials and timeless designs.</p>
      
      <p>If you have any questions, our customer support team is here to help. Just reply to this email or contact us at <a href="mailto:info@fineystjackets.com" style="color: #000000;">info@fineystjackets.com</a>.</p>
      
      <p>Let's find your perfect jacket!</p>
      <p><strong>The Fineyst Team</strong></p>
    `
  
    return getBaseTemplate(content, "Welcome to Fineyst")
  }
  
  // Login notification template
  export const getLoginNotificationTemplate = (name: string, loginTime: Date): string => {
    const formattedTime = loginTime.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    })
  
    const content = `
      <h2>New Login Detected</h2>
      
      <p>Hi ${name},</p>
      
      <p>We detected a new login to your Fineyst account:</p>
      
      <div class="info-box">
          <p><strong>Time:</strong> ${formattedTime}</p>
          <p><strong>Location:</strong> Based on IP address</p>
          <p><strong>Device:</strong> Web Browser</p>
      </div>
      
      <p>If this was you, no action is needed. If you don't recognize this login, please secure your account immediately:</p>
      
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password" class="button">Change Password</a>
      
      <p>For additional security, consider enabling two-factor authentication on your account.</p>
      
      <p>Stay safe,<br><strong>The Fineyst Security Team</strong></p>
    `
  
    return getBaseTemplate(content, "New Login Detected")
  }
  
  // Password reset template
  export const getPasswordResetTemplate = (name: string, resetLink: string): string => {
    const content = `
      <h2>Reset Your Password</h2>
      
      <p>Hi ${name},</p>
      
      <p>We received a request to reset your password for your account. If you made this request, click the button below to reset your password:</p>
      
      <a href="${resetLink}" class="button">Reset Password</a>
      
      <div class="info-box">
          <p><strong>⏰ This link expires in 1 hour</strong></p>
          <p>For security reasons, this password reset link will only work once and expires after 60 minutes.</p>
      </div>
      
      <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
      
      <p>If you're having trouble clicking the button, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #fe7224;">${resetLink}</p>
      
      <p>Need help? Contact our support team at <a href="mailto:info@fineystjackets.com" style="color: #fe7224;">info@fineystjackets.com</a></p>
      
      <p>Best regards,<br><strong>The Team</strong></p>
    `
  
    return getBaseTemplate(content, "Reset Your Password")
  }
  
  // Email verification template
  export const getEmailVerificationTemplate = (name: string, verificationLink: string): string => {
    const content = `
      <h2>Verify Your Email Address</h2>
      
      <p>Hi ${name},</p>
      
      <p>Thank you for signing up for Fineyst! To complete your registration and start shopping for premium jackets, please verify your email address by clicking the button below:</p>
      
      <a href="${verificationLink}" class="button">Verify Email Address</a>
      
      <div class="info-box">
          <p><strong>Why verify your email?</strong></p>
          <p>• Secure your account and enable password recovery</p>
          <p>• Receive order confirmations and shipping updates</p>
          <p>• Get exclusive offers and style tips</p>
          <p>• Access member-only collections</p>
      </div>
      
      <p>This verification link will expire in 24 hours for security reasons.</p>
      
      <p>If you're having trouble clicking the button, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #000000;">${verificationLink}</p>
      
      <p>If you didn't create an account with us, you can safely ignore this email.</p>
      
      <p>Welcome to the Fineyst family!<br><strong>The Fineyst Team</strong></p>
    `
  
    return getBaseTemplate(content, "Verify Your Email Address")
  }
  
  // Order confirmation template
  export const getOrderConfirmationTemplate = (
    name: string,
    orderNumber: string,
    orderTotal: string,
    items: any[],
    trackOrderUrl: string
  ): string => {
    const itemsHtml = items
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #131a31;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #131a31;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #131a31;">$${item.price}</td>
      </tr>
    `,
      )
      .join("")
  
    const content = `
      <h2>Order Confirmation #${orderNumber}</h2>
      
      <p>Hi ${name},</p>
      
      <p>Thank you for your order! We've received your custom patch request and our design team is already working on bringing your vision to life.</p>
      
      <div class="info-box">
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Order Total:</strong> $${orderTotal}</p>
          <p><strong>Estimated Delivery:</strong> 7-10 business days</p>
          <p><strong>Shipping:</strong> FREE - No minimum required</p>
      </div>
      
      <h3 style="margin: 30px 0 15px 0; color: #131a31;">Order Details</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f7fafc;">
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0; color: #131a31;">Item</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e2e8f0; color: #131a31;">Qty</th>
            <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e2e8f0; color: #131a31;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      
      <p><strong>Track Your Order:</strong></p>
      <div class="info-box">
          <p>Use your Order ID <strong>${orderNumber}</strong> to track your order status anytime.</p>
          <p>Get real-time updates on processing, shipping, and delivery.</p>
      </div>
      
      <a href="${trackOrderUrl}" class="button">Track My Order</a>
      
      <p><strong>Want More Features?</strong></p>
      <div class="info-box">
          <p>🔐 <strong>Sign up for an account</strong> to unlock:</p>
          <p>• Order history and easy reordering</p>
          <p>• Exclusive member discounts</p>
          <p>• Faster checkout process</p>
          <p>• Wishlist and favorites</p>
      </div>
      
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/auth/register" class="button" style="background: #28a745;">Create Account</a>
      
      <p>We'll keep you updated throughout the process. Questions? Contact us at <a href="mailto:info@fineystjackets.com" style="color: #fe7224;">info@fineystjackets.com</a></p>
      
      <p>Thank you for choosing Fineyst!<br><strong>The Fineyst Team</strong></p>
    `
  
    return getBaseTemplate(content, `Order Confirmation #${orderNumber}`)
  }
  
  // Quote request confirmation template
  export const getQuoteRequestTemplate = (name: string, quoteNumber: string): string => {
    const content = `
      <h2>Your Free Quote Request #${quoteNumber}</h2>
      
      <p>Hi ${name},</p>
      
      <p>Thank you for requesting a free quote from Custom Patches! We've received your project details and our team is preparing your personalized quote.</p>
      
      <div class="info-box">
          <p><strong>Quote Number:</strong> #${quoteNumber}</p>
          <p><strong>Response Time:</strong> Within 2-4 hours</p>
          <p><strong>Free Design:</strong> Included with your quote</p>
          <p><strong>No Setup Fees:</strong> Always free</p>
      </div>
      
      <p><strong>What's included in your quote:</strong></p>
      <div class="info-box">
          <p>• Detailed pricing breakdown</p>
          <p>• Free design mockup</p>
          <p>• Material recommendations</p>
          <p>• Production timeline</p>
          <p>• Shipping information</p>
      </div>
      
      <p>Our patch experts will review your requirements and create a custom solution that fits your needs and budget perfectly.</p>
      
      <a href="https://custompatches.us.com/quotes/${quoteNumber}" class="button">View Quote Status</a>
      
      <p>In the meantime, feel free to browse our <a href="https://custompatches.us.com/gallery" style="color: #fe7224;">patch gallery</a> for inspiration!</p>
      
      <p>Questions? Reply to this email or call us at <strong>(555) 123-PATCH</strong></p>
      
      <p>Looking forward to creating amazing patches for you!<br><strong>The Custom Patches Team</strong></p>
    `
  
    return getBaseTemplate(content, `Quote Request #${quoteNumber}`)
  }
  
  // Design approval template
  export const getDesignApprovalTemplate = (name: string, orderNumber: string, designUrl: string): string => {
    const content = `
      <h2>Your Patch Design is Ready for Approval!</h2>
      
      <p>Hi ${name},</p>
      
      <p>Great news! Our design team has completed the mockup for your custom patch order #${orderNumber}.</p>
      
      <div class="info-box">
          <p><strong>Order Number:</strong> #${orderNumber}</p>
          <p><strong>Design Status:</strong> Ready for Review</p>
          <p><strong>Approval Deadline:</strong> 7 days</p>
      </div>
      
      <p>Please review your design carefully and let us know if you'd like any changes. Remember, we offer unlimited revisions until you're 100% satisfied!</p>
      
      <a href="${designUrl}" class="button">View & Approve Design</a>
      
      <p><strong>Design Review Options:</strong></p>
      <div class="info-box">
          <p>✅ <strong>Approve:</strong> Start production immediately</p>
          <p>🔄 <strong>Request Changes:</strong> We'll revise and send updated mockup</p>
          <p>📞 <strong>Discuss:</strong> Schedule a call with our design team</p>
      </div>
      
      <p>Once you approve the design, we'll begin production and your patches will be ready in 5-7 business days.</p>
      
      <p>Need changes or have questions? Simply reply to this email with your feedback or contact our design team at <a href="mailto:design@custompatches.us.com" style="color: #fe7224;">design@custompatches.us.com</a></p>
      
      <p>We're excited to bring your vision to life!<br><strong>The Custom Patches Design Team</strong></p>
    `
  
    return getBaseTemplate(content, "Design Ready for Approval")
  }