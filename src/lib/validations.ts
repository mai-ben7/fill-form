import { z } from 'zod';

export const leadFormSchema = z.object({
  fullName: z
    .string()
    .min(2, 'שם חייב להכיל לפחות 2 תווים')
    .max(50, 'שם לא יכול להיות ארוך מ-50 תווים'),
  phone: z
    .string()
    .min(9, 'מספר טלפון חייב להכיל לפחות 9 ספרות')
    .max(15, 'מספר טלפון לא יכול להיות ארוך מ-15 ספרות')
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, 'מספר טלפון לא תקין'),
  email: z
    .string()
    .email('כתובת אימייל לא תקינה')
    .min(1, 'אימייל הוא שדה חובה'),
  message: z
    .string()
    .max(500, 'הודעה לא יכולה להיות ארוכה מ-500 תווים')
    .optional(),
  consent: z
    .boolean()
    .refine((val) => val === true, 'חובה לאשר יצירת קשר'),
  honeypot: z.string().optional(),
  timestamp: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
