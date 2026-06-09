import { useState, useEffect } from 'react';
import { VocabularyWord } from '../data/vocabulary';

// Custom hook for managing user's vocabulary
export const useVocabulary = () => {
  const [savedWords, setSavedWords] = useState<VocabularyWord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved words from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('userVocabulary');
      
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsedWords = JSON.parse(saved);
        
        if (Array.isArray(parsedWords)) {
          setSavedWords(parsedWords);
        } else {
          localStorage.removeItem('userVocabulary');
          setSavedWords([]);
        }
      } else {
        setSavedWords([]);
      }
    } catch (error) {
      console.error('Error loading saved vocabulary:', error);
      localStorage.removeItem('userVocabulary');
      setSavedWords([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save words to localStorage whenever savedWords changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('userVocabulary', JSON.stringify(savedWords));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [savedWords, isLoaded]);

  const addWord = (word: VocabularyWord) => {
    setSavedWords(prev => {
      // Check if word already exists
      const exists = prev.some(w => w.id === word.id);
      
      if (exists) {
        return prev;
      }
      
      const newWords = [...prev, word];
      return newWords;
    });
  };

  const removeWord = (wordId: number) => {
    setSavedWords(prev => {
      const filtered = prev.filter(w => w.id !== wordId);
      return filtered;
    });
  };

  const isWordSaved = (wordId: number) => {
    return savedWords.some(w => w.id === wordId);
  };

  return {
    savedWords,
    addWord,
    removeWord,
    isWordSaved,
    isLoaded
  };
};