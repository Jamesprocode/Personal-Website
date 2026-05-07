import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function ContactSection() {
  return (
    <section className="px-6 md:px-10 xl:px-16 border-t border-amber-100" style={{ paddingTop: '5rem', paddingBottom: '8rem' }}>
      <div className="max-w-5xl xl:max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-amber-900 mb-3">Get in Touch</h2>
            <p className="text-amber-700/60 mb-6 leading-relaxed">
              Interested in collaborating on music technology, audio engineering,
              or AI research? I'd love to hear from you.
            </p>

            <a
              href="mailto:jameswangjiayi@gmail.com"
              className="inline-block text-amber-800 hover:text-amber-900 transition-colors font-medium"
            >
              jameswangjiayi@gmail.com
            </a>
          </motion.div>

          {/* Right: Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-amber-900 mb-4">Explore</h3>
            <div className="space-y-3">
              <Link
                to="/music"
                className="block p-4 bg-white/50 backdrop-blur-sm border border-amber-100 rounded-xl
                  hover:bg-white/70 hover:border-amber-200 hover:shadow-md transition-all duration-200 group"
              >
                <span className="font-medium text-amber-900 group-hover:text-amber-800">
                  Vinyl Listening Room
                </span>
                <p className="text-sm text-amber-600/60 mt-0.5">
                  Listen to my recordings on an interactive turntable
                </p>
              </Link>
              <Link
                to="/timeline"
                className="block p-4 bg-white/50 backdrop-blur-sm border border-amber-100 rounded-xl
                  hover:bg-white/70 hover:border-amber-200 hover:shadow-md transition-all duration-200 group"
              >
                <span className="font-medium text-amber-900 group-hover:text-amber-800">
                  Timeline
                </span>
                <p className="text-sm text-amber-600/60 mt-0.5">
                  Career milestones from 2020 to present
                </p>
              </Link>
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white/50 backdrop-blur-sm border border-amber-100 rounded-xl
                  hover:bg-white/70 hover:border-amber-200 hover:shadow-md transition-all duration-200 group"
              >
                <span className="font-medium text-amber-900 group-hover:text-amber-800">
                  Full CV
                </span>
                <p className="text-sm text-amber-600/60 mt-0.5">
                  Download my complete curriculum vitae
                </p>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
