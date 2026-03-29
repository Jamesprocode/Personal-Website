import { motion } from 'framer-motion';

function Footer() {
  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/Jamesprocode', icon: '⚡' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/jiayi-wang-166b271a9/?locale=en_US', icon: '💼' },
    { name: 'Google Scholar', url: 'https://scholar.google.com/citations?user=GeNyFXAAAAAJ&hl=en', icon: '🎓' },
    { name: 'Email', url: 'mailto:jameswangjiayi@gmail.com', icon: '✉️' },
  ];

  return (
    <footer className="bg-black/50 border-t border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2026 James Wang. All rights reserved.
          </p>

          <div className="flex gap-6">
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
              >
                <span>{link.icon}</span>
                <span className="hidden sm:inline">{link.name}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
