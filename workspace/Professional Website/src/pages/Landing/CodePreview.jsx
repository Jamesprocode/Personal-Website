import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

function CodePreview() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01アイウエオ';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    let animationId;
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff41';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-code-bg relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-15" />

      {/* Glow effects */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-code-green/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-code-cyan/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl w-full mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 80 }}
            className="w-24 h-24 rounded-2xl bg-code-dim/50 border border-code-green/30
              flex items-center justify-center mb-8 backdrop-blur-sm"
          >
            <span className="text-5xl">⚡</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold text-code-green mb-4 font-mono tracking-tight">
            {'// PROJECTS'}
          </h2>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-code-green to-transparent mb-6" />

          <p className="text-lg md:text-xl text-code-cyan/70 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Explore cutting-edge projects in AI, music technology, and audio engineering.
            From deep learning to real-time performance systems.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {['Deep Learning', 'Audio DSP', 'Max/MSP', 'JUCE/C++'].map((label) => (
              <div key={label} className="px-4 py-2 bg-code-dim/50 rounded-full border border-code-green/20
                backdrop-blur-sm">
                <span className="text-code-green/80 text-sm font-mono">{label}</span>
              </div>
            ))}
          </motion.div>

          <Link to="/code">
            <motion.button
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 bg-code-green text-black font-semibold text-lg rounded-full font-mono
                hover:bg-code-cyan transition-all duration-300 shadow-xl shadow-code-green/20
                flex items-center gap-2"
            >
              View Projects
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default CodePreview;
