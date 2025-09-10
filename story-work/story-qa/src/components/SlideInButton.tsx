// SlideInButton.tsx
import { motion } from 'framer-motion';

type SlideInButtonProps = {
  onClick: () => void;
  label: string;
};

const SlideInButton = ({ onClick, label }: SlideInButtonProps) => {
  return (
    <motion.button
      initial={{ x: '100%' }}               // start off-screen right
      animate={{ x: -100 }}                    // slide into view
      transition={{ duration: 2.5 }}
      style={{
        position: 'fixed',
        top: '50%',
        right: 0,
        transform: 'translateY(-50%)',
        padding: '24px',
        backgroundColor: '#ff5722',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.5rem',
        cursor: `url('${import.meta.env.BASE_URL}images/cursor.png'), auto`,   
        zIndex: 1000,
        width: 200,
        textAlign: 'start',
        clipPath: 'polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)'
      }}
      onClick={onClick}
    >
      {label}
    </motion.button>
  );
};

export default SlideInButton;
