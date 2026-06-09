import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Check, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';

interface QuizCardProps {
  quizType: string;
  onClose: () => void;
}

// Mock quiz data
const imageWordQuizData = [
  {
    imageUrl: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=300',
    correctAnswer: 'äpple',
    options: ['äpple', 'banan', 'apelsin', 'päron']
  },
  {
    imageUrl: 'https://images.pexels.com/photos/58997/pexels-photo-58997.jpeg?auto=compress&cs=tinysrgb&w=300',
    correctAnswer: 'hund',
    options: ['katt', 'hund', 'kanin', 'häst']
  },
  {
    imageUrl: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=300',
    correctAnswer: 'kaffe',
    options: ['vatten', 'te', 'kaffe', 'mjölk']
  }
];

const listenWordQuizData = [
  {
    word: 'bok',
    correctAnswer: 'bok',
    options: ['bok', 'bord', 'bil', 'båt']
  },
  {
    word: 'tack',
    correctAnswer: 'tack',
    options: ['hej', 'tack', 'nej', 'ja']
  },
  {
    word: 'vatten',
    correctAnswer: 'vatten',
    options: ['vin', 'öl', 'vatten', 'juice']
  }
];

const sentenceQuizData = [
  {
    sentence: 'Jag dricker ___ på morgonen.',
    correctAnswer: 'kaffe',
    options: ['vatten', 'kaffe', 'te', 'juice']
  },
  {
    sentence: '___ heter jag?',
    correctAnswer: 'Vad',
    options: ['Hur', 'Vem', 'Vad', 'När']
  },
  {
    sentence: 'Det är en röd ___.',
    correctAnswer: 'bil',
    options: ['hus', 'bil', 'bok', 'stol']
  }
];

const QuizCard: React.FC<QuizCardProps> = ({ quizType, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const quizData = 
    quizType === 'image-word' ? imageWordQuizData : 
    quizType === 'listen-word' ? listenWordQuizData : 
    sentenceQuizData;
  
  const currentQuestion = quizData[currentQuestionIndex];
  
  const checkAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    // Calculate the final score including this answer
    const newScore = correct ? score + 1 : score;
    
    if (correct) {
      setScore(newScore);
    }
    
    // Auto-proceed to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResults(true);
        // Use the calculated final score for confetti logic
        if (newScore >= quizData.length - 1) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 4000);
        }
      }
    }, 1500);
  };
  
  const getQuizTitle = () => {
    switch(quizType) {
      case 'image-word': return 'Image to Word';
      case 'listen-word': return 'Listen and Choose';
      case 'sentence': return 'Complete the Sentence';
      default: return 'Quiz';
    }
  };
  
  const playWord = (word: string) => {
    // In a real app, this would play audio pronunciation
    console.log('Playing pronunciation for:', word);
  };
  
  const renderQuizContent = () => {
    if (showResults) {
      return (
        <div className="text-center py-8">
          {showConfetti && <ReactConfetti recycle={false} numberOfPieces={200} />}
          <div className="bg-secondary-100 dark:bg-secondary-900 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-secondary-600 dark:text-secondary-400">{score}/{quizData.length}</span>
          </div>
          <h3 className="text-xl font-bold mb-2 dark:text-neutral-100">Quiz Complete!</h3>
          <p className="text-neutral-600 dark:text-neutral-300 mb-6">
            {score === quizData.length 
              ? 'Perfect score! Amazing job!' 
              : score >= quizData.length / 2 
                ? 'Well done! Keep practicing to improve.' 
                : 'Good try! Practice more to improve your skills.'}
          </p>
          <div className="flex space-x-3">
            <button 
              onClick={onClose}
              className="btn-outline flex-1"
            >
              Exit
            </button>
            <button 
              onClick={() => {
                setCurrentQuestionIndex(0);
                setSelectedAnswer(null);
                setIsCorrect(null);
                setScore(0);
                setShowResults(false);
              }}
              className="btn-primary flex-1"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    
    switch(quizType) {
      case 'image-word':
        return (
          <>
            <div className="aspect-w-16 aspect-h-9 bg-neutral-200 dark:bg-neutral-700 mb-4">
              <img 
                src={currentQuestion.imageUrl} 
                alt="Quiz item" 
                className="w-full h-56 object-cover rounded-lg"
              />
            </div>
            <h3 className="text-base font-medium mb-4 text-center dark:text-neutral-100">What's this in Swedish?</h3>
          </>
        );
        
      case 'listen-word':
        return (
          <div className="text-center py-8 mb-4">
            <button 
              onClick={() => playWord(currentQuestion.word)}
              className="bg-secondary-100 dark:bg-secondary-900 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-secondary-200 dark:hover:bg-secondary-800 transition-colors"
            >
              <Volume2 size={36} className="text-secondary-600 dark:text-secondary-400" />
            </button>
            <h3 className="text-base font-medium dark:text-neutral-100">Select the word you hear</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Tap the speaker to listen again</p>
          </div>
        );
        
      case 'sentence':
        return (
          <div className="py-6 mb-4">
            <h3 className="text-base font-medium mb-4 text-center dark:text-neutral-100">Complete the sentence</h3>
            <div className="text-center text-xl font-medium text-primary-700 dark:text-primary-300 mb-6 leading-relaxed">
              {currentQuestion.sentence.split('___').map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="inline-block mx-1 w-16 border-b-2 border-primary-500 dark:border-primary-400"></span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
        <h2 className="font-semibold dark:text-neutral-100">{getQuizTitle()}</h2>
        <div className="flex items-center">
          <span className="text-sm font-medium mr-4 dark:text-neutral-300">
            {currentQuestionIndex + 1}/{quizData.length}
          </span>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors"
          >
            <X size={18} className="text-neutral-500 dark:text-neutral-400" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {renderQuizContent()}
        
        {!showResults && (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                disabled={selectedAnswer !== null}
                onClick={() => checkAnswer(option)}
                className={`w-full p-3 rounded-lg border transition-all ${
                  selectedAnswer === option
                    ? isCorrect
                      ? 'bg-success-100 dark:bg-success-900 border-success-500 dark:border-success-400 text-success-700 dark:text-success-300'
                      : 'bg-error-100 dark:bg-error-900 border-error-500 dark:border-error-400 text-error-700 dark:text-error-300'
                    : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-300 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 dark:text-neutral-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {selectedAnswer === option && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`p-1 rounded-full ${
                          isCorrect ? 'bg-success-500' : 'bg-error-500'
                        }`}
                      >
                        {isCorrect ? (
                          <Check size={14} className="text-white" />
                        ) : (
                          <X size={14} className="text-white" />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCard;