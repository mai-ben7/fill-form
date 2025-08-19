'use client';

import { useState, useEffect } from 'react';
import { useSpring, animated, config } from '@react-spring/web';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Pre-defined random values to prevent hydration errors
  const dnaData = [
    { left: 50, top: 0, duration: 4.07, delay: 0 },
    { left: 58.87, top: 5, duration: 5.95, delay: 0.1 },
    { left: 66.94, top: 10, duration: 4.79, delay: 0.2 },
    { left: 73.5, top: 15, duration: 5.37, delay: 0.3 },
    { left: 77.96, top: 20, duration: 5.47, delay: 0.4 },
    { left: 79.92, top: 25, duration: 5.11, delay: 0.5 },
    { left: 79.22, top: 30, duration: 5.41, delay: 0.6 },
    { left: 75.9, top: 35, duration: 4.87, delay: 0.7 },
    { left: 70.26, top: 40, duration: 5.75, delay: 0.8 },
    { left: 62.82, top: 45, duration: 4.42, delay: 0.9 },
    { left: 54.23, top: 50, duration: 4.5, delay: 1.0 },
    { left: 45.27, top: 55, duration: 4.8, delay: 1.1 },
    { left: 36.72, top: 60, duration: 5.52, delay: 1.2 },
    { left: 29.37, top: 65, duration: 5.31, delay: 1.3 },
    { left: 23.85, top: 70, duration: 4.94, delay: 1.4 },
    { left: 20.67, top: 75, duration: 4.57, delay: 1.5 },
    { left: 20.12, top: 80, duration: 5.88, delay: 1.6 },
    { left: 22.23, top: 85, duration: 4.03, delay: 1.7 },
    { left: 26.82, top: 90, duration: 5.61, delay: 1.8 },
    { left: 33.48, top: 95, duration: 4.81, delay: 1.9 }
  ];

  const particleData = [
    { left: 48.96, top: 95.13, duration: 7.05, delay: 0.48 },
    { left: 67.24, top: 8.79, duration: 8.74, delay: 1.20 },
    { left: 57.74, top: 22.27, duration: 7.90, delay: 1.45 },
    { left: 0.39, top: 70.10, duration: 8.27, delay: 2.95 },
    { left: 81.74, top: 57.18, duration: 6.77, delay: 2.49 },
    { left: 66.24, top: 69.92, duration: 7.50, delay: 2.55 },
    { left: 63.10, top: 27.82, duration: 6.76, delay: 0.69 },
    { left: 22.08, top: 40.66, duration: 5.45, delay: 0.39 },
    { left: 32.23, top: 78.45, duration: 8.21, delay: 1.15 },
    { left: 46.73, top: 33.20, duration: 6.72, delay: 1.82 },
    { left: 24.57, top: 49.79, duration: 8.57, delay: 1.64 },
    { left: 95.76, top: 75.90, duration: 5.90, delay: 1.75 },
    { left: 94.89, top: 5.41, duration: 5.15, delay: 1.85 },
    { left: 64.97, top: 94.69, duration: 8.42, delay: 1.89 },
    { left: 64.50, top: 85.11, duration: 7.75, delay: 1.85 },
    { left: 49.94, top: 8.56, duration: 8.14, delay: 1.42 },
    { left: 21.65, top: 55.16, duration: 6.77, delay: 1.02 },
    { left: 32.23, top: 62.01, duration: 7.31, delay: 0.93 },
    { left: 75.24, top: 19.16, duration: 7.96, delay: 0.65 },
    { left: 93.94, top: 92.77, duration: 7.34, delay: 0.43 },
    { left: 41.13, top: 98.08, duration: 8.56, delay: 2.19 },
    { left: 37.07, top: 21.61, duration: 6.76, delay: 2.10 },
    { left: 58.56, top: 49.95, duration: 8.22, delay: 2.42 },
    { left: 31.22, top: 75.36, duration: 8.65, delay: 2.00 },
    { left: 19.13, top: 39.56, duration: 5.53, delay: 2.61 },
    { left: 58.32, top: 69.06, duration: 8.43, delay: 2.65 },
    { left: 94.74, top: 88.05, duration: 8.23, delay: 1.46 },
    { left: 31.95, top: 63.25, duration: 5.10, delay: 0.97 },
    { left: 96.13, top: 55.33, duration: 7.58, delay: 1.51 },
    { left: 79.92, top: 73.85, duration: 8.11, delay: 0.69 },
    { left: 93.78, top: 27.49, duration: 6.64, delay: 1.07 },
    { left: 74.46, top: 58.39, duration: 5.20, delay: 2.32 },
    { left: 98.21, top: 97.85, duration: 6.81, delay: 0.72 },
    { left: 60.91, top: 52.72, duration: 6.66, delay: 0.65 },
    { left: 29.27, top: 75.09, duration: 7.77, delay: 2.52 },
    { left: 21.52, top: 14.99, duration: 6.76, delay: 1.35 },
    { left: 17.42, top: 41.87, duration: 5.95, delay: 0.80 },
    { left: 10.77, top: 62.45, duration: 7.67, delay: 1.75 },
    { left: 57.76, top: 56.85, duration: 6.09, delay: 1.50 },
    { left: 55.80, top: 92.86, duration: 6.67, delay: 1.45 },
    { left: 12.52, top: 13.01, duration: 8.15, delay: 1.80 },
    { left: 12.57, top: 56.78, duration: 6.25, delay: 1.68 },
    { left: 11.33, top: 83.43, duration: 6.46, delay: 1.45 },
    { left: 46.74, top: 44.06, duration: 8.84, delay: 1.33 },
    { left: 32.86, top: 98.94, duration: 5.40, delay: 1.75 },
    { left: 56.84, top: 27.71, duration: 5.10, delay: 2.16 },
    { left: 46.08, top: 67.79, duration: 8.26, delay: 1.80 },
    { left: 69.00, top: 5.81, duration: 7.15, delay: 2.48 },
    { left: 16.49, top: 62.63, duration: 8.41, delay: 0.50 },
    { left: 61.44, top: 79.27, duration: 5.29, delay: 2.93 },
    { left: 30.30, top: 42.06, duration: 8.63, delay: 0.47 },
    { left: 26.28, top: 43.79, duration: 8.21, delay: 2.44 },
    { left: 39.47, top: 33.01, duration: 6.96, delay: 0.20 },
    { left: 35.22, top: 86.87, duration: 8.67, delay: 0.31 },
    { left: 62.15, top: 11.07, duration: 7.86, delay: 2.75 }
  ];

  const geometricData = [
    { left: 10, top: 15, duration: 6.82, delay: 0.91 },
    { left: 35, top: 15, duration: 8.06, delay: 1.47 },
    { left: 60, top: 15, duration: 8.09, delay: 0.90 },
    { left: 85, top: 15, duration: 7.53, delay: 0.41 },
    { left: 10, top: 35, duration: 8.05, delay: 1.55 },
    { left: 35, top: 35, duration: 6.33, delay: 0.48 },
    { left: 60, top: 35, duration: 7.14, delay: 0.51 },
    { left: 85, top: 35, duration: 8.69, delay: 0.84 },
    { left: 10, top: 55, duration: 7.54, delay: 0.04 },
    { left: 35, top: 55, duration: 6.08, delay: 0.83 },
    { left: 60, top: 55, duration: 7.88, delay: 0.64 },
    { left: 85, top: 55, duration: 7.34, delay: 0.83 },
    { left: 10, top: 75, duration: 7.04, delay: 1.85 },
    { left: 35, top: 75, duration: 7.85, delay: 0.32 },
    { left: 60, top: 75, duration: 7.10, delay: 1.66 }
  ];

  // Main fade animation
  const fadeAnimation = useSpring({
    opacity: isVisible ? 1 : 0,
    config: { duration: 1200 }
  });

  // Logo scale and rotation animation
  const logoAnimation = useSpring({
    transform: logoLoaded ? 'scale(1) rotate(0deg)' : 'scale(0.2) rotate(720deg)',
    opacity: logoLoaded ? 1 : 0,
    config: { tension: 150, friction: 12 }
  });

  // Morphing background animation
  const morphAnimation = useSpring({
    transform: 'rotate(360deg)',
    config: { 
      duration: 20000,
      loop: true,
      easing: t => t
    }
  });

  // Particle system animation
  const particleAnimation = useSpring({
    transform: 'translateY(-30px)',
    config: { 
      duration: 3000,
      loop: { reverse: true },
      easing: t => Math.sin(t * Math.PI)
    }
  });

  // Progress bar animation
  const progressAnimation = useSpring({
    width: `${progress}%`,
    config: { tension: 80, friction: 15 }
  });

  // Glow pulse animation
  const glowAnimation = useSpring({
    transform: 'scale(1.3)',
    opacity: 0.9,
    config: { 
      duration: 2000,
      loop: { reverse: true },
      easing: t => Math.sin(t * Math.PI)
    }
  });

  // Loading text animation
  const textAnimation = useSpring({
    opacity: logoLoaded ? 1 : 0,
    transform: logoLoaded ? 'translateY(0px)' : 'translateY(30px)',
    config: { delay: 400, tension: 250, friction: 25 }
  });

  // DNA helix animation
  const dnaAnimation = useSpring({
    transform: 'rotateY(360deg)',
    config: { 
      duration: 8000,
      loop: true,
      easing: t => t
    }
  });

  // Orbital rings animation
  const orbitalAnimation = useSpring({
    transform: 'rotateX(360deg)',
    config: { 
      duration: 12000,
      loop: true,
      easing: t => t
    }
  });

  useEffect(() => {
    // Simulate logo loading
    const logoTimer = setTimeout(() => {
      setLogoLoaded(true);
    }, 1000);

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 12;
      });
    }, 150);

    // Hide loading screen after 5 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(hideTimer);
      clearInterval(progressInterval);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <animated.div 
      style={fadeAnimation}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      {/* Ultra complex animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Morphing geometric shapes */}
        <animated.div
          style={morphAnimation}
          className="absolute inset-0 opacity-25"
        >
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl" />
          <div className="absolute top-3/4 right-1/4 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl" />
          <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r from-pink-400 to-indigo-400 rounded-full blur-lg" />
        </animated.div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px),
              linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* DNA Helix effect */}
        <animated.div style={dnaAnimation} className="absolute inset-0 opacity-20">
          {dnaData.map((particle, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/40 rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animation: `dnaFloat ${particle.duration}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`
              }}
            />
          ))}
        </animated.div>

        {/* Orbital rings */}
        <animated.div style={orbitalAnimation} className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 border border-blue-400/30 rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 border border-purple-400/30 rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 border border-indigo-400/30 rounded-full" />
        </animated.div>

        {/* Particle system */}
        <animated.div style={particleAnimation} className="absolute inset-0">
          {particleData.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animation: `particleFloat ${particle.duration}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`
              }}
            />
          ))}
        </animated.div>

        {/* Energy waves */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 border border-blue-400/25 rounded-full"
              style={{
                animation: `energyWave ${4 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0">
          {geometricData.map((shape, i) => (
            <div
              key={i}
              className={`absolute ${
                i % 3 === 0 ? 'w-4 h-4 bg-blue-400/30 rounded-full' :
                i % 3 === 1 ? 'w-3 h-3 bg-purple-400/30 rotate-45' :
                'w-5 h-5 bg-indigo-400/30 rotate-12'
              }`}
              style={{
                left: `${shape.left}%`,
                top: `${shape.top}%`,
                animation: `geometricFloat ${shape.duration}s ease-in-out infinite`,
                animationDelay: `${shape.delay}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content - perfectly centered */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4">
        {/* Logo container with ultra advanced effects */}
        <animated.div
          style={glowAnimation}
          className="relative mb-20 flex items-center justify-center"
        >
          <animated.div
            style={logoAnimation}
            className="relative z-30 flex items-center justify-center"
          >
            <img
              src="/images/logo+name.png"
              alt="Loading..."
              className="w-44 h-auto drop-shadow-2xl"
              onLoad={() => setLogoLoaded(true)}
            />
          </animated.div>
          
          {/* Ultra advanced glow effects */}
          <div className="absolute inset-0 -z-20 flex items-center justify-center">
            <div className="absolute w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-70 animate-pulse" />
            <div className="absolute w-80 h-80 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full blur-2xl opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute w-64 h-64 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-full blur-xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute w-48 h-48 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full blur-lg opacity-30 animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>
        </animated.div>

        {/* Loading text with ultra advanced animation */}
        <animated.div style={textAnimation} className="space-y-10 flex flex-col items-center">
          <h2 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
              טוען...
            </span>
          </h2>
          
          {/* Ultra advanced loading dots */}
          <div className="flex justify-center space-x-5">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce shadow-lg"
                style={{
                  animationDelay: `${i * 0.08}s`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>
        </animated.div>

        {/* Ultra advanced progress bar */}
        <animated.div 
          style={textAnimation}
          className="mt-16 w-96 mx-auto flex flex-col items-center"
        >
          <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden backdrop-blur-sm border border-white/15 shadow-2xl">
            <animated.div 
              className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-full shadow-lg"
              style={progressAnimation}
            />
          </div>
          <div className="mt-4 text-lg text-white/70 font-medium">
            {Math.round(progress)}%
          </div>
        </animated.div>
      </div>

      {/* Ultra advanced CSS animations */}
      <style jsx>{`
        @keyframes particleFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.4;
          }
          25% {
            transform: translateY(-20px) scale(1.1);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-40px) scale(1.3);
            opacity: 1;
          }
          75% {
            transform: translateY(-20px) scale(1.1);
            opacity: 0.7;
          }
        }
        
        @keyframes energyWave {
          0% {
            transform: scale(0.7);
            opacity: 0;
          }
          25% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
          75% {
            opacity: 0.3;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }

        @keyframes dnaFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-15px) scale(1.2);
            opacity: 0.8;
          }
        }

        @keyframes geometricFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-25px) rotate(90deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-35px) rotate(180deg);
            opacity: 0.9;
          }
          75% {
            transform: translateY(-25px) rotate(270deg);
            opacity: 0.6;
          }
        }
      `}</style>
    </animated.div>
  );
}
