import type { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  triggerOnce?: boolean;
}

export const AnimatedSection = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  triggerOnce = true,
}: AnimatedSectionProps) => {
  const { ref, isVisible } = useScrollAnimation({ triggerOnce });

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return 'translateY(50px)';
        case 'down':
          return 'translateY(-50px)';
        case 'left':
          return 'translateX(50px)';
        case 'right':
          return 'translateX(-50px)';
        case 'fade':
          return 'none';
        default:
          return 'translateY(50px)';
      }
    }
    return 'none';
  };

  const getOpacity = () => {
    return isVisible ? 1 : 0;
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: getOpacity(),
        transform: getTransform(),
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

