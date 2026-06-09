import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageIcon, Volume2, AlignLeft, Book, ArrowLeft, VolumeX } from 'lucide-react';
import QuizCard from '../components/QuizCard';
import VocabularyReview from '../components/VocabularyReview';
import { useVocabulary } from '../hooks/useVocabulary';

const Play: React.FC = () => {
  const navigate = useNavigate();
  const { savedWords } = useVocabulary();
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [showVocabularyReview, setShowVocabularyReview] = useState(false);
  
  // TTS state
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize TTS
  useEffect(() => {
    console.log('🎤 Play: Initializing TTS...');
    
    const initializeTTS = () => {
      try {
        if (!('speechSynthesis' in window)) {
          console.log('❌ Play: SpeechSynthesis not available');
          setTtsSupported(false);
          setIsInitialized(true);
          return;
        }

        console.log('✅ Play: SpeechSynthesis available');
        setTtsSupported(true);

        const loadVoices = () => {
          const voices = speechSynthesis.getVoices();
          console.log(`🎤 Play: Loaded ${voices.length} voices`);
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
        console.log('❌ Play: TTS initialization error:', error);
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
        console.log('Play cleanup error:', error);
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
    console.log('🎵 Play: Playing pronunciation for:', word);
    
    if (!isInitialized) {
      console.log('❌ Play: TTS not initialized yet');
      return;
    }
    
    if (!ttsSupported) {
      console.log('❌ Play: TTS not supported');
      return;
    }
    
    // If this word is already playing, stop it
    if (currentlyPlaying === word) {
      console.log('🛑 Play: Stopping current speech');
      stopCurrentSpeech();
      return;
    }
    
    // Stop any other speech
    stopCurrentSpeech();
    
    try {
      // Wait a moment for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('🚀 Play: Starting speech synthesis for:', word);
      
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
        console.log('🎤 Play: Using voice:', voice.name);
      }
      
      // Event handlers
      utterance.onstart = () => {
        console.log('🎵 Play: Speech started for:', word);
        setCurrentlyPlaying(word);
      };
      
      utterance.onend = () => {
        console.log('🎵 Play: Speech ended for:', word);
        setCurrentlyPlaying(null);
        utteranceRef.current = null;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
      
      utterance.onerror = (event) => {
        console.log('❌ Play: Speech error:', event.error);
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
        console.log('⏰ Play: Speech timeout for:', word);
        setCurrentlyPlaying(null);
        utteranceRef.current = null;
        timeoutRef.current = null;
      }, Math.max(2000, word.length * 150));
      
    } catch (error) {
      console.log('❌ Play: Error in playPronunciation:', error);
      setCurrentlyPlaying(null);
    }
  };
  
  const quizTypes = [
    { 
      id: 'image-word', 
      title: 'Image to Word', 
      description: 'Match images with their Swedish words',
      icon: <ImageIcon size={24} className="text-primary-500 dark:text-primary-300" />
    },
    { 
      id: 'listen-word', 
      title: 'Listen and Choose', 
      description: 'Select the word you hear',
      icon: <Volume2 size={24} className="text-secondary-600 dark:text-secondary-400" />
    },
    { 
      id: 'sentence', 
      title: 'Complete the Sentence', 
      description: 'Fill in the missing word',
      icon: <AlignLeft size={24} className="text-accent-500 dark:text-accent-400" />
    }
  ];
  
  return (
    <div className="container mx-auto px-4 max-w-md">
      {!activeQuiz && !showVocabularyReview ? (
        <>
          <h1 className="text-2xl font-bold mb-6 text-primary-700 dark:text-primary-300">Play</h1>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 dark:text-neutral-100">Games</h2>
            <div className="space-y-3">
              {quizTypes.map(quiz => (
                <button
                  key={quiz.id}
                  className="card p-4 w-full flex items-center hover:shadow-md transition-shadow"
                  onClick={() => setActiveQuiz(quiz.id)}
                >
                  <div className="bg-neutral-100 dark:bg-neutral-700 p-3 rounded-full mr-4">
                    {quiz.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium dark:text-neutral-100">{quiz.title}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{quiz.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
          
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold dark:text-neutral-100">My Vocabulary</h2>
              <button 
                onClick={() => navigate('/vocabulary')} 
                className="text-sm text-primary-500 dark:text-primary-400 font-medium"
              >
                View All
              </button>
            </div>
            
            <div className="card p-4">
              <div className="flex items-center mb-4">
                <div className="bg-success-100 dark:bg-success-900 p-3 rounded-full mr-4">
                  <Book className="text-success-500 dark:text-success-300" size={24} />
                </div>
                <div>
                  <h3 className="font-medium dark:text-neutral-100">Review Words</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{savedWords.length} words saved</p>
                </div>
              </div>
              
              {savedWords.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {savedWords.slice(0, 4).map(word => {
                      const isPlaying = currentlyPlaying === word.word;
                      const canPlay = isInitialized && ttsSupported;
                      
                      return (
                        <div key={word.id} className="flex items-center gap-2 px-3 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-full text-sm dark:text-neutral-300">
                          <span>{word.word}</span>
                          <button
                            onClick={() => playPronunciation(word.word)}
                            disabled={!canPlay}
                            className={`p-1 rounded-full transition-all duration-200 ${
                              !canPlay
                                ? 'opacity-50 cursor-not-allowed'
                                : isPlaying
                                  ? 'bg-error-100 dark:bg-error-900 hover:bg-error-200 dark:hover:bg-error-800 scale-110'
                                  : 'hover:bg-neutral-200 dark:hover:bg-neutral-600 hover:scale-110'
                            }`}
                            title={
                              !isInitialized ? 'Loading audio...' :
                              !ttsSupported ? 'Audio not supported in this browser' :
                              isPlaying ? 'Click to stop' : 'Click to hear pronunciation'
                            }
                          >
                            {!canPlay ? (
                              <VolumeX size={12} className="text-neutral-400 dark:text-neutral-600" />
                            ) : isPlaying ? (
                              <VolumeX size={12} className="text-error-600 dark:text-error-400" />
                            ) : (
                              <Volume2 size={12} className="text-primary-500 dark:text-primary-400" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                    {savedWords.length > 4 && (
                      <div className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-full text-sm dark:text-neutral-300">
                        +{savedWords.length - 4} more
                      </div>
                    )}
                  </div>
                  
                  <button 
                    className="btn-primary w-full"
                    onClick={() => setShowVocabularyReview(true)}
                  >
                    Start Practice
                  </button>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-neutral-500 dark:text-neutral-400 mb-4">No words saved yet</p>
                  <button
                    onClick={() => navigate('/explore')}
                    className="btn-outline"
                  >
                    Explore Words
                  </button>
                </div>
              )}
            </div>
          </section>
        </>
      ) : activeQuiz ? (
        <QuizCard
          quizType={activeQuiz}
          onClose={() => setActiveQuiz(null)}
        />
      ) : (
        <>
          <div className="flex items-center mb-6">
            <button
              onClick={() => setShowVocabularyReview(false)}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors mr-2"
            >
              <ArrowLeft size={24} className="text-primary-500 dark:text-primary-400" />
            </button>
            <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-300">My Vocabulary</h1>
          </div>
          <VocabularyReview
            vocabulary={savedWords}
            onClose={() => setShowVocabularyReview(false)}
          />
        </>
      )}
    </div>
  );
};

export default Play;