import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-auto pt-4 pb-20">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
};

export default Layout;