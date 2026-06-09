import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, TrendingUp, Play, Headphones, Clock, Star } from 'lucide-react';
import DailyMission from '../components/DailyMission';
import PodcastPlayer from '../components/PodcastPlayer';
import { podcastEpisodes, getRandomPodcast } from '../data/podcasts';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [streak, setStreak] = useState(7);
  const [wordsLearned, setWordsLearned] = useState(24);
  const [missionProgress, setMissionProgress] = useState({ completed: 0, total: 3 });
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [featuredPodcast] = useState(() => getRandomPodcast());
  
  const handleMissionProgress = (completed: number, total: number) => {
    setMissionProgress({ completed, total });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300';
      case 'Intermediate': return 'bg-warning-100 dark:bg-warning-900 text-warning-700 dark:text-warning-300';
      case 'Advanced': return 'bg-error-100 dark:bg-error-900 text-error-700 dark:text-error-300';
      default: return 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300';
    }
  };
  
  return (
    <div className="container mx-auto px-4 max-w-md">
      <div className="flex items-center mb-6 px-4">
        <img 
          src="/SvenskaLek Logo.png" 
          alt="SvenskaLek Logo" 
          className="h-12 w-12 object-contain mr-2"
        />
        <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-300">SvenskaLek</h1>
      </div>
      
      {/* Daily Mission Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4 px-4">
          <h2 className="text-xl font-semibold dark:text-neutral-100">Daily Mission</h2>
          <span className="text-sm text-primary-500 dark:text-primary-400 font-medium">
            {missionProgress.completed}/{missionProgress.total} completed
          </span>
        </div>
        <DailyMission onProgressUpdate={handleMissionProgress} />
      </section>
      
      {/* Podcast Section */}
      <section className="mb-8 px-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold dark:text-neutral-100">Daily Podcast</h2>
        </div>
        
        {/* Daily Podcast Card */}
        <div className="card overflow-hidden mb-4">
          <div className="relative">
            <img 
              src={featuredPodcast.imageUrl} 
              alt={featuredPodcast.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-3 left-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(featuredPodcast.difficulty)}`}>
                {featuredPodcast.difficulty}
              </span>
            </div>
            <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs flex items-center">
              <Clock size={12} className="mr-1" />
              {featuredPodcast.duration}
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 dark:text-neutral-100">{featuredPodcast.title}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">{featuredPodcast.description}</p>
            
            <button 
              onClick={() => setSelectedPodcast(featuredPodcast)}
              className="btn-primary w-full flex items-center justify-center"
            >
              <Play size={18} className="mr-2" />
              <span>Listen Now</span>
            </button>
          </div>
        </div>

        {/* Recent Episodes */}
        <div className="space-y-3">
          <h3 className="font-medium text-neutral-700 dark:text-neutral-300">Recent Episodes</h3>
          {podcastEpisodes.slice(0, 3).map((episode) => (
            <button
              key={episode.id}
              onClick={() => setSelectedPodcast(episode)}
              className="w-full card p-3 flex items-center hover:shadow-md transition-shadow"
            >
              <img 
                src={episode.imageUrl} 
                alt={episode.title}
                className="w-12 h-12 rounded-lg object-cover mr-3"
              />
              <div className="flex-1 text-left">
                <h4 className="font-medium text-sm dark:text-neutral-100">{episode.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(episode.difficulty)}`}>
                    {episode.difficulty}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">{episode.duration}</span>
                </div>
              </div>
              <Headphones size={16} className="text-primary-500 dark:text-primary-400" />
            </button>
          ))}
        </div>
      </section>
      
      {/* Your Progress Section */}
      <section className="px-4">
        <h2 className="text-xl font-semibold mb-4 dark:text-neutral-100">Your Progress</h2>
        <div className="card p-4 mb-4">
          <div className="flex items-center">
            <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full mr-4">
              <Book className="text-primary-500 dark:text-primary-300" size={24} />
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Words Learned</p>
              <p className="text-xl font-bold dark:text-neutral-100">{wordsLearned}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="bg-secondary-100 dark:bg-secondary-900 p-3 rounded-full mr-4">
              <TrendingUp className="text-secondary-600 dark:text-secondary-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Current Streak</p>
              <p className="text-xl font-bold dark:text-neutral-100">{streak} days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Podcast Player Modal */}
      {selectedPodcast && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <PodcastPlayer 
              episode={selectedPodcast} 
              onClose={() => setSelectedPodcast(null)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;