'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGE = encodeURIComponent('Bonjour PrepaNextGen ! Je souhaite avoir des informations sur vos programmes.');

const CONTACTS = [
  { label: 'Ettienne', number: '2250788124487' },
  { label: 'Olivia', number: '2250501194242' },
];

const WhatsAppButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2 items-end"
          >
            {CONTACTS.map((c, i) => (
              <motion.a
                key={c.number}
                href={`https://wa.me/${c.number}?text=${MESSAGE}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3 bg-white text-gray-800 font-medium text-sm px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:bg-green-50 transition-all"
              >
                <span className="text-[#25D366] font-bold">{c.label}</span>
                <span className="text-gray-400 text-xs">+225 {c.number.slice(3).replace(/(\d{2})(?=\d)/g, '$1 ')}</span>
                <svg viewBox="0 0 32 32" width="18" height="18" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.004 2C8.28 2 2 8.28 2 16.004c0 2.478.65 4.907 1.889 7.04L2 30l7.134-1.867A13.94 13.94 0 0 0 16.004 30C23.72 30 30 23.72 30 16.004 30 8.28 23.72 2 16.004 2zm0 25.474a11.535 11.535 0 0 1-5.882-1.607l-.422-.25-4.235 1.108 1.13-4.12-.276-.44a11.524 11.524 0 0 1-1.77-6.16C4.549 9.686 9.686 4.549 16.004 4.549c3.065 0 5.944 1.194 8.112 3.363a11.404 11.404 0 0 1 3.35 8.092c0 6.318-5.136 11.47-11.462 11.47zm6.29-8.588c-.345-.172-2.04-1.006-2.355-1.12-.316-.115-.547-.172-.778.172-.23.345-.893 1.12-1.094 1.35-.2.23-.402.258-.747.086-.345-.172-1.456-.537-2.774-1.712-1.025-.916-1.717-2.047-1.918-2.392-.2-.345-.021-.531.15-.703.155-.155.345-.402.517-.603.172-.2.23-.345.345-.575.115-.23.057-.432-.029-.603-.086-.172-.778-1.875-1.066-2.565-.28-.672-.566-.58-.778-.592-.2-.01-.43-.013-.661-.013-.23 0-.603.086-.918.432-.316.345-1.205 1.178-1.205 2.87 0 1.693 1.234 3.328 1.406 3.558.172.23 2.428 3.707 5.88 5.198.823.355 1.464.567 1.965.726.825.263 1.577.226 2.17.137.662-.099 2.04-.834 2.327-1.638.287-.805.287-1.494.2-1.638-.086-.143-.316-.23-.661-.402z"/>
                </svg>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        aria-label="Contacter PrepaNextGen sur WhatsApp"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
        className="relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center"
        style={{ backgroundColor: '#25D366' }}
      >
        <svg viewBox="0 0 32 32" width="30" height="30" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.004 2C8.28 2 2 8.28 2 16.004c0 2.478.65 4.907 1.889 7.04L2 30l7.134-1.867A13.94 13.94 0 0 0 16.004 30C23.72 30 30 23.72 30 16.004 30 8.28 23.72 2 16.004 2zm0 25.474a11.535 11.535 0 0 1-5.882-1.607l-.422-.25-4.235 1.108 1.13-4.12-.276-.44a11.524 11.524 0 0 1-1.77-6.16C4.549 9.686 9.686 4.549 16.004 4.549c3.065 0 5.944 1.194 8.112 3.363a11.404 11.404 0 0 1 3.35 8.092c0 6.318-5.136 11.47-11.462 11.47zm6.29-8.588c-.345-.172-2.04-1.006-2.355-1.12-.316-.115-.547-.172-.778.172-.23.345-.893 1.12-1.094 1.35-.2.23-.402.258-.747.086-.345-.172-1.456-.537-2.774-1.712-1.025-.916-1.717-2.047-1.918-2.392-.2-.345-.021-.531.15-.703.155-.155.345-.402.517-.603.172-.2.23-.345.345-.575.115-.23.057-.432-.029-.603-.086-.172-.778-1.875-1.066-2.565-.28-.672-.566-.58-.778-.592-.2-.01-.43-.013-.661-.013-.23 0-.603.086-.918.432-.316.345-1.205 1.178-1.205 2.87 0 1.693 1.234 3.328 1.406 3.558.172.23 2.428 3.707 5.88 5.198.823.355 1.464.567 1.965.726.825.263 1.577.226 2.17.137.662-.099 2.04-.834 2.327-1.638.287-.805.287-1.494.2-1.638-.086-.143-.316-.23-.661-.402z"/>
        </svg>
        {!open && (
          <span className="absolute w-14 h-14 rounded-full animate-ping opacity-30" style={{ backgroundColor: '#25D366' }} />
        )}
      </motion.button>
    </div>
  );
};

export default WhatsAppButton;
