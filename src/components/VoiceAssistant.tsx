import { useState, useEffect } from 'react';
import { Mic, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceAssistant = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [command, setCommand] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (window.webkitSpeechRecognition) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setCommand('Listening...');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setCommand(transcript);
        onCommand(transcript);
      };

      recognition.onerror = (event) => {
        setCommand('Error: ' + event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setTimeout(() => setCommand(''), 2000);
      };

      setRecognition(recognition);
    } else {
      setCommand('Speech recognition not supported');
    }
  }, [onCommand]);

  const toggleListening = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    }
  };

  const pulseVariants = {
    active: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  };

  const rippleVariants = {
    initial: { scale: 0, opacity: 0.8 },
    animate: { scale: 2, opacity: 0 },
    transition: { duration: 1, repeat: Infinity },
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative pointer-events-auto">
        <AnimatePresence>
          {command && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: -60 }}
              exit={{ opacity: 0, y: -80 }}
              className="absolute left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full whitespace-nowrap"
            >
              {command}
            </motion.div>
          )}
        </AnimatePresence>

        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/30"
            initial="initial"
            animate="animate"
            variants={rippleVariants}
          />
        )}

        <motion.button
          onClick={toggleListening}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isListening ? "active" : "inactive"}
          variants={pulseVariants}
          className={`relative z-10 rounded-full p-6 bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg ${
            isListening ? 'ring-4 ring-blue-300' : ''
          }`}
        >
          {isListening ? (
            <Volume2 className="h-8 w-8 text-white animate-pulse" />
          ) : (
            <Mic className="h-8 w-8 text-white" />
          )}
        </motion.button>

        <motion.div
          className="absolute inset-0 bg-blue-200 rounded-full -z-10"
          initial={{ scale: 1 }}
          animate={isListening ? { scale: [1, 1.4, 1], opacity: [0.5, 0.2, 0.5] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  );
};

export default VoiceAssistant;