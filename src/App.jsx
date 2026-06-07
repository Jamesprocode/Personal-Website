import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MiniPlayer from './components/MiniPlayer';
import ScrollToTop from './components/ScrollToTop';
import CursorMusicTrail from './components/CursorMusicTrail';
import Landing from './pages/Landing/Landing';
import Music from './pages/Music/Music';
import Timeline from './pages/Timeline/Timeline';
import ProjectDetail from './pages/Project/ProjectDetail';
import { AudioPlayerProvider } from './hooks/useAudioPlayer';
import { ThemeProvider } from './hooks/useTheme';
import './App.css';

// Inner component lives below <Router> so it can call useLocation. Keying
// AnimatePresence's child Routes by location.pathname is what lets
// framer-motion run each page's exit before the next page's enter.
function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/music" element={<Music />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const hasSeenLoading = () => {
    const hasSeenLoading = sessionStorage.getItem('hasSeenLoading');
    return Boolean(hasSeenLoading);
  };

  const [isLoading, setIsLoading] = useState(() => !hasSeenLoading());
  const [showContent, setShowContent] = useState(hasSeenLoading);

  const handleLoadingComplete = () => {
    sessionStorage.setItem('hasSeenLoading', 'true');
    setIsLoading(false);
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <Router>
      <ScrollToTop />
      <ThemeProvider>
        {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}

        {showContent && (
          <AudioPlayerProvider>
            <div className="app">
              <Navbar />
              <AppRoutes />
              <Footer />
              <MiniPlayer />
            </div>
          </AudioPlayerProvider>
        )}
        {/* Cursor music trail follows the user across loading and every route */}
        <CursorMusicTrail />
      </ThemeProvider>
    </Router>
  );
}

export default App;
