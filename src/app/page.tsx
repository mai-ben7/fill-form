'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSpring, animated } from '@react-spring/web';

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

type LeadFormData = z.infer<typeof leadFormSchema>;

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const heroAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 300, friction: 30 }
  });

  const formAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 300,
    config: { tension: 300, friction: 30 }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  });

  // Set client-side flag to prevent hydration errors
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Capture UTM parameters
  useEffect(() => {
    // Only run on client side to prevent hydration errors
    if (typeof window === 'undefined') return;
    
    const utmSource = searchParams.get('utm_source');
    const utmMedium = searchParams.get('utm_medium');
    const utmCampaign = searchParams.get('utm_campaign');

    if (utmSource) setValue('utm_source', utmSource);
    if (utmMedium) setValue('utm_medium', utmMedium);
    if (utmCampaign) setValue('utm_campaign', utmCampaign);
  }, [searchParams, setValue]);

  const onSubmit = async (data: LeadFormData) => {
    // Honeypot check
    if (data.honeypot) {
      return; // Silently ignore if honeypot is filled
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.ok) {
        setSubmitSuccess(true);
        
        // Analytics event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'lead_submit', {
            form_id: 'qr_lead',
            page_path: window.location.pathname + window.location.search
          });
        }

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/thank-you');
        }, 2000);
      } else {
        setSubmitError(result.error || 'שגיאה בשליחת הטופס');
      }
    } catch (error) {
      setSubmitError('שגיאה בחיבור לשרת');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <animated.div style={heroAnimation} className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">תודה!</h1>
          <p className="text-gray-600 mb-6">קיבלנו את הפרטים שלך וניצור קשר בהקדם האפשרי</p>
          <div className="animate-pulse">
            <p className="text-sm text-gray-500">מעביר אותך לדף התודה...</p>
          </div>
        </animated.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Cute Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating bubbles */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-blue-400/40 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-indigo-400/50 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute top-2/3 left-1/3 w-10 h-10 bg-purple-400/45 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
        <div className="absolute top-1/2 right-1/3 w-7 h-7 bg-blue-500/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }} />
        <div className="absolute top-3/4 left-1/5 w-5 h-5 bg-indigo-500/50 rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.2s' }} />
        <div className="absolute top-1/6 right-1/5 w-9 h-9 bg-purple-500/35 rounded-full animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '3.8s' }} />
        
        {/* Floating hearts */}
        <div className="absolute top-1/5 left-1/6 text-blue-500/60 animate-pulse" style={{ animationDelay: '0.3s' }}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <div className="absolute top-2/3 right-1/6 text-indigo-500/55 animate-pulse" style={{ animationDelay: '1.2s' }}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <div className="absolute top-1/3 left-2/3 text-purple-500/50 animate-pulse" style={{ animationDelay: '0.8s' }}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>



        {/* Cohesive gradient orbs */}
        <div className="absolute top-1/6 left-1/2 w-32 h-32 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-full blur-xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-1/4 right-1/6 w-24 h-24 bg-gradient-to-r from-indigo-400/35 to-purple-400/35 rounded-full blur-lg animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/6 w-20 h-20 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-full blur-lg animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />

        {/* Floating geometric shapes */}
        <div className="absolute top-1/3 left-1/5 w-3 h-3 bg-blue-500/50 rotate-45 animate-bounce" style={{ animationDelay: '0.7s', animationDuration: '3.5s' }} />
        <div className="absolute top-2/3 right-1/4 w-4 h-4 bg-indigo-500/45 rounded-full animate-bounce" style={{ animationDelay: '1.3s', animationDuration: '4s' }} />
        <div className="absolute top-1/2 left-2/3 w-2 h-2 bg-purple-500/60 rounded-full animate-bounce" style={{ animationDelay: '0.9s', animationDuration: '3.2s' }} />

        {/* Additional cohesive elements */}
        <div className="absolute top-1/4 left-1/8 w-6 h-6 bg-blue-400/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '3.8s' }} />
        <div className="absolute top-3/5 right-1/8 w-5 h-5 bg-indigo-400/45 rounded-full animate-bounce" style={{ animationDelay: '1.8s', animationDuration: '4.2s' }} />
        <div className="absolute top-4/5 left-3/4 w-7 h-7 bg-purple-400/40 rounded-full animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '3.6s' }} />
        
        {/* Additional right side animations */}
        <div className="absolute top-1/6 right-1/12 w-4 h-4 bg-blue-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '3.3s' }} />
        <div className="absolute top-2/5 right-1/10 w-5 h-5 bg-indigo-400/55 rounded-full animate-bounce" style={{ animationDelay: '1.1s', animationDuration: '3.9s' }} />
        <div className="absolute top-3/4 right-1/15 w-3 h-3 bg-purple-400/65 rounded-full animate-bounce" style={{ animationDelay: '0.8s', animationDuration: '4.1s' }} />
        <div className="absolute top-1/3 right-1/20 w-6 h-6 bg-blue-500/45 rounded-full animate-bounce" style={{ animationDelay: '1.6s', animationDuration: '3.7s' }} />
        <div className="absolute top-2/3 right-1/25 w-4 h-4 bg-indigo-500/50 rounded-full animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '4.3s' }} />
        
        {/* Additional right side hearts */}
        <div className="absolute top-1/8 right-1/8 text-blue-500/70 animate-pulse" style={{ animationDelay: '0.5s' }}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <div className="absolute top-3/5 right-1/12 text-indigo-500/65 animate-pulse" style={{ animationDelay: '1.4s' }}>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <div className="absolute top-4/5 right-1/6 text-purple-500/60 animate-pulse" style={{ animationDelay: '0.9s' }}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        
        {/* Additional right side geometric shapes */}
        <div className="absolute top-1/4 right-1/30 w-2 h-2 bg-blue-500/70 rotate-45 animate-bounce" style={{ animationDelay: '1.2s', animationDuration: '3.4s' }} />
        <div className="absolute top-2/5 right-1/35 w-3 h-3 bg-indigo-500/60 rounded-full animate-bounce" style={{ animationDelay: '0.7s', animationDuration: '4.0s' }} />
        <div className="absolute top-3/5 right-1/40 w-2 h-2 bg-purple-500/75 rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.6s' }} />
      </div>

      {/* Contact Form Section */}
      <section className="py-8 lg:py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <animated.div style={formAnimation}>
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <img
                    src="/images/logo+name.png"
                    alt="Fill Form Logo"
                    className="max-w-xs h-auto drop-shadow-lg"
                  />
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl opacity-75" />
                </div>
              </div>

              {/* Form Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                 שלח לי הודעה 
                </h2>
                <p className="text-lg text-gray-600">
                  מלא את הפרטים ונחזור אליך בהקדם האפשרי
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 relative">
                {/* Subtle form background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-2xl -z-10" />
                
                {/* Honeypot field */}
                <input
                  type="text"
                  {...register('honeypot')}
                  className="sr-only"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    שם מלא <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    {...register('fullName')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="הכנס את שמך המלא"
                    aria-invalid={errors.fullName ? 'true' : 'false'}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  />
                  {errors.fullName && (
                    <p id="fullName-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    טלפון <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="050-1234567"
                    aria-invalid={errors.phone ? 'true' : 'false'}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                  {errors.phone && (
                    <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    אימייל <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="example@email.com"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    הודעה (אופציונלי)
                  </label>
                  <textarea
                    id="message"
                    {...register('message')}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="כתוב הודעה קצרה..."
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Privacy Note */}
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    לא נשתף פרטים עם גורמים חיצוניים
                  </p>
                </div>

                {/* Submit Error */}
                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{submitError}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`relative w-[150px] h-[50px] bg-transparent border-4 border-blue-500 rounded-[50px] cursor-pointer flex items-center justify-center transition-all duration-100 focus:outline-none ${
                    isSubmitting
                      ? 'border-2 border-blue-800 w-[50px] border-l-4 border-b-4'
                      : 'hover:border-blue-600'
                  }`}
                  style={{
                    animation: isSubmitting ? 'spin 2s 500ms forwards' : 'none'
                  }}
                >
                  <span className={`absolute text-blue-900 uppercase tracking-[2px] font-bold transition-colors duration-300 ${
                    isSubmitting ? 'text-transparent' : ''
                  }`}>
                    {isSubmitting ? '' : 'שלח טופס'}
                  </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24"
                    className={`absolute stroke-blue-900 transition-all duration-300 ${
                      isSubmitting ? 'animate-check' : 'opacity-0'
                    }`}
                    style={{
                      animation: isSubmitting ? 'check 500ms 2300ms forwards' : 'none'
                    }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </form>
            </animated.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-blue-900/10 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-700">
            © 2025 Mai Web | כל הזכויות שמורות
          </p>
        </div>
      </footer>
    </div>
  );
}
