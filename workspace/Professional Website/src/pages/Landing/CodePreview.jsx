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
    <section className="h-screen flex items-center justify-center px-6 bg-code-bg relative overflow-hidden">
      {/* Matrix rain background */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-20" />

      <div className="relative z-10 max-w-6xl w-full mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className="text-8xl mb-8"
          >
            ⚡
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-bold text-code-green mb-6 font-mono">
            {'// PROJECTS'}
          </h2>

          <p className="text-xl md:text-2xl text-code-cyan mb-8 max-w-3xl mx-auto">
            Explore cutting-edge projects in AI, music technology, and audio engineering.
            From deep learning to real-time performance systems.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <div className="px-4 py-2 bg-code-dim rounded-lg border border-code-green/30">
              <span className="text-code-green text-sm font-mono">Deep Learning</span>
            </div>
            <div className="px-4 py-2 bg-code-dim rounded-lg border border-code-green/30">
              <span className="text-code-green text-sm font-mono">Audio DSP</span>
            </div>
            <div className="px-4 py-2 bg-code-dim rounded-lg border border-code-green/30">
              <span className="text-code-green text-sm font-mono">Max/MSP</span>
            </div>
            <div className="px-4 py-2 bg-code-dim rounded-lg border border-code-green/30">
              <span className="text-code-green text-sm font-mono">JUCE/C++</span>
            </div>
          </motion.div>

          <Link to="/code">
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-code-green text-black font-bold text-xl rounded-xl font-mono
                hover:bg-code-cyan transition-all shadow-2xl shadow-code-green/30"
            >
              View Projects →
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default CodePreview;
