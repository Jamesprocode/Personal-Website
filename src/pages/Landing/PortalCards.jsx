import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function PortalCards() {
  const portals = [
    {
      title: 'Music',
      path: '/music',
      icon: '🎵',
      description: 'Vintage vinyl listening room with interactive turntable',
      color: 'from-amber-200 to-orange-300',
      borderColor: 'border-amber-400',
      hoverColor: 'hover:border-amber-600',
      textColor: 'text-amber-900',
    },
    {
      title: 'Code',
      path: '/code',
      icon: '⚡',
      description: 'Futuristic project showcase with Matrix rain',
      color: 'from-green-200 to-cyan-300',
      borderColor: 'border-green-400',
      hoverColor: 'hover:border-green-600',
      textColor: 'text-green-900',
    },
    {
      title: 'Timeline',
      path: '/timeline',
      icon: '⏱️',
      description: 'Interactive journey through career milestones',
      color: 'from-blue-200 to-purple-300',
      borderColor: 'border-blue-400',
      hoverColor: 'hover:border-blue-600',
      textColor: 'text-blue-900',
    },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-amber-900"
        >
          Explore My World
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portals.map((portal, index) => (
            <motion.div
              key={portal.path}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Link to={portal.path}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative bg-gradient-to-br ${portal.color}
                    border-2 ${portal.borderColor} ${portal.hoverColor}
                    rounded-2xl p-8 h-full min-h-[300px] flex flex-col justify-between
                    transition-all duration-300 shadow-lg`}
                >
                  <div>
                    <div className="text-6xl mb-4">{portal.icon}</div>
                    <h3 className={`text-2xl font-bold mb-3 ${portal.textColor}`}>
                      {portal.title}
                    </h3>
                    <p className="text-gray-700 text-sm">{portal.description}</p>
                  </div>

                  <div className={`flex items-center gap-2 text-sm ${portal.textColor} mt-6 font-semibold`}>
                    <span>Enter</span>
                    <span>→</span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PortalCards;
