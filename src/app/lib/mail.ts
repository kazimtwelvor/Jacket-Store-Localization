import nodemailer from "nodemailer";

// Email configuration interface
interface EmailConfig {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  text?: string;
}

// Email aliases enum for type safety
export enum EmailAlias {
  INFO = "info",
  ORDERS = "orders",
  SUPPORT = "support",
  NOREPLY = "noreply",
}

// Get email address from environment variables
const getEmailFromAlias = (alias: EmailAlias): string => {
  const emailMap = {
    [EmailAlias.INFO]: process.env.EMAIL_FROM_INFO,
    [EmailAlias.ORDERS]: process.env.EMAIL_FROM_ORDERS,
    [EmailAlias.SUPPORT]: process.env.EMAIL_FROM_SUPPORT,
    [EmailAlias.NOREPLY]: process.env.EMAIL_FROM_NOREPLY,
  };

  return (
    emailMap[alias] || process.env.EMAIL_FROM_DEFAULT || "noreply@example.com"
  );
};

// Create transporter with SMTP configuration
const createTransporter = () => {
  // Support both OAuth2 and App Password authentication
  const isOAuth2 =
    process.env.EMAIL_OAUTH_CLIENT_ID && process.env.EMAIL_OAUTH_CLIENT_SECRET;

  if (isOAuth2) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.EMAIL_OAUTH_CLIENT_ID,
        clientSecret: process.env.EMAIL_OAUTH_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_OAUTH_REFRESH_TOKEN,
        accessToken: process.env.EMAIL_OAUTH_ACCESS_TOKEN,
      },
    });
  }

  // Fallback to SMTP with app password
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number.parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // App password for Gmail
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Main email sending function
export const sendEmail = async (config: EmailConfig): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: config.from || getEmailFromAlias(EmailAlias.NOREPLY),
      to: Array.isArray(config.to) ? config.to.join(", ") : config.to,
      subject: config.subject,
      html: config.html,
      text: config.text || stripHtml(config.html),
    };

    console.log('📧 Sending email to:', mailOptions.to, 'from:', mailOptions.from);
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', mailOptions.to);
    return true;
  } catch (error) {
    console.error('❌ Email failed to:', config.to, 'Error:', error.message);
    return false;
  }
};

// Utility function to strip HTML for text version
const stripHtml = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
};

// Predefined email functions for common use cases
export const sendWelcomeEmail = async (
  to: string,
  name: string
): Promise<boolean> => {
  const { getWelcomeEmailTemplate } = await import("./email-template");

  return sendEmail({
    to,
    subject: "Welcome to LeatherJackets Mail!",
    html: getWelcomeEmailTemplate(name),
    from: getEmailFromAlias(EmailAlias.INFO),
  });
};

export const sendLoginNotificationEmail = async (
  to: string,
  name: string,
  loginTime: Date
): Promise<boolean> => {
  const { getLoginNotificationTemplate } = await import("./email-template");

  return sendEmail({
    to,
    subject: "New Login to Your Account",
    html: getLoginNotificationTemplate(name, loginTime),
    from: getEmailFromAlias(EmailAlias.NOREPLY),
  });
};

export const sendPasswordResetEmail = async (
  to: string,
  name: string,
  resetLink: string
): Promise<boolean> => {
  const { getPasswordResetTemplate } = await import("./email-template");

  return sendEmail({
    to,
    subject: "Reset Your Password",
    html: getPasswordResetTemplate(name, resetLink),
    from: getEmailFromAlias(EmailAlias.SUPPORT),
  });
};

export const sendEmailVerificationEmail = async (
  to: string,
  name: string,
  verificationLink: string
): Promise<boolean> => {
  const { getEmailVerificationTemplate } = await import("./email-template");

  return sendEmail({
    to,
    subject: "Verify Your Email Address",
    html: getEmailVerificationTemplate(name, verificationLink),
    from: getEmailFromAlias(EmailAlias.NOREPLY),
  });
};

export const sendOrderConfirmationEmail = async (
  to: string,
  name: string,
  orderNumber: string,
  orderTotal: string,
  items: any[],
  trackOrderUrl: string
): Promise<boolean> => {
  const { getOrderConfirmationTemplate } = await import("./email-template");

  return sendEmail({
    to,
    subject: `Order Confirmation #${orderNumber}`,
    html: getOrderConfirmationTemplate(
      name,
      orderNumber,
      orderTotal,
      items,
      trackOrderUrl
    ),
    from: "info@fineystjackets.com",
  });
};

export const sendAdminOrderNotification = async (
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  orderTotal: string,
  items: any[]
): Promise<boolean> => {
  const { getAdminOrderNotificationTemplate } = await import(
    "./email-template"
  );

  const adminEmails = [
    process.env.ADMIN_USER_1,
    process.env.ADMIN_USER_2,
    process.env.ADMIN_USER_3,
  ].filter(Boolean);

  if (adminEmails.length === 0) {
    console.warn("No admin emails configured");
    return false;
  }

  return sendEmail({
    to: adminEmails,
    subject: `New Order Received #${orderNumber}`,
    html: getAdminOrderNotificationTemplate(
      customerEmail,
      customerName,
      orderNumber,
      orderTotal,
      items
    ),
    from: "info@fineystjackets.com",
  });
};

export const sendOrderEmails = async (
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  orderTotal: string,
  items: any[],
  trackOrderUrl: string
): Promise<{ customerEmailSent: boolean; adminEmailSent: boolean }> => {
  const [customerEmailSent, adminEmailSent] = await Promise.all([
    sendOrderConfirmationEmail(
      customerEmail,
      customerName,
      orderNumber,
      orderTotal,
      items,
      trackOrderUrl
    ),
    sendAdminOrderNotification(
      customerEmail,
      customerName,
      orderNumber,
      orderTotal,
      items
    ),
  ]);

  return { customerEmailSent, adminEmailSent };
};
