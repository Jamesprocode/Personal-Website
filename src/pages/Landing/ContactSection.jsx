import { motion, useReducedMotion } from 'framer-motion';

function ContactSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#f4e8d1',
        paddingTop: 'clamp(4rem, 8vh, 6.5rem)',
        paddingBottom: 'clamp(7rem, 12vh, 10rem)',
        paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
        paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
      }}
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
        style={{ width: '100%', maxWidth: '52ch' }}
      >
        <p
          className="text-amber-900/85"
          style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.45rem)', lineHeight: 1.45, fontWeight: 500 }}
        >
          If anything here interests you, email me @
        </p>
        <a
          href="mailto:jameswangjiayi@gmail.com"
          className="inline-block mt-[clamp(0.75rem,1.5vh,1.25rem)] text-amber-900 hover:text-stone-900 transition-colors duration-200 font-medium underline-offset-[6px] decoration-amber-700/40 hover:decoration-amber-700/80"
          style={{
            fontSize: 'clamp(1.05rem, 1.6vw, 1.45rem)',
            textDecoration: 'underline',
          }}
        >
          jameswangjiayi@gmail.com
        </a>
      </motion.div>
    </section>
  );
}

export default ContactSection;
