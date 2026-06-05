import { motion as Motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, ease: [0.5, 0, 0.75, 0] },
  },
};

function PageTransition({ children }) {
  return (
    <Motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ width: '100%' }}
    >
      {children}
    </Motion.div>
  );
}

export default PageTransition;
