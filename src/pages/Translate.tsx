import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Languages, ArrowRight, VolumeX, AlertCircle } from 'lucide-react';
import CommonPhrases from '../components/CommonPhrases';

// Comprehensive translation dictionary
const mockTranslations: Record<string, string> = {
  // Basic greetings
  'hello': 'hej',
  'hi': 'hej',
  'hey': 'hej',
  'good morning': 'god morgon',
  'good afternoon': 'god eftermiddag',
  'good evening': 'god kväll',
  'good night': 'god natt',
  'goodbye': 'hej då',
  'bye': 'hej då',
  'see you later': 'vi ses senare',
  'see you': 'vi ses',
  
  // Basic responses
  'how are you': 'hur mår du',
  'how are you doing': 'hur har du det',
  'what\'s up': 'vad händer',
  'thank you': 'tack',
  'thanks': 'tack',
  'thank you very much': 'tack så mycket',
  'you\'re welcome': 'varsågod',
  'please': 'tack',
  'excuse me': 'ursäkta mig',
  'sorry': 'förlåt',
  'i\'m sorry': 'jag är ledsen',
  
  // Basic words
  'yes': 'ja',
  'no': 'nej',
  'maybe': 'kanske',
  'ok': 'okej',
  'okay': 'okej',
  'fine': 'bra',
  'good': 'bra',
  'bad': 'dålig',
  'great': 'fantastisk',
  'nice': 'trevlig',
  
  // Questions
  'what': 'vad',
  'where': 'var',
  'when': 'när',
  'who': 'vem',
  'why': 'varför',
  'how': 'hur',
  'which': 'vilken',
  'what is this': 'vad är det här',
  'where is': 'var är',
  'how much': 'hur mycket',
  'how many': 'hur många',
  
  // Common phrases
  'i don\'t understand': 'jag förstår inte',
  'do you speak english': 'talar du engelska',
  'i don\'t speak swedish': 'jag talar inte svenska',
  'can you help me': 'kan du hjälpa mig',
  'help': 'hjälp',
  'i need help': 'jag behöver hjälp',
  'where is the bathroom': 'var är toaletten',
  'how much does it cost': 'vad kostar det',
  'what time is it': 'vad är klockan',
  
  // Food and drink
  'water': 'vatten',
  'coffee': 'kaffe',
  'tea': 'te',
  'beer': 'öl',
  'wine': 'vin',
  'food': 'mat',
  'bread': 'bröd',
  'milk': 'mjölk',
  'apple': 'äpple',
  'banana': 'banan',
  'orange': 'apelsin',
  'meat': 'kött',
  'fish': 'fisk',
  'chicken': 'kyckling',
  'vegetables': 'grönsaker',
  'fruit': 'frukt',
  'cheese': 'ost',
  'egg': 'ägg',
  'eggs': 'ägg',
  'sugar': 'socker',
  'salt': 'salt',
  'pepper': 'peppar',
  
  // Places
  'restaurant': 'restaurang',
  'hotel': 'hotell',
  'hospital': 'sjukhus',
  'pharmacy': 'apotek',
  'bank': 'bank',
  'store': 'butik',
  'shop': 'butik',
  'market': 'marknad',
  'airport': 'flygplats',
  'train station': 'tågstation',
  'bus stop': 'busshållplats',
  'bathroom': 'toalett',
  'toilet': 'toalett',
  'school': 'skola',
  'university': 'universitet',
  'library': 'bibliotek',
  'museum': 'museum',
  'park': 'park',
  'beach': 'strand',
  'city': 'stad',
  'country': 'land',
  'home': 'hem',
  'house': 'hus',
  'apartment': 'lägenhet',
  
  // Transportation
  'train': 'tåg',
  'bus': 'buss',
  'car': 'bil',
  'taxi': 'taxi',
  'bicycle': 'cykel',
  'bike': 'cykel',
  'plane': 'flygplan',
  'boat': 'båt',
  'ship': 'skepp',
  'metro': 'tunnelbana',
  'subway': 'tunnelbana',
  
  // Time
  'today': 'idag',
  'tomorrow': 'imorgon',
  'yesterday': 'igår',
  'now': 'nu',
  'later': 'senare',
  'morning': 'morgon',
  'afternoon': 'eftermiddag',
  'evening': 'kväll',
  'night': 'natt',
  'day': 'dag',
  'week': 'vecka',
  'month': 'månad',
  'year': 'år',
  'hour': 'timme',
  'minute': 'minut',
  'second': 'sekund',
  
  // Numbers
  'one': 'ett',
  'two': 'två',
  'three': 'tre',
  'four': 'fyra',
  'five': 'fem',
  'six': 'sex',
  'seven': 'sju',
  'eight': 'åtta',
  'nine': 'nio',
  'ten': 'tio',
  'hundred': 'hundra',
  'thousand': 'tusen',
  
  // Colors
  'red': 'röd',
  'blue': 'blå',
  'green': 'grön',
  'yellow': 'gul',
  'black': 'svart',
  'white': 'vit',
  'brown': 'brun',
  'pink': 'rosa',
  'purple': 'lila',
  'orange': 'orange',
  'gray': 'grå',
  'grey': 'grå',
  
  // Family
  'family': 'familj',
  'mother': 'mamma',
  'father': 'pappa',
  'parents': 'föräldrar',
  'son': 'son',
  'daughter': 'dotter',
  'brother': 'bror',
  'sister': 'syster',
  'grandmother': 'mormor',
  'grandfather': 'morfar',
  'child': 'barn',
  'children': 'barn',
  'baby': 'bebis',
  'friend': 'vän',
  'friends': 'vänner',
  
  // Common objects
  'book': 'bok',
  'phone': 'telefon',
  'computer': 'dator',
  'table': 'bord',
  'chair': 'stol',
  'bed': 'säng',
  'door': 'dörr',
  'window': 'fönster',
  'key': 'nyckel',
  'money': 'pengar',
  'bag': 'väska',
  'clothes': 'kläder',
  'shoes': 'skor',
  'hat': 'hatt',
  'glasses': 'glasögon',
  'watch': 'klocka',
  
  // Weather
  'weather': 'väder',
  'sun': 'sol',
  'rain': 'regn',
  'snow': 'snö',
  'wind': 'vind',
  'cloud': 'moln',
  'hot': 'varm',
  'cold': 'kall',
  'warm': 'varm',
  'cool': 'sval',
  'sunny': 'solig',
  'rainy': 'regnig',
  'snowy': 'snöig',
  'windy': 'blåsig',
  
  // Emotions
  'happy': 'glad',
  'sad': 'ledsen',
  'angry': 'arg',
  'tired': 'trött',
  'hungry': 'hungrig',
  'thirsty': 'törstig',
  'sick': 'sjuk',
  'healthy': 'frisk',
  'excited': 'upphetsad',
  'nervous': 'nervös',
  'worried': 'orolig',
  'surprised': 'förvånad',
  
  // Actions
  'go': 'gå',
  'come': 'komma',
  'eat': 'äta',
  'drink': 'dricka',
  'sleep': 'sova',
  'work': 'arbeta',
  'study': 'studera',
  'read': 'läsa',
  'write': 'skriva',
  'speak': 'tala',
  'listen': 'lyssna',
  'see': 'se',
  'look': 'titta',
  'hear': 'höra',
  'think': 'tänka',
  'know': 'veta',
  'understand': 'förstå',
  'learn': 'lära',
  'teach': 'lära ut',
  'buy': 'köpa',
  'sell': 'sälja',
  'give': 'ge',
  'take': 'ta',
  'make': 'göra',
  'do': 'göra',
  'have': 'ha',
  'be': 'vara',
  'like': 'gilla',
  'love': 'älska',
  'want': 'vilja',
  'need': 'behöva',
  'can': 'kan',
  'must': 'måste',
  'should': 'borde',
  'will': 'kommer att',
  'would': 'skulle',
  
  // Sentences
  'i am': 'jag är',
  'you are': 'du är',
  'he is': 'han är',
  'she is': 'hon är',
  'we are': 'vi är',
  'they are': 'de är',
  'i have': 'jag har',
  'you have': 'du har',
  'i want': 'jag vill',
  'i need': 'jag behöver',
  'i like': 'jag gillar',
  'i love': 'jag älskar',
  'i am hungry': 'jag är hungrig',
  'i am thirsty': 'jag är törstig',
  'i am tired': 'jag är trött',
  'i am happy': 'jag är glad',
  'i am sad': 'jag är ledsen',
  'i am from': 'jag kommer från',
  'my name is': 'mitt namn är',
  'what is your name': 'vad heter du',
  'nice to meet you': 'trevligt att träffa dig',
  'how old are you': 'hur gammal är du',
  'i am ... years old': 'jag är ... år gammal',
  'where are you from': 'var kommer du ifrån',
  'do you like': 'gillar du',
  'i don\'t like': 'jag gillar inte',
  'can i have': 'kan jag få',
  'i would like': 'jag skulle vilja',
  'how much is this': 'vad kostar det här',
  'where can i find': 'var kan jag hitta',
  'is there a': 'finns det en',
  'are there any': 'finns det några'
};

const Translate: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [fromLanguage, setFromLanguage] = useState<'en' | 'sv'>('en');
  
  // TTS state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize TTS support check
  useEffect(() => {
    console.log('🎤 Initializing TTS...');
    
    const initializeTTS = () => {
      try {
        // Check if speechSynthesis is available
        if (!('speechSynthesis' in window)) {
          console.log('❌ SpeechSynthesis not available');
          setTtsSupported(false);
          setIsInitialized(true);
          return;
        }

        console.log('✅ SpeechSynthesis available');
        setTtsSupported(true);

        // Function to load voices
        const loadVoices = () => {
          const voices = speechSynthesis.getVoices();
          console.log(`🎤 Loaded ${voices.length} voices:`, voices.map(v => `${v.name} (${v.lang})`));
          setAvailableVoices(voices);
          setIsInitialized(true);
        };

        // Load voices immediately if available
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          loadVoices();
        } else {
          // Wait for voices to load
          console.log('🎤 Waiting for voices to load...');
          speechSynthesis.addEventListener('voiceschanged', loadVoices);
          
          // Fallback timeout
          setTimeout(() => {
            if (!isInitialized) {
              console.log('🎤 Timeout reached, initializing with available voices');
              loadVoices();
            }
          }, 3000);
        }

      } catch (error) {
        console.log('❌ TTS initialization error:', error);
        setTtsSupported(false);
        setIsInitialized(true);
      }
    };

    initializeTTS();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      try {
        speechSynthesis.cancel();
      } catch (error) {
        console.log('Cleanup error:', error);
      }
    };
  }, []);
  
  // Get the best voice for the target language
  const getBestVoice = (targetLang: 'en' | 'sv'): SpeechSynthesisVoice | null => {
    if (availableVoices.length === 0) {
      console.log('🎤 No voices available yet');
      return null;
    }

    console.log(`🎤 Looking for ${targetLang} voice among ${availableVoices.length} voices`);
    
    if (targetLang === 'sv') {
      // Look for Swedish voices
      const swedishVoices = availableVoices.filter(voice => 
        voice.lang.toLowerCase().includes('sv') || 
        voice.name.toLowerCase().includes('swedish') ||
        voice.name.toLowerCase().includes('svenska')
      );
      
      if (swedishVoices.length > 0) {
        console.log('🎤 Found Swedish voice:', swedishVoices[0].name);
        return swedishVoices[0];
      }
      
      // Fallback to Nordic voices
      const nordicVoices = availableVoices.filter(voice => 
        voice.lang.toLowerCase().includes('no') || 
        voice.lang.toLowerCase().includes('da') ||
        voice.lang.toLowerCase().includes('nb') ||
        voice.lang.toLowerCase().includes('nn')
      );
      
      if (nordicVoices.length > 0) {
        console.log('🎤 Using Nordic voice as fallback:', nordicVoices[0].name);
        return nordicVoices[0];
      }
    } else {
      // Look for English voices
      const englishVoices = availableVoices.filter(voice => 
        voice.lang.toLowerCase().includes('en')
      );
      
      if (englishVoices.length > 0) {
        console.log('🎤 Found English voice:', englishVoices[0].name);
        return englishVoices[0];
      }
    }
    
    // Return default voice
    const defaultVoice = availableVoices[0] || null;
    if (defaultVoice) {
      console.log('🎤 Using default voice:', defaultVoice.name);
    }
    return defaultVoice;
  };
  
  // Enhanced translation function
  const handleTranslate = () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const cleanInput = inputText.toLowerCase().trim();
      
      if (fromLanguage === 'en') {
        // English to Swedish
        let translation = mockTranslations[cleanInput];
        
        // If exact match not found, try partial matches
        if (!translation) {
          // Try to find partial matches
          const partialMatch = Object.keys(mockTranslations).find(key => 
            key.includes(cleanInput) || cleanInput.includes(key)
          );
          
          if (partialMatch) {
            translation = mockTranslations[partialMatch];
          }
        }
        
        // If still no translation, try word-by-word for simple cases
        if (!translation) {
          const words = cleanInput.split(' ');
          const translatedWords = words.map(word => 
            mockTranslations[word] || word
          );
          
          // Only use word-by-word if at least one word was translated
          if (translatedWords.some((word, index) => word !== words[index])) {
            translation = translatedWords.join(' ');
          }
        }
        
        setTranslatedText(translation || 'Translation not available');
      } else {
        // Swedish to English (reverse lookup)
        const entry = Object.entries(mockTranslations)
          .find(([_, sv]) => sv.toLowerCase() === cleanInput);
        
        if (entry) {
          setTranslatedText(entry[0]);
        } else {
          // Try partial matches for Swedish to English
          const partialEntry = Object.entries(mockTranslations)
            .find(([_, sv]) => sv.toLowerCase().includes(cleanInput) || cleanInput.includes(sv.toLowerCase()));
          
          setTranslatedText(partialEntry ? partialEntry[0] : 'Translation not available');
        }
      }
      
      setIsTranslating(false);
    }, 500);
  };
  
  const swapLanguages = () => {
    // Stop any current speech
    stopSpeech();
    
    setFromLanguage(prev => prev === 'en' ? 'sv' : 'en');
    setInputText(translatedText);
    setTranslatedText(inputText);
    setTtsError(null);
  };

  const stopSpeech = () => {
    try {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      utteranceRef.current = null;
    } catch (error) {
      console.log('Error stopping speech:', error);
    }
  };
  
  const playPronunciation = async () => {
    console.log('🎵 Play button clicked!');
    console.log('🎤 Current state:', { 
      ttsSupported, 
      isInitialized, 
      isSpeaking, 
      translatedText,
      voicesCount: availableVoices.length
    });
    
    // Clear any previous errors
    setTtsError(null);
    
    // Validation checks
    if (!isInitialized) {
      setTtsError('Audio system is still loading, please wait a moment...');
      return;
    }
    
    if (!ttsSupported) {
      setTtsError('Text-to-speech is not supported in your browser. Please try Chrome, Edge, or Safari.');
      return;
    }
    
    if (!translatedText || translatedText === 'Translation not available') {
      setTtsError('No valid translation to speak. Please translate some text first.');
      return;
    }
    
    // If already speaking, stop it
    if (isSpeaking) {
      console.log('🛑 Stopping current speech...');
      stopSpeech();
      return;
    }
    
    try {
      console.log('🚀 Starting speech synthesis...');
      
      // Force stop any existing speech
      speechSynthesis.cancel();
      
      // Wait a moment for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Determine target language
      const targetLanguage = fromLanguage === 'en' ? 'sv' : 'en';
      const textToSpeak = translatedText.trim();
      
      console.log(`🎤 Speaking "${textToSpeak}" in ${targetLanguage}`);
      
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Configure utterance
      utterance.lang = targetLanguage === 'sv' ? 'sv-SE' : 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Set voice
      const voice = getBestVoice(targetLanguage);
      if (voice) {
        utterance.voice = voice;
        console.log('🎤 Using voice:', voice.name, voice.lang);
      } else {
        console.log('🎤 No specific voice found, using browser default');
      }
      
      // Set up event handlers
      utterance.onstart = () => {
        console.log('🎵 Speech started');
        setIsSpeaking(true);
        setTtsError(null);
      };
      
      utterance.onend = () => {
        console.log('🎵 Speech ended');
        setIsSpeaking(false);
        utteranceRef.current = null;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
      
      utterance.onerror = (event) => {
        console.log('❌ Speech error:', event.error);
        setIsSpeaking(false);
        utteranceRef.current = null;
        
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          setTtsError(`Speech error: ${event.error}. Please try again.`);
        }
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
      
      // Store reference
      utteranceRef.current = utterance;
      
      // Start speaking
      console.log('🚀 Calling speechSynthesis.speak()');
      speechSynthesis.speak(utterance);
      
      // Set timeout as fallback (some browsers don't fire onend reliably)
      timeoutRef.current = setTimeout(() => {
        console.log('⏰ Speech timeout reached');
        setIsSpeaking(false);
        utteranceRef.current = null;
        timeoutRef.current = null;
      }, Math.max(3000, textToSpeak.length * 200)); // Estimate based on text length
      
      // Immediate state update
      setIsSpeaking(true);
      
      // Check if speech actually started
      setTimeout(() => {
        if (!speechSynthesis.speaking && !speechSynthesis.pending) {
          console.log('⚠️ Speech may not have started');
          setTtsError('Speech failed to start. Please check your browser audio settings and try again.');
          setIsSpeaking(false);
        }
      }, 200);
      
    } catch (error) {
      console.log('❌ Error in playPronunciation:', error);
      setTtsError(`Error: ${error}. Please try again or check your browser settings.`);
      setIsSpeaking(false);
    }
  };
  
  // Check if TTS is ready
  const isTTSReady = isInitialized && ttsSupported && translatedText && translatedText !== 'Translation not available';
  
  return (
    <div className="container mx-auto px-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-primary-700 dark:text-primary-300">Translate</h1>
      
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {fromLanguage === 'en' ? 'English' : 'Swedish'}
          </span>
          <button 
            onClick={swapLanguages}
            className="text-primary-500 dark:text-primary-400 text-sm font-medium flex items-center hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
          >
            <Languages size={16} className="mr-1" />
            <span>Swap Languages</span>
          </button>
        </div>
        
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="input min-h-24 mb-4 resize-none"
          placeholder={`Enter text in ${fromLanguage === 'en' ? 'English' : 'Swedish'}...`}
        ></textarea>
        
        <button 
          onClick={handleTranslate}
          disabled={!inputText.trim() || isTranslating}
          className="btn-primary w-full flex items-center justify-center"
        >
          {isTranslating ? (
            <span>Translating...</span>
          ) : (
            <>
              <span>
                Translate to {fromLanguage === 'en' ? 'Swedish' : 'English'}
              </span>
              <ArrowRight size={18} className="ml-2" />
            </>
          )}
        </button>
      </div>
      
      {translatedText && (
        <div className="card p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              {fromLanguage === 'en' ? 'Swedish' : 'English'}
            </span>
          </div>
          
          <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg border border-neutral-200 dark:border-neutral-600 mb-4">
            <p className="text-primary-700 dark:text-primary-300 font-medium text-lg">{translatedText}</p>
          </div>

          {/* Large, prominent TTS button */}
          <button 
            onClick={playPronunciation}
            disabled={!isTTSReady}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center ${
              !isTTSReady
                ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
                : isSpeaking
                  ? 'bg-error-500 hover:bg-error-600 text-white shadow-lg transform scale-105'
                  : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
            }`}
            title={
              !isInitialized ? 'Loading audio system...' :
              !ttsSupported ? 'Text-to-speech not supported in this browser' : 
              !translatedText || translatedText === 'Translation not available' ? 'No translation to speak' :
              isSpeaking ? 'Click to stop speaking' : 'Click to hear pronunciation'
            }
          >
            {!isInitialized ? (
              <>
                <div className="w-6 h-6 border-3 border-current border-t-transparent rounded-full animate-spin" />
                <span className="ml-3">Loading Audio...</span>
              </>
            ) : !ttsSupported ? (
              <>
                <VolumeX size={24} />
                <span className="ml-3">Audio Not Available</span>
              </>
            ) : !translatedText || translatedText === 'Translation not available' ? (
              <>
                <VolumeX size={24} />
                <span className="ml-3">No Translation</span>
              </>
            ) : isSpeaking ? (
              <>
                <span>🔇 Stop Speaking</span>
              </>
            ) : (
              <>
                <span>🔊 Listen to Pronunciation</span>
              </>
            )}
          </button>
          
          {/* Status info */}
          {isTTSReady && (
            <div className="mt-3 text-center">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                🎧 {fromLanguage === 'en' ? 'Swedish' : 'English'} pronunciation
                {availableVoices.length > 0 && ` • ${availableVoices.length} voices available`}
              </p>
            </div>
          )}
          
          {/* Error Display */}
          {ttsError && (
            <div className="mt-4 p-3 bg-error-100 dark:bg-error-900 border border-error-200 dark:border-error-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-error-600 dark:text-error-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-error-700 dark:text-error-300 text-sm font-medium">Audio Error</p>
                  <p className="text-error-600 dark:text-error-400 text-sm">{ttsError}</p>
                  <div className="mt-2 text-xs text-error-600 dark:text-error-400">
                    <p><strong>Troubleshooting:</strong></p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      <li>Check your browser's audio/volume settings</li>
                      <li>Try Chrome, Edge, or Safari for best compatibility</li>
                      <li>Make sure your device volume is turned up</li>
                      <li>Close other apps that might be using audio</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Browser compatibility warning */}
          {isInitialized && !ttsSupported && (
            <div className="mt-4 p-3 bg-warning-100 dark:bg-warning-900 border border-warning-200 dark:border-warning-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-warning-600 dark:text-warning-400 mt-0.5" />
                <div>
                  <p className="text-warning-700 dark:text-warning-300 text-sm font-medium">Audio Not Supported</p>
                  <p className="text-warning-600 dark:text-warning-400 text-sm">
                    Your browser doesn't support text-to-speech. For the best experience, please use:
                  </p>
                  <ul className="text-warning-600 dark:text-warning-400 text-sm list-disc list-inside mt-1">
                    <li>Google Chrome (recommended)</li>
                    <li>Microsoft Edge</li>
                    <li>Safari</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-neutral-100">Common Phrases</h2>
        <CommonPhrases />
      </div>
    </div>
  );
};

export default Translate;