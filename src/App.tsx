import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Translate from './pages/Translate';
import Play from './pages/Play';
import Settings from './pages/Settings';
import Vocabulary from './pages/Vocabulary';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="translate" element={<Translate />} />
        <Route path="play" element={<Play />} />
        <Route path="settings" element={<Settings />} />
        <Route path="vocabulary" element={<Vocabulary />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;