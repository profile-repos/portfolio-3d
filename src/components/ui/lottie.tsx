import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';

interface LottieProps {
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
  speed?: number;
}

const Lottie: React.FC<LottieProps> = ({
  src,
  loop = true,
  autoplay = true,
  className = '',
  style = {},
  width = '100%',
  height = '100%',
  speed = 1,
  ...props
}) => {
  return (
    <motion.div
      className={className}
      style={{ width, height, ...style }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      <DotLottieReact
        src={src}
        loop={loop}
        autoplay={autoplay}
        speed={speed}
        style={{ width: '100%', height: '100%' }}
      />
    </motion.div>
  );
};

export default Lottie;

