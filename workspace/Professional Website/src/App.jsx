import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing/Landing';
import Music from './pages/Music/Music';
import Coding from './pages/Coding/Coding';
import Timeline from './pages/Timeline/Timeline';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if user has already seen the loading screen in this session
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
          <div className="app">
            <Navbar />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/music" element={<Music />} />
                <Route path="/code" element={<Coding />} />
                <Route path="/timeline" element={<Timeline />} />
              </Routes>
            </AnimatePresence>
            <Footer />
          </div>
        </Router>
      )}
    </>
  );
}

export default App;
