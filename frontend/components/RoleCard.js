'use client';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function RoleCard({ title, description, image, isSelected, onSelect }) {
  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`relative cursor-pointer p-6 rounded-xl transition-all duration-300 overflow-hidden ${
        isSelected
          ? 'ring-2 ring-indigo-500 bg-gradient-to-br from-indigo-100 to-blue-100'
          : 'bg-white hover:bg-indigo-100 border border-indigo-200'
      }`}
    >
      {isSelected && (
        <motion.div 
          className="absolute top-3 right-3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <CheckCircle2 className="text-indigo-700 w-6 h-6" />
        </motion.div>
      )}

      <div className="flex flex-col items-center space-y-4">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
          isSelected ? 'bg-indigo-200' : 'bg-indigo-100'
        }`}>
          <motion.img
            src={image}
            alt={title}
            className="w-12 h-12 object-contain"
            animate={isSelected ? { 
              rotate: [0, 5, -5, 0],
              transition: { duration: 2, repeat: Infinity } 
            } : {}}
          />
        </div>

        <div className="text-center">
          <h3 className={`text-xl font-semibold ${
            isSelected ? 'text-indigo-900' : 'text-gray-800'
          }`}>
            {title}
          </h3>
          <p className={`mt-1 text-sm ${
            isSelected ? 'text-indigo-700' : 'text-gray-600'
          }`}>
            {description}
          </p>
        </div>
      </div>

      {isSelected && (
        <motion.div 
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            boxShadow: 'inset 0 0 20px rgba(67, 56, 202, 0.3)'
          }}
        />
      )}
    </motion.div>
  );
}
