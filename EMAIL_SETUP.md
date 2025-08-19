# 📧 Email Setup Guide

## How to Connect the Contact Form to Your Email

The contact form is already configured to send emails. You just need to set up the email configuration.

### Step 1: Create Environment File

Create a file called `.env.local` in the root directory of your project with the following content:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
LEAD_TO_EMAIL=your-email@gmail.com

# Optional: Webhook URL for external integrations
# LEAD_WEBHOOK_URL=https://your-webhook-url.com/webhook
```

### Step 2: Configure Gmail (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `SMTP_PASS`

### Step 3: Alternative Email Services

#### Outlook/Hotmail:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

#### Yahoo:
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

#### Custom Domain:
```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
```

### Step 4: Test the Setup

1. Restart your development server
2. Fill out the contact form
3. Check your email for the notification

### Email Template

The email will include:
- ✅ Full Name
- ✅ Phone Number  
- ✅ Email Address
- ✅ Optional Message
- ✅ UTM Source (if available)
- ✅ Timestamp
- ✅ Professional Hebrew formatting

### Security Features

- ✅ Rate limiting (5 requests per 15 minutes)
- ✅ Honeypot anti-spam protection
- ✅ Input validation
- ✅ Secure SMTP connection

### Troubleshooting

**If emails don't arrive:**
1. Check your spam folder
2. Verify SMTP credentials
3. Ensure app password is correct (for Gmail)
4. Check server logs for errors

**Common Gmail Issues:**
- Use app password, not regular password
- Enable "Less secure app access" (not recommended)
- Check if 2FA is enabled

### Example .env.local File

```env
# Replace with your actual email details
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mybusiness@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
LEAD_TO_EMAIL=mybusiness@gmail.com
```

After setting this up, every form submission will be sent directly to your email! 📬
