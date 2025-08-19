export const runtime = 'nodejs';

export async function GET() {
  return Response.json({
    SMTP_HOST: process.env.SMTP_HOST ?? null,
    SMTP_PORT: process.env.SMTP_PORT ?? null,
    SMTP_USER: process.env.SMTP_USER ?? null,
    HAS_SMTP_PASS: Boolean(process.env.SMTP_PASS),
    LEAD_TO_EMAIL: process.env.LEAD_TO_EMAIL ?? null,
  });
}
