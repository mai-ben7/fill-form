import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

// Form validation schema
const leadFormSchema = z.object({
  fullName: z.string().min(2, 'שם מלא חייב להכיל לפחות 2 תווים'),
  phone: z.string().regex(/^05\d-?\d{7}$/, 'מספר טלפון חייב להיות בפורמט 050-1234567'),
  email: z.string().email('כתובת אימייל לא תקינה'),
  message: z.string().optional(),
  honeypot: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting function
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5;

  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Send webhook function
async function sendWebhook(data: any) {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        source: 'contact-form'
      }),
    });

    if (!response.ok) {
      console.error('Webhook failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Webhook error:', error);
  }
}

// Send email function
async function sendEmail(data: any) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const toEmail = process.env.LEAD_TO_EMAIL;

  // Debug logging
  console.log('Environment variables:', {
    SMTP_HOST: smtpHost,
    SMTP_PORT: smtpPort,
    SMTP_USER: smtpUser,
    SMTP_PASS: smtpPass ? '***' : 'missing',
    LEAD_TO_EMAIL: toEmail
  });

  const missing = {
    smtpHost: !smtpHost,
    smtpPort: !smtpPort,
    smtpUser: !smtpUser,
    smtpPass: !smtpPass,
    toEmail: !toEmail,
  };

  if (Object.values(missing).some(Boolean)) {
    console.log('Email configuration missing, skipping email send');
    console.log('Missing variables:', missing);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: smtpUser,
      to: toEmail,
      subject: `פנייה חדשה מ-${data.fullName}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">פנייה חדשה</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>שם מלא:</strong> ${data.fullName}</p>
            <p><strong>טלפון:</strong> ${data.phone}</p>
            <p><strong>אימייל:</strong> ${data.email}</p>
            ${data.message ? `<p><strong>הודעה:</strong> ${data.message}</p>` : ''}
            ${data.utm_source ? `<p><strong>מקור:</strong> ${data.utm_source}</p>` : ''}
            ${data.utm_campaign ? `<p><strong>קמפיין:</strong> ${data.utm_campaign}</p>` : ''}
          </div>
          <p style="color: #64748b; font-size: 14px;">
            נשלח ב-${new Date().toLocaleString('he-IL')}
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email error:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'יותר מדי בקשות. נסה שוב בעוד 15 דקות.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate form data
    const validationResult = leadFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא תקינים' },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Honeypot check
    if (data.honeypot) {
      console.log('Honeypot triggered, ignoring submission');
      return NextResponse.json({ ok: true }); // Silently ignore
    }

    // Log the lead
    console.log('New lead received:', {
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      message: data.message,
      utm_source: data.utm_source,
      utm_medium: data.utm_medium,
      utm_campaign: data.utm_campaign,
      timestamp: new Date().toISOString(),
    });

    // Send to integrations
    await Promise.all([
      sendWebhook(data),
      sendEmail(data),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'שגיאה פנימית בשרת' },
      { status: 500 }
    );
  }
}
