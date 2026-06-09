import React, { useState, useRef } from 'react';
import { Upload, Camera, RefreshCw, UtensilsCrossed, PawPrint, Car, TreePine, Package, Shirt, MapPin, Gamepad2, Users } from 'lucide-react';
import WordDisplay from '../components/WordDisplay';
import { motion } from 'framer-motion';
import { vocabularyDatabase, VocabularyWord } from '../data/vocabulary';
import { useVocabulary } from '../hooks/useVocabulary';

// Mock image recognition database
const imageRecognitionDatabase: Record<string, any> = {
  'apple': { word: 'äpple', translation: 'apple', exampleSentence: 'Jag äter ett äpple.', exampleTranslation: 'I eat an apple.' },
  'dog': { word: 'hund', translation: 'dog', exampleSentence: 'Min hund är snäll.', exampleTranslation: 'My dog is kind.' },
  'cat': { word: 'katt', translation: 'cat', exampleSentence: 'Katten sover.', exampleTranslation: 'The cat is sleeping.' },
  'car': { word: 'bil', translation: 'car', exampleSentence: 'Jag kör bil.', exampleTranslation: 'I drive a car.' },
  'coffee': { word: 'kaffe', translation: 'coffee', exampleSentence: 'Jag dricker kaffe.', exampleTranslation: 'I drink coffee.' },
  'book': { word: 'bok', translation: 'book', exampleSentence: 'Jag läser en bok.', exampleTranslation: 'I read a book.' },
  'flower': { word: 'blomma', translation: 'flower', exampleSentence: 'Blomman är vacker.', exampleTranslation: 'The flower is beautiful.' },
  'tree': { word: 'träd', translation: 'tree', exampleSentence: 'Trädet är högt.', exampleTranslation: 'The tree is tall.' },
  'house': { word: 'hus', translation: 'house', exampleSentence: 'Mitt hus är stort.', exampleTranslation: 'My house is big.' },
  'water': { word: 'vatten', translation: 'water', exampleSentence: 'Jag dricker vatten.', exampleTranslation: 'I drink water.' }
};

// Category definitions with updated titles and icons
const categories = [
  { id: 'food', label: 'Food & Drinks', title: 'Food & Drinks', icon: UtensilsCrossed },
  { id: 'animals', label: 'Animals', title: 'Animals', icon: PawPrint },
  { id: 'transport', label: 'Transportation', title: 'Transportation', icon: Car },
  { id: 'nature', label: 'Nature', title: 'Nature', icon: TreePine },
  { id: 'objects', label: 'Objects', title: 'Objects', icon: Package },
  { id: 'clothing', label: 'Clothing', title: 'Clothing', icon: Shirt },
  { id: 'places', label: 'Places', title: 'Places', icon: MapPin },
  { id: 'entertainment', label: 'Entertainment', title: 'Entertainment', icon: Gamepad2 },
  { id: 'people', label: 'People & Abstract', title: 'People & Abstract', icon: Users }
];

// Vocabulary Card Component - Matching podcast card style
interface VocabularyCardProps {
  word: VocabularyWord;
  onAddToVocabulary: (word: VocabularyWord) => void;
  isAdded: boolean;
}

const VocabularyCard: React.FC<VocabularyCardProps> = ({ word, onAddToVocabulary, isAdded }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAdd = async () => {
    if (isAdded || isAdding) return;
    
    setIsAdding(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onAddToVocabulary(word);
    
    setIsAdding(false);
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-md transition-all duration-200"
    >
      {/* Image section - matching podcast card height */}
      <div className="relative">
        <img 
          src={word.imageUrl} 
          alt={word.word}
          className="w-full h-48 object-cover"
        />
      </div>
      
      {/* Content section - matching podcast card padding and layout */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 dark:text-neutral-100">{word.word}</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">{word.translation}</p>
        
        <button
          onClick={handleAdd}
          disabled={isAdded || isAdding}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center ${
            isAdded || showSuccess
              ? 'bg-success-400 dark:bg-success-600 cursor-default opacity-75' 
              : isAdding
                ? 'bg-success-400 cursor-not-allowed opacity-75'
                : 'bg-success-500 hover:bg-success-600 active:scale-95'
          }`}
        >
          {isAdding ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              <span>Adding...</span>
            </>
          ) : isAdded || showSuccess ? (
            <>
              <span>✓</span>
              <span className="ml-2">Added to My Vocabulary</span>
            </>
          ) : (
            <>
              <span>+</span>
              <span className="ml-2">Add to My Vocabulary</span>
            </>
          )}
        </button>
        
        {showSuccess && !isAdded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-2 bg-success-100 dark:bg-success-900 border border-success-200 dark:border-success-800 rounded-lg"
          >
            <p className="text-success-700 dark:text-success-300 text-sm font-medium">
              Word saved! Check it in Play → My Vocabulary
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const Explore: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('food'); // Default to Food & Drinks
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [uploadedWordData, setUploadedWordData] = useState<VocabularyWord | null>(null);
  const [showUploadedWord, setShowUploadedWord] = useState(false);
  
  const { addWord, isWordSaved } = useVocabulary();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Get filtered words based on selected category
  const filteredWords = vocabularyDatabase.filter(word => 
    word.category === selectedCategory
  );

  // Get current category info
  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  // Simulate image recognition API
  const recognizeImage = async (imageFile: File): Promise<any> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const objects = Object.keys(imageRecognitionDatabase);
        const randomObject = objects[Math.floor(Math.random() * objects.length)];
        const result = imageRecognitionDatabase[randomObject];
        resolve(result);
      }, 2000);
    });
  };

  const processImage = async (file: File) => {
    setIsLoading(true);
    setProcessingStatus('Processing image...');
    
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    
    try {
      setProcessingStatus('Recognizing objects...');
      const recognitionResult = await recognizeImage(file);
      
      setProcessingStatus('Translating to Swedish...');
      
      const newWordData: VocabularyWord = {
        id: Date.now(),
        word: recognitionResult.word,
        translation: recognitionResult.translation,
        exampleSentence: recognitionResult.exampleSentence,
        exampleTranslation: recognitionResult.exampleTranslation,
        imageUrl: imageUrl
      };
      
      setUploadedWordData(newWordData);
      setShowUploadedWord(true);
      setProcessingStatus('');
    } catch (error) {
      console.error('Error processing image:', error);
      setProcessingStatus('Error processing image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleTakePhoto = () => {
    cameraInputRef.current?.click();
  };

  const handleAddToVocabulary = (word: VocabularyWord) => {
    addWord(word);
  };

  const clearUploadedContent = () => {
    setShowUploadedWord(false);
    setUploadedImage(null);
    setUploadedWordData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="container mx-auto px-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-primary-700 dark:text-primary-300">Explore</h1>
      
      {/* Upload/Camera Section */}
      <div className="flex justify-between gap-4 mb-6">
        <button 
          className="btn-primary flex items-center flex-1 justify-center"
          onClick={handleBrowseFiles}
          disabled={isLoading}
        >
          <Upload size={16} className="mr-2" />
          <span>Browse Files</span>
        </button>
        <button 
          className="btn-outline flex items-center flex-1 justify-center"
          onClick={handleTakePhoto}
          disabled={isLoading}
        >
          <Camera size={16} className="mr-2" />
          <span>Take Photo</span>
        </button>
      </div>

      {/* Processing Status */}
      {(isLoading || processingStatus) && (
        <div className="card p-6 text-center mb-6">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-300">
            {processingStatus || 'Processing...'}
          </p>
        </div>
      )}

      {/* Show uploaded word if available */}
      {showUploadedWord && uploadedWordData && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">Uploaded Image Result</h2>
            <button 
              onClick={clearUploadedContent}
              className="text-sm text-primary-500 dark:text-primary-400 font-medium hover:text-primary-600 dark:hover:text-primary-300"
            >
              Clear
            </button>
          </div>
          <WordDisplay 
            wordData={uploadedWordData} 
            isLoading={false}
            showNextButton={false}
          />
        </div>
      )}

      {/* Categories Section */}
      {!showUploadedWord && (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-neutral-700 dark:text-neutral-300">Categories</h2>
            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              {currentCategory && <currentCategory.icon size={16} className="text-primary-500 dark:text-primary-300" />}
            </div>
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
              {currentCategory?.title}
            </h2>
          </div>

          {/* Vocabulary Grid - Now matching podcast card spacing */}
          {filteredWords.length > 0 ? (
            <div className="space-y-3 pb-8">
              {filteredWords.map((word) => (
                <VocabularyCard
                  key={word.id}
                  word={word}
                  onAddToVocabulary={handleAddToVocabulary}
                  isAdded={isWordSaved(word.id)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="card p-8 text-center">
              <div className="bg-neutral-100 dark:bg-neutral-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 dark:text-neutral-100">No Words Found</h3>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                No vocabulary words available for this category yet.
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Try selecting a different category or upload an image to learn new words!
              </p>
            </div>
          )}
        </>
      )}
      
      {/* Hidden file inputs */}
      <input 
        ref={fileInputRef}
        type="file" 
        className="hidden" 
        accept="image/*"
        onChange={handleFileUpload}
      />
      <input 
        ref={cameraInputRef}
        type="file" 
        className="hidden" 
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default Explore;