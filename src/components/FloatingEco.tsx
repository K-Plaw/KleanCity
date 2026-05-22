import { motion } from 'motion/react';
import { Leaf, Recycle } from 'lucide-react';

export default function FloatingEco() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic Leaf 1 */}
      <motion.div
        className="absolute text-klean-green/20"
        style={{ top: '15%', left: '8%' }}
        animate={{
          y: [0, -15, 0],
          rotate: [0, 15, -15, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Leaf size={32} className="fill-current" />
      </motion.div>

      {/* Dynamic Leaf 2 */}
      <motion.div
        className="absolute text-klean-green/15"
        style={{ top: '65%', right: '10%' }}
        animate={{
          y: [0, -20, 0],
          rotate: [20, -10, 20],
          scale: [0.9, 1.02, 0.9, 0.9],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
      >
        <Leaf size={44} className="fill-current" />
      </motion.div>

      {/* Dynamic Leaf 3 */}
      <motion.div
        className="absolute text-klean-green/10"
        style={{ bottom: '20%', left: '12%' }}
        animate={{
          y: [0, -12, 0],
          rotate: [-15, 15, -15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      >
        <Leaf size={24} className="fill-current" />
      </motion.div>

      {/* Rotating Recycle symbol */}
      <motion.div
        className="absolute text-klean-green/5"
        style={{ top: '40%', right: '18%' }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <Recycle size={180} />
      </motion.div>

      {/* Large Rotating Recycle symbol (left) */}
      <motion.div
        className="absolute text-klean-green/5"
        style={{ bottom: '10%', left: '5%' }}
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <Recycle size={120} />
      </motion.div>
    </div>
  );
}
