import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { 
      path: '/', 
      icon: (
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src="/home.png" 
            alt="Home" 
            className="w-full h-full object-contain"
            style={{ minWidth: '24px', minHeight: '24px' }}
          />
        </div>
      ), 
      label: 'Home' 
    },
    { 
      path: '/explore', 
      icon: (
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src="/explore.png" 
            alt="Explore" 
            className="w-full h-full object-contain"
            style={{ minWidth: '24px', minHeight: '24px' }}
          />
        </div>
      ), 
      label: 'Explore' 
    },
    { 
      path: '/translate', 
      icon: (
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src="/translate.png" 
            alt="Translate" 
            className="w-full h-full object-contain"
            style={{ minWidth: '24px', minHeight: '24px' }}
          />
        </div>
      ), 
      label: 'Translate' 
    },
    { 
      path: '/play', 
      icon: (
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src="/play.png" 
            alt="Play" 
            className="w-full h-full object-contain"
            style={{ minWidth: '24px', minHeight: '24px' }}
          />
        </div>
      ), 
      label: 'Play' 
    },
    { 
      path: '/settings', 
      icon: (
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src="/settings.png" 
            alt="Settings" 
            className="w-full h-full object-contain"
            style={{ minWidth: '24px', minHeight: '24px' }}
          />
        </div>
      ), 
      label: 'Settings' 
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 shadow-lg z-10">
      <div className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-around items-center">
          {navItems.map(item => {
            const isActive = location.pathname === item.path || 
                            (item.path === '/' && location.pathname === '/');
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`nav-item flex-1 ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 flex items-center justify-center flex-shrink-0 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary-500 bg-opacity-10 border border-primary-500 dark:border-primary-400' 
                    : ''
                }`}>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <span className="mt-1 text-xs sm:text-sm lg:text-base">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navigation