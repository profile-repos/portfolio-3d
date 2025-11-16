import { useEffect, useRef } from 'react';
import type { ProfileData } from '@/services/api';

export const useLottieAnimation = (profilePhoto: string | null | undefined) => {
  const lottieContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profilePhoto && lottieContainerRef.current) {
      lottieContainerRef.current.innerHTML = '';

      const lottieUrl = profilePhoto;
      
      if (lottieUrl.includes('lottie.host')) {
        const urlParts = lottieUrl.split('/');
        const embedPath = urlParts.slice(-2).join('/');
        const iframe = document.createElement('iframe');
        iframe.src = `https://lottie.host/embed/${embedPath}`;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.background = 'transparent';
        iframe.allowFullscreen = false;
        iframe.setAttribute('loading', 'lazy');
        lottieContainerRef.current.appendChild(iframe);
      }

      return () => {
        if (lottieContainerRef.current) {
          lottieContainerRef.current.innerHTML = '';
        }
      };
    }
  }, [profilePhoto]);

  return lottieContainerRef;
};

