'use client';

import Link from 'next/link';
import { useSpring, animated } from '@react-spring/web';

export default function ThankYouPage() {
  const scaleIn = useSpring({
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    config: { tension: 300, friction: 30 }
  });

  const fadeInUp = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 300,
    config: { tension: 300, friction: 30 }
  });

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('היי! ראיתי את הטופס שלכם ורציתי לדבר על זה');
    const whatsappUrl = `https://wa.me/972527533750?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        <animated.div style={scaleIn} className="space-y-6">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              תודה!
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              קיבלנו את הפרטים שלך וניצור קשר בהקדם האפשרי
            </p>
          </div>

          {/* WhatsApp CTA */}
          <animated.div style={fadeInUp} className="space-y-4">
            <button
              onClick={handleWhatsAppClick}
              className="w-full py-4 px-6 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              צור קשר בוואטסאפ
            </button>

            {/* Back to Home */}
            <Link
              href="/"
              className="inline-block w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              חזרה לדף הבית
            </Link>
          </animated.div>

          {/* Additional Info */}
          <div className="text-sm text-gray-500 space-y-2">
            <p>נציג יצור איתך קשר תוך 24 שעות</p>
            <p>או צור קשר ישירות בוואטסאפ למעלה</p>
          </div>
        </animated.div>
      </div>
    </div>
  );
}
