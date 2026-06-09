import React, { useState, useEffect, useRef } from 'react';
import { Volume2, ChevronDown, ChevronUp, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for phrases
const phrasesData = [
  {
    category: 'Greetings',
    phrases: [
      { swedish: 'Hej', english: 'Hello' },
      { swedish: 'God morgon', english: 'Good morning' },
      { swedish: 'God kväll', english: 'Good evening' },
      { swedish: 'Hej då', english: 'Goodbye' },
    ]
  },
  {
    category: 'Basics',
    phrases: [
      { swedish: 'Ja', english: 'Yes' },
      { swedish: 'Nej', english: 'No' },
      { swedish: 'Tack', english: 'Thank you/Please' },
      { swedish: 'Varsågod', english: 'You\'re welcome' },
    ]
  },
  {
    category: 'Eating',
    phrases: [
      { swedish: 'Jag är hungrig', english: 'I am hungry' },
      { swedish: 'Kan jag få menyn?', english: 'Can I get the menu?' },
      { swedish: 'Vatten, tack', english: 'Water, please' },
      { swedish: 'Det var läckert', english: 'That was delicious' },
    ]
  }
];

const CommonPhrases: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Greetings']);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize TTS
  useEffect(() => {
    console.log('🎤 CommonPhrases: Initializing TTS...');
    
    const initializeTTS = () => {
      try {
        if (!('speechSynthesis' in window)) {
          console.log('❌ CommonPhrases: SpeechSynthesis not available');
          setTtsSupported(false);
          setIsInitialized(true);
          return;
        }

        console.log('✅ CommonPhrases: SpeechSynthesis available');
        setTtsSupported(true);

        const loadVoices = () => {
          const voices = speechSynthesis.getVoices();
          console.log(`🎤 CommonPhrases: Loaded ${voices.length} voices`);
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
        console.log('❌ CommonPhrases: TTS initialization error:', error);
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
        console.log('CommonPhrases cleanup error:', error);
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
  
  const toggleCategory = (category: string) => {
    // Stop any current speech when collapsing/expanding
    stopCurrentSpeech();
    
    setExpandedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const playPronunciation = async (phrase: string) => {
    console.log('🎵 CommonPhrases: Playing pronunciation for:', phrase);
    
    if (!isInitialized) {
      console.log('❌ CommonPhrases: TTS not initialized yet');
      return;
    }
    
    if (!ttsSupported) {
      console.log('❌ CommonPhrases: TTS not supported');
      return;
    }
    
    // If this phrase is already playing, stop it
    if (currentlyPlaying === phrase) {
      console.log('🛑 CommonPhrases: Stopping current speech');
      stopCurrentSpeech();
      return;
    }
    
    // Stop any other speech
    stopCurrentSpeech();
    
    try {
      // Wait a moment for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('🚀 CommonPhrases: Starting speech synthesis for:', phrase);
      
      const utterance = new SpeechSynthesisUtterance(phrase);
      
      // Configure for Swedish
      utterance.lang = 'sv-SE';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Set Swedish voice if available
      const voice = getSwedishVoice();
      if (voice) {
        utterance.voice = voice;
        console.log('🎤 CommonPhrases: Using voice:', voice.name);
      }
      
      // Event handlers
      utterance.onstart = () => {
        console.log('🎵 CommonPhrases: Speech started for:', phrase);
        setCurrentlyPlaying(phrase);
      };
      
      utterance.onend = () => {
        console.log('🎵 CommonPhrases: Speech ended for:', phrase);
        setCurrentlyPlaying(null);
        utteranceRef.current = null;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
      
      utterance.onerror = (event) => {
        console.log('❌ CommonPhrases: Speech error:', event.error);
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
      setCurrentlyPlaying(phrase);
      
      // Timeout fallback
      timeoutRef.current = setTimeout(() => {
        console.log('⏰ CommonPhrases: Speech timeout for:', phrase);
        setCurrentlyPlaying(null);
        utteranceRef.current = null;
        timeoutRef.current = null;
      }, Math.max(2000, phrase.length * 150));
      
    } catch (error) {
      console.log('❌ CommonPhrases: Error in playPronunciation:', error);
      setCurrentlyPlaying(null);
    }
  };
  
  return (
    <div>
      {phrasesData.map((category) => (
        <div key={category.category} className="card mb-2 overflow-hidden">
          <button
            className="w-full p-4 flex items-center justify-between font-medium text-left dark:text-neutral-100"
            onClick={() => toggleCategory(category.category)}
          >
            <span>{category.category}</span>
            {expandedCategories.includes(category.category) 
              ? <ChevronUp size={20} className="text-neutral-500 dark:text-neutral-400" />
              : <ChevronDown size={20} className="text-neutral-500 dark:text-neutral-400" />
            }
          </button>
          
          <AnimatePresence>
            {expandedCategories.includes(category.category) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-neutral-200 dark:border-neutral-700"
              >
                {category.phrases.map((phrase, index) => {
                  const isPlaying = currentlyPlaying === phrase.swedish;
                  const canPlay = isInitialized && ttsSupported;
                  
                  return (
                    <div 
                      key={index}
                      className={`p-3 flex items-center justify-between ${
                        index !== category.phrases.length - 1 ? 'border-b border-neutral-100 dark:border-neutral-700' : ''
                      }`}
                    >
                      <div>
                        <p className="font-medium text-primary-700 dark:text-primary-300">{phrase.swedish}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{phrase.english}</p>
                      </div>
                      <button
                        onClick={() => playPronunciation(phrase.swedish)}
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
                          <VolumeX size={18} className="text-neutral-400 dark:text-neutral-600" />
                        ) : isPlaying ? (
                          <VolumeX size={18} className="text-error-600 dark:text-error-400" />
                        ) : (
                          <Volume2 size={18} className="text-primary-500 dark:text-primary-400" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default CommonPhrases;