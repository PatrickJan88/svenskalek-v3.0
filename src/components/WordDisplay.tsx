import React, { useState } from 'react';
import { Volume2, Plus, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { VocabularyWord } from '../data/vocabulary';
import { useVocabulary } from '../hooks/useVocabulary';

interface WordDisplayProps {
  wordData: VocabularyWord;
  isLoading: boolean;
  onNext?: () => void;
  showNextButton?: boolean;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ 
  wordData, 
  isLoading, 
  onNext,
  showNextButton = true 
}) => {
  const { addWord, isWordSaved } = useVocabulary();
  const [isAdding, setIsAdding] = useState(false);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);

  const playPronunciation = () => {
    // In a real app, this would play audio pronunciation
    console.log('Playing pronunciation for:', wordData.word);
  };

  const handleAddToVocabulary = () => {
    if (isWordSaved(wordData.id)) {
      return; // Already saved
    }

    setIsAdding(true);
    
    // Simulate adding delay for better UX
    setTimeout(() => {
      addWord(wordData);
      setIsAdding(false);
      setShowAddedFeedback(true);
      
      // Hide feedback after 2 seconds
      setTimeout(() => {
        setShowAddedFeedback(false);
      }, 2000);
    }, 500);
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  if (isLoading) {
    return (
      <div className="card p-4 animate-pulse">
        <div className="bg-neutral-200 h-48 rounded-lg mb-4"></div>
        <div className="bg-neutral-200 h-8 w-1/3 rounded mb-2"></div>
        <div className="bg-neutral-200 h-4 w-1/2 rounded mb-4"></div>
        <div className="bg-neutral-200 h-4 w-3/4 rounded mb-2"></div>
        <div className="bg-neutral-200 h-4 w-2/3 rounded mb-4"></div>
        <div className="bg-neutral-200 h-10 rounded"></div>
      </div>
    );
  }

  const wordAlreadySaved = isWordSaved(wordData.id);

  return (
    <div className="card overflow-hidden">
      <img 
        src={wordData.imageUrl} 
        alt={wordData.translation} 
        className="w-full h-56 object-cover"
      />
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-primary-700">{wordData.word}</h2>
          <button 
            onClick={playPronunciation}
            className="p-2 bg-primary-100 rounded-full hover:bg-primary-200 transition-colors"
          >
            <Volume2 size={20} className="text-primary-600" />
          </button>
        </div>
        
        <p className="text-neutral-500 mb-4">{wordData.translation}</p>
        
        <div className="bg-neutral-50 p-3 rounded-lg mb-4 border border-neutral-200">
          <p className="text-primary-700 font-medium">{wordData.exampleSentence}</p>
          <p className="text-neutral-500 text-sm mt-1">{wordData.exampleTranslation}</p>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={handleAddToVocabulary}
            disabled={isAdding || wordAlreadySaved || showAddedFeedback}
            className={`btn-outline flex-1 flex items-center justify-center transition-all ${
              wordAlreadySaved || showAddedFeedback
                ? 'bg-success-100 border-success-500 text-success-700'
                : isAdding
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {isAdding ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full mr-2"></div>
                <span>Adding...</span>
              </>
            ) : wordAlreadySaved || showAddedFeedback ? (
              <>
                <Check size={18} className="mr-2" />
                <span>Added to My Words</span>
              </>
            ) : (
              <>
                <Plus size={18} className="mr-2" />
                <span>Add to My Words</span>
              </>
            )}
          </button>
          
          {showNextButton && (
            <button 
              onClick={handleNext}
              className="btn-primary flex items-center justify-center"
            >
              <span>Next</span>
              <ArrowRight size={18} className="ml-2" />
            </button>
          )}
        </div>

        {showAddedFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-2 bg-success-100 border border-success-200 rounded-lg text-center"
          >
            <p className="text-success-700 text-sm font-medium">
              Word added to your vocabulary!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WordDisplay;