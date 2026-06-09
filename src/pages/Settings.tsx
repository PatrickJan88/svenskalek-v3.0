import React, { useState, useMemo } from 'react';
import { Volume2, Moon, Bell, Trash2, InfoIcon, LogOut, AlertTriangle, X } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import { useVocabulary } from '../hooks/useVocabulary';
import { motion, AnimatePresence } from 'framer-motion';

// Username generator function
const generateUsername = () => {
  const adjectives = [
    'Happy', 'Clever', 'Bright', 'Swift', 'Kind', 'Brave', 'Wise', 'Cool',
    'Smart', 'Quick', 'Bold', 'Calm', 'Eager', 'Fair', 'Gentle', 'Jolly'
  ];
  
  const nouns = [
    'Learner', 'Explorer', 'Student', 'Scholar', 'Adventurer', 'Seeker',
    'Discoverer', 'Traveler', 'Pioneer', 'Navigator', 'Wanderer', 'Voyager'
  ];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 999) + 1;
  
  return `${randomAdjective}${randomNoun}${randomNumber}`;
};

const Settings: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { savedWords, removeWord } = useVocabulary();
  
  // Generate consistent user data
  const userData = useMemo(() => {
    // Try to get existing username from localStorage, or generate new one
    let username = localStorage.getItem('username');
    if (!username) {
      username = generateUsername();
      localStorage.setItem('username', username);
    }
    
    return {
      username
    };
  }, []);

  const handleResetProgress = async () => {
    setIsResetting(true);
    
    try {
      // Clear all vocabulary words
      const wordIds = savedWords.map(word => word.id);
      for (const wordId of wordIds) {
        removeWord(wordId);
      }
      
      // Clear any other learning data from localStorage
      localStorage.removeItem('userVocabulary');
      localStorage.removeItem('dailyMissionProgress');
      localStorage.removeItem('streakData');
      localStorage.removeItem('learningStats');
      
      // Simulate some processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowResetDialog(false);
      setIsResetting(false);
      
      // Show success feedback (you could add a toast notification here)
      alert('All learning progress has been reset successfully!');
      
    } catch (error) {
      console.error('Error resetting progress:', error);
      setIsResetting(false);
      alert('There was an error resetting your progress. Please try again.');
    }
  };
  
  return (
    <div className="container mx-auto px-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-primary-700 dark:text-primary-300">Settings</h1>
      
      {/* User Profile Section */}
      <div className="card mb-6">
        <div className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full mr-4 flex-shrink-0 bg-white dark:bg-neutral-700 border-2 border-neutral-200 dark:border-neutral-600 p-1">
              <img 
                src="/ChatGPT Image Jun 15, 2025, 03_06_40 PM.png" 
                alt="Profile Avatar"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-lg text-neutral-800 dark:text-neutral-100 truncate">{userData.username}</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Swedish Learner</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card mb-6">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="font-semibold dark:text-neutral-100">App Settings</h2>
        </div>
        
        <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-full mr-3">
                <Volume2 size={20} className="text-primary-500 dark:text-primary-300" />
              </div>
              <div>
                <p className="font-medium dark:text-neutral-100">Sound Effects</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Enable sound effects in the app</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={soundEnabled}
                onChange={() => setSoundEnabled(!soundEnabled)}
              />
              <div className="w-11 h-6 bg-neutral-300 dark:bg-neutral-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-full mr-3">
                <Moon size={20} className="text-primary-500 dark:text-primary-300" />
              </div>
              <div>
                <p className="font-medium dark:text-neutral-100">Dark Mode</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Change app appearance</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={isDarkMode}
                onChange={toggleDarkMode}
              />
              <div className="w-11 h-6 bg-neutral-300 dark:bg-neutral-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-full mr-3">
                <Bell size={20} className="text-primary-500 dark:text-primary-300" />
              </div>
              <div>
                <p className="font-medium dark:text-neutral-100">Notifications</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Receive daily reminders</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              />
              <div className="w-11 h-6 bg-neutral-300 dark:bg-neutral-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="card mb-6">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="font-semibold dark:text-neutral-100">Data</h2>
        </div>
        
        <button 
          onClick={() => setShowResetDialog(true)}
          className="p-4 w-full flex items-center text-left text-error-600 dark:text-error-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
        >
          <div className="bg-error-100 dark:bg-error-900 p-2 rounded-full mr-3">
            <Trash2 size={20} className="text-error-500 dark:text-error-400" />
          </div>
          <div>
            <p className="font-medium">Reset Progress</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Clear all your learning data</p>
          </div>
        </button>
      </div>
      
      <div className="card mb-6">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="font-semibold dark:text-neutral-100">About</h2>
        </div>
        
        <button className="p-4 w-full flex items-center text-left hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
          <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-full mr-3">
            <InfoIcon size={20} className="text-primary-500 dark:text-primary-300" />
          </div>
          <div>
            <p className="font-medium dark:text-neutral-100">About SvenskaLek</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Version 2.0.0</p>
          </div>
        </button>
      </div>
      
      <button className="w-full p-4 flex items-center justify-center text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900 rounded-lg transition-colors">
        <LogOut size={20} className="mr-2" />
        <span className="font-medium">Sign Out</span>
      </button>

      {/* Reset Progress Confirmation Dialog */}
      <AnimatePresence>
        {showResetDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-error-100 dark:bg-error-900 p-2 rounded-full mr-3">
                      <AlertTriangle size={20} className="text-error-600 dark:text-error-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      Reset Progress
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowResetDialog(false)}
                    disabled={isResetting}
                    className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors"
                  >
                    <X size={18} className="text-neutral-500 dark:text-neutral-400" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                  Are you sure you want to clear all your learning data? This action cannot be undone.
                </p>
                
                <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-error-800 dark:text-error-300 mb-2">
                    This will permanently delete:
                  </h4>
                  <ul className="text-sm text-error-700 dark:text-error-400 space-y-1">
                    <li>• All saved vocabulary words ({savedWords.length} words)</li>
                    <li>• Daily mission progress</li>
                    <li>• Learning streaks and statistics</li>
                    <li>• All personal learning data</li>
                  </ul>
                </div>

                {/* Action Buttons - Made smaller */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowResetDialog(false)}
                    disabled={isResetting}
                    className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetProgress}
                    disabled={isResetting}
                    className="flex-1 px-3 py-2 bg-error-600 hover:bg-error-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm whitespace-nowrap"
                  >
                    {isResetting ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        <span>Resetting...</span>
                      </>
                    ) : (
                      <span>Yes, Reset All Data</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;