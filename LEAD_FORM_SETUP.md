# Lead Form Setup Instructions

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Lead Form Configuration

# Webhook Integration (Zapier/Make)
LEAD_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/your-webhook-url

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
LEAD_TO_EMAIL=leads@yourcompany.com

# Google Sheets Integration (Optional)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_KEY={"type": "service_account", ...}
GOOGLE_SHEETS_ID=your-sheets-id

# WhatsApp Number (for thank you page)
WHATSAPP_NUMBER=972501234567
```

## Features Implemented

### ✅ Lead Form Page (`/lead`)
- Modern, responsive design with Hebrew RTL support
- Form fields: Full Name, Phone, Email, Message (optional)
- Client-side validation with Zod
- Honeypot anti-spam protection
- UTM parameter capture
- Loading states and error handling
- Analytics event firing (GA4)

### ✅ API Route (`/api/lead`)
- POST handler with validation
- Rate limiting (5 requests per 15 minutes)
- Honeypot spam protection
- Webhook integration (Zapier/Make)
- Email integration (SMTP)
- Error handling and logging

### ✅ Thank You Page (`/lead/thank-you`)
- Success confirmation
- WhatsApp CTA button
- Navigation back to homepage
- Responsive design

### ✅ Features
- **Mobile-first design** - Perfect on all devices
- **RTL Hebrew support** - Full right-to-left layout
- **Accessibility** - ARIA labels, focus states, keyboard navigation
- **Anti-spam** - Honeypot field and rate limiting
- **Analytics** - GA4 event tracking
- **UTM tracking** - Captures campaign parameters
- **Multiple integrations** - Webhook, Email, Google Sheets

## Usage

1. **QR Code Setup**: Point your QR code to `https://yoursite.com/lead`
2. **UTM Parameters**: Add tracking parameters like `?utm_source=qr&utm_campaign=print`
3. **Webhook**: Configure Zapier/Make to receive lead data
4. **Email**: Set up SMTP for email notifications
5. **Analytics**: GA4 events will fire automatically

## Testing

1. Visit `/lead` to test the form
2. Submit with valid data to test API
3. Check console for lead logging
4. Verify webhook/email delivery
5. Test UTM parameter capture

## Customization

- Update WhatsApp number in thank you page
- Modify form validation rules
- Customize email templates
- Adjust rate limiting settings
- Change success/error messages
