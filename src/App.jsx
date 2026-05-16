import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MiniPlayer from './components/MiniPlayer';
import Landing from './pages/Landing/Landing';
import Music from './pages/Music/Music';
import Timeline from './pages/Timeline/Timeline';
import ProjectDetail from './pages/Project/ProjectDetail';
import { AudioPlayerProvider } from './hooks/useAudioPlayer';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const hasSeenLoading = sessionStorage.getItem('hasSeenLoading');
    if (hasSeenLoading) {
      setIsLoading(false);
      setShowContent(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem('hasSeenLoading', 'true');
    setIsLoading(false);
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}

      {showContent && (
        <Router>
          <AudioPlayerProvider>
            <div className="app">
              <Navbar />
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/music" element={<Music />} />
                  <Route path="/timeline" element={<Timeline />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                </Routes>
              </AnimatePresence>
              <Footer />
              <MiniPlayer />
            </div>
          </AudioPlayerProvider>
        </Router>
      )}
    </>
  );
}

export default App;
