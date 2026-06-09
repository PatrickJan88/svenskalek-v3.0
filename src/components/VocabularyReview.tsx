import React, { useState, useEffect, useRef } from 'react';
import { Volume2, ArrowRight, Check, X, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';

interface VocabularyWord {
  id: number;
  word: string;
  translation: string;
  imageUrl: string;
}

interface VocabularyReviewProps {
  vocabulary: VocabularyWord[];
  onClose: () => void;
}

const VocabularyReview: React.FC<VocabularyReviewProps> = ({ vocabulary, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [knownWords, setKnownWords] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // TTS state
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentWord = vocabulary[currentIndex];

  // Initialize TTS
  useEffect(() => {
    console.log('🎤 VocabularyReview: Initializing TTS...');
    
    const initializeTTS = () => {
      try {
        if (!('speechSynthesis' in window)) {
          console.log('❌ VocabularyReview: SpeechSynthesis not available');
          setTtsSupported(false);
          setIsInitialized(true);
          return;
        }

        console.log('✅ VocabularyReview: SpeechSynthesis available');
        setTtsSupported(true);

        const loadVoices = () => {
          const voices = speechSynthesis.getVoices();
          console.log(`🎤 VocabularyReview: Loaded ${voices.length} voices`);
          setAvailableVoices(voices);
          setIsInitialized(true);
        };

        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          loadVoices();
        } else {
          speechSynthesis.addEventListener('voiceschanged', loadVoices);
          setTimeout(() => {
            if (!isInitialized) {
              loadVoices();
            }
          }, 2000);
        }

      } catch (error) {
        console.log('❌ VocabularyReview: TTS initialization error:', error);
        setTtsSupported(false);
        setIsInitialized(true);
      }
    };

    initializeTTS();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      try {
        speechSynthesis.cancel();
      } catch (error) {
        console.log('VocabularyReview cleanup error:', error);
      }
    };
  }, []);

  // Get Swedish voice
  const getSwedishVoice = (): SpeechSynthesisVoice | null => {
    if (availableVoices.length === 0) return null;

    // Look for Swedish voices
    const swedishVoices = availableVoices.filter(voice => 
      voice.lang.toLowerCase().includes('sv') || 
      voice.name.toLowerCase().includes('swedish') ||
      voice.name.toLowerCase().includes('svenska')
    );
    
    if (swedishVoices.length > 0) {
      return swedishVoices[0];
    }
    
    // Fallback to Nordic voices
    const nordicVoices = availableVoices.filter(voice => 
      voice.lang.toLowerCase().includes('no') || 
      voice.lang.toLowerCase().includes('da')
    );
    
    if (nordicVoices.length > 0) {
      return nordicVoices[0];
    }
    
    // Return default voice
    return availableVoices[0] || null;
  };

  const stopCurrentSpeech = () => {
    try {
      speechSynthesis.cancel();
      setCurrentlyPlaying(null);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      utteranceRef.current = null;
    } catch (error) {
      console.log('Error stopping speech:', error);
    }
  };

  const playPronunciation = async (word: string) => {
    console.log('🎵 VocabularyReview: Playing pronunciation for:', word);
    
    if (!isInitialized) {
      console.log('❌ VocabularyReview: TTS not initialized yet');
      return;
    }
    
    if (!ttsSupported) {
      console.log('❌ VocabularyReview: TTS not supported');
      return;
    }
    
    // If this word is already playing, stop it
    if (currentlyPlaying === word) {
      console.log('🛑 VocabularyReview: Stopping current speech');
      stopCurrentSpeech();
      return;
    }
    
    // Stop any other speech
    stopCurrentSpeech();
    
    try {
      // Wait a moment for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('🚀 VocabularyReview: Starting speech synthesis for:', word);
      
      const utterance = new SpeechSynthesisUtterance(word);
      
      // Configure for Swedish
      utterance.lang = 'sv-SE';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Set Swedish voice if available
      const voice = getSwedishVoice();
      if (voice) {
        utterance.voice = voice;
        console.log('🎤 VocabularyReview: Using voice:', voice.name);
      }
      
      // Event handlers
      utterance.onstart = () => {
        console.log('🎵 VocabularyReview: Speech started for:', word);
        setCurrentlyPlaying(word);
      };
      
      utterance.onend = () => {
        console.log('🎵 VocabularyReview: Speech ended for:', word);
        setCurrentlyPlaying(null);
        utteranceRef.current = null;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
      
      utterance.onerror = (event) => {
        console.log('❌ VocabularyReview: Speech error:', event.error);
        setCurrentlyPlaying(null);
        utteranceRef.current = null;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
      
      // Store reference
      utteranceRef.current = utterance;
      
      // Start speaking
      speechSynthesis.speak(utterance);
      setCurrentlyPlaying(word);
      
      // Timeout fallback
      timeoutRef.current = setTimeout(() => {
        console.log('⏰ VocabularyReview: Speech timeout for:', word);
        setCurrentlyPlaying(null);
        utteranceRef.current = null;
        timeoutRef.current = null;
      }, Math.max(2000, word.length * 150));
      
    } catch (error) {
      console.log('❌ VocabularyReview: Error in playPronunciation:', error);
      setCurrentlyPlaying(null);
    }
  };

  const handleKnowWord = (known: boolean) => {
    // Stop any current speech when moving to next word
    stopCurrentSpeech();
    
    if (known) {
      setKnownWords([...knownWords, currentWord.id]);
    }
    
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranslation(false);
    } else {
      setShowResults(true);
      if (knownWords.length + (known ? 1 : 0) >= vocabulary.length * 0.8) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    }
  };

  const resetReview = () => {
    stopCurrentSpeech();
    setCurrentIndex(0);
    setShowTranslation(false);
    setKnownWords([]);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="card p-6">
        {showConfetti && <ReactConfetti recycle={false} numberOfPieces={200} />}
        <div className="text-center">
          <div className="bg-secondary-100 dark:bg-secondary-900 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-secondary-600 dark:text-secondary-400">
              {knownWords.length}/{vocabulary.length}
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2 dark:text-neutral-100">Review Complete!</h3>
          <p className="text-neutral-600 dark:text-neutral-300 mb-6">
            {knownWords.length === vocabulary.length
              ? 'Perfect! You know all the words!'
              : knownWords.length >= vocabulary.length * 0.8
              ? 'Great job! Keep practicing the words you missed.'
              : 'Keep practicing! You\'ll get better with time.'}
          </p>
          <div className="flex space-x-3">
            <button onClick={onClose} className="btn-outline flex-1">
              Exit
            </button>
            <button onClick={resetReview} className="btn-primary flex-1">
              Review Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPlaying = currentlyPlaying === currentWord.word;
  const canPlay = isInitialized && ttsSupported;

  return (
    <div className="card overflow-hidden">
      <img
        src={currentWord.imageUrl}
        alt={currentWord.word}
        className="w-full h-56 object-cover"
      />

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-primary-700 dark:text-primary-300">{currentWord.word}</h3>
          <button
            onClick={() => playPronunciation(currentWord.word)}
            disabled={!canPlay}
            className={`p-2 rounded-full transition-all duration-200 ${
              !canPlay
                ? 'opacity-50 cursor-not-allowed bg-neutral-100 dark:bg-neutral-700'
                : isPlaying
                  ? 'bg-error-100 dark:bg-error-900 hover:bg-error-200 dark:hover:bg-error-800 scale-110'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:scale-110'
            }`}
            title={
              !isInitialized ? 'Loading audio...' :
              !ttsSupported ? 'Audio not supported in this browser' :
              isPlaying ? 'Click to stop' : 'Click to hear pronunciation'
            }
          >
            {!canPlay ? (
              <VolumeX size={20} className="text-neutral-400 dark:text-neutral-600" />
            ) : isPlaying ? (
              <VolumeX size={20} className="text-error-600 dark:text-error-400" />
            ) : (
              <Volume2 size={20} className="text-primary-500 dark:text-primary-400" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {showTranslation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-neutral-50 dark:bg-neutral-700 p-3 rounded-lg border border-neutral-200 dark:border-neutral-600 mb-4"
            >
              <p className="text-primary-700 dark:text-primary-300">{currentWord.translation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!showTranslation ? (
          <button
            onClick={() => setShowTranslation(true)}
            className="btn-primary w-full mb-4"
          >
            Show Translation
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => handleKnowWord(false)}
              className="btn-outline flex items-center justify-center"
            >
              <X size={18} className="mr-2" />
              <span>Still Learning</span>
            </button>
            <button
              onClick={() => handleKnowWord(true)}
              className="btn-primary flex items-center justify-center"
            >
              <Check size={18} className="mr-2" />
              <span>I Know This</span>
            </button>
          </div>
        )}

        <div className="flex justify-between items-center text-sm text-neutral-500 dark:text-neutral-400">
          <span>Word {currentIndex + 1} of {vocabulary.length}</span>
          <span>{knownWords.length} words mastered</span>
        </div>
      </div>
    </div>
  );
};

export default VocabularyReview;