import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 max-w-md h-full flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold text-primary-700 mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-neutral-600 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="btn-primary inline-flex items-center"
        >
          <Home size={18} className="mr-2" />
          <span>Go Home</span>
        </button>
      </div>
    </div>
  );
};

export default NotFound;