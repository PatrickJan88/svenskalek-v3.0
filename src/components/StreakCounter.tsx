import React from 'react';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreakCounterProps {
  streak: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ streak }) => {
  return (
    <motion.div 
      className="flex items-center bg-secondary-100 px-3 py-1.5 rounded-full"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 10, 0] }}
        transition={{ 
          repeat: Infinity, 
          repeatType: "loop", 
          duration: 1.5,
          repeatDelay: 2
        }}
      >
        <Flame size={20} className="text-secondary-500 mr-1" />
      </motion.div>
      <span className="font-bold text-secondary-700">{streak}</span>
    </motion.div>
  );
};

export default StreakCounter;