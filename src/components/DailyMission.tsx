import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Star, RefreshCw } from 'lucide-react';
import { getRandomWords } from '../data/vocabulary';

interface DailyMissionProps {
  onProgressUpdate?: (completed: number, total: number) => void;
}

const DailyMission: React.FC<DailyMissionProps> = ({ onProgressUpdate }) => {
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isExtraChallenge, setIsExtraChallenge] = useState(false);
  const [extraChallengeWords, setExtraChallengeWords] = useState<any[]>([]);
  
  const missions = [
    {
      imageUrl: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=300',
      correctAnswer: 'äpple',
      hint: 'A round fruit that is often red or green'
    },
    {
      imageUrl: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300',
      correctAnswer: 'bil',
      hint: 'A vehicle with four wheels'
    },
    {
      imageUrl: 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&w=300',
      correctAnswer: 'flygplan',
      hint: 'A vehicle that flies in the sky'
    }
  ];
  
  const currentMission = isExtraChallenge ? extraChallengeWords[currentMissionIndex] : missions[currentMissionIndex];
  const totalMissions = isExtraChallenge ? extraChallengeWords.length : missions.length;
  
  // Report initial progress (0/3) when component mounts
  React.useEffect(() => {
    if (!isExtraChallenge) {
      onProgressUpdate?.(completedMissions.length, missions.length);
    }
  }, [onProgressUpdate, missions.length, isExtraChallenge, completedMissions.length]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.toLowerCase().trim() === currentMission.correctAnswer) {
      setShowFeedback('correct');
      
      // Only add to completed missions if not already completed
      if (!completedMissions.includes(currentMissionIndex)) {
        const newCompletedMissions = [...completedMissions, currentMissionIndex];
        setCompletedMissions(newCompletedMissions);
        
        // Update progress immediately when answer is correct (real-time update)
        if (!isExtraChallenge) {
          onProgressUpdate?.(newCompletedMissions.length, missions.length);
        }
      }
      
      setTimeout(() => {
        if (currentMissionIndex < totalMissions - 1) {
          setCurrentMissionIndex(prev => prev + 1);
          setUserInput('');
          setShowFeedback(null);
          setAttempts(0);
        } else {
          // All missions completed
          if (!isExtraChallenge) {
            setShowCompletion(true);
          } else {
            // Extra challenge completed
            setShowCompletion(true);
          }
        }
      }, 1500);
    } else {
      setAttempts(prev => prev + 1);
      setShowFeedback('incorrect');
    }
  };

  const clearInput = () => {
    setUserInput('');
    setShowFeedback(null);
  };

  const handlePracticeMore = () => {
    // Get 3 random words for extra challenge
    const randomWords = getRandomWords(3);
    const extraWords = randomWords.map(word => ({
      imageUrl: word.imageUrl,
      correctAnswer: word.word,
      hint: word.translation
    }));
    
    setExtraChallengeWords(extraWords);
    setIsExtraChallenge(true);
    setCurrentMissionIndex(0);
    setCompletedMissions([]);
    setShowCompletion(false);
    setUserInput('');
    setShowFeedback(null);
    setAttempts(0);
  };

  const handleFinish = () => {
    setShowCompletion(false);
    // Reset everything for next time
    setCurrentMissionIndex(0);
    setCompletedMissions([]);
    setUserInput('');
    setShowFeedback(null);
    setAttempts(0);
    setIsExtraChallenge(false);
    setExtraChallengeWords([]);
    
    // Update progress to show all missions completed
    onProgressUpdate?.(missions.length, missions.length);
  };
  
  // Show completion screen
  if (showCompletion) {
    return (
      <div className="card overflow-hidden mx-4">
        <div className="p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="bg-secondary-100 dark:bg-secondary-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Star size={32} className="text-secondary-600 dark:text-secondary-400" />
          </motion.div>
          
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold mb-2 text-success-600 dark:text-success-400"
          >
            {isExtraChallenge ? 'Extra Challenge Complete!' : 'Daily Mission Complete!'}
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-neutral-600 dark:text-neutral-300 mb-6"
          >
            {isExtraChallenge 
              ? 'Fantastic! You completed the extra challenge. Keep up the great work!'
              : 'Congratulations! You\'ve completed today\'s mission successfully.'
            }
          </motion.p>
          
          {!isExtraChallenge ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <button 
                onClick={handlePracticeMore}
                className="btn-primary w-full flex items-center justify-center"
              >
                <RefreshCw size={18} className="mr-2" />
                <span>I want to practice more</span>
              </button>
              
              <button 
                onClick={handleFinish}
                className="btn-outline w-full"
              >
                Finish for today
              </button>
            </motion.div>
          ) : (
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={handleFinish}
              className="btn-primary w-full flex items-center justify-center"
            >
              <Check size={18} className="mr-2" />
              <span>Finish Practice</span>
            </motion.button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden mx-4">
      <div className="aspect-w-16 aspect-h-9 bg-neutral-200 dark:bg-neutral-700">
        <img 
          src={currentMission.imageUrl} 
          alt="Daily mission" 
          className="w-full h-56 object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-medium dark:text-neutral-100 mb-2">
          {isExtraChallenge ? 'Extra Challenge' : 'What\'s this in Swedish?'}
        </h3>
        
        <form onSubmit={handleSubmit} className="mb-2">
          <div className="relative">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="input pr-10"
              placeholder="Type your answer..."
              disabled={showFeedback === 'correct'}
            />
            {userInput && (
              <button
                type="button"
                onClick={clearInput}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
                aria-label="Clear input"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {showFeedback === 'incorrect' && (
            <p className="text-sm text-error-500 dark:text-error-400 mt-1">
              Try again! Hint: {currentMission.hint}
              {attempts >= 3 && (
                <span className="block mt-1">
                  The correct answer is "{currentMission.correctAnswer}"
                </span>
              )}
            </p>
          )}
          
          {showFeedback === 'correct' && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-success-500 dark:text-success-400 mt-1"
            >
              Correct! This is "{currentMission.correctAnswer}" in Swedish.
            </motion.p>
          )}
          
          <div className="mt-4">
            {showFeedback !== 'correct' && (
              <button type="submit" className="btn-primary w-full">
                Check Answer
              </button>
            )}
            
            {showFeedback === 'correct' && currentMissionIndex < totalMissions - 1 && (
              <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                Moving to next word...
              </p>
            )}
            
            {showFeedback === 'correct' && currentMissionIndex === totalMissions - 1 && (
              <p className="text-center text-success-600 dark:text-success-400 font-medium">
                {isExtraChallenge ? 'Extra challenge completed!' : 'All missions completed!'}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DailyMission;