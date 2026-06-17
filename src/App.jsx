import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Suspense, lazy, useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MiniPlayer from './components/MiniPlayer';
import ScrollToTop from './components/ScrollToTop';
import CursorMusicTrail from './components/CursorMusicTrail';
import { AudioPlayerProvider } from './hooks/useAudioPlayer';
import { ThemeProvider } from './hooks/useTheme';
import './App.css';

const Landing = lazy(() => import('./pages/Landing/Landing'));
const Music = lazy(() => import('./pages/Music/Music'));
const Timeline = lazy(() => import('./pages/Timeline/Timeline'));
const ProjectDetail = lazy(() => import('./pages/Project/ProjectDetail'));

function RouteLoadingFallback() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
      <div className="flex items-center gap-3 text-walnut/70 dark:text-cream/70" role="status" aria-live="polite">
        <span className="h-3 w-3 rounded-full bg-gold animate-pulse" />
        <span className="font-mono text-xs tracking-[0.28em] uppercase">Loading side</span>
      </div>
    </main>
  );
}

function LazyRoute({ children }) {
  return <Suspense fallback={<RouteLoadingFallback />}>{children}</Suspense>;
}

// Inner component lives below <Router> so it can call useLocation. Keying
// AnimatePresence's child Routes by location.pathname is what lets
// framer-motion run each page's exit before the next page's enter.
function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <LazyRoute>
              <Landing />
            </LazyRoute>
          }
        />
        <Route
          path="/music"
          element={
            <LazyRoute>
              <Music />
            </LazyRoute>
          }
        />
        <Route
          path="/timeline"
          element={
            <LazyRoute>
              <Timeline />
            </LazyRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <LazyRoute>
              <ProjectDetail />
            </LazyRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function shouldShowInitialLoading() {
  if (typeof window === 'undefined') return true;
  const navigationEntry = window.performance?.getEntriesByType?.('navigation')?.[0];
  if (!navigationEntry) return true;
  return navigationEntry.type === 'navigate' || navigationEntry.type === 'prerender';
}

function App() {
  const [isLoading, setIsLoading] = useState(shouldShowInitialLoading);
  const [showContent, setShowContent] = useState(() => !shouldShowInitialLoading());

  const handleLoadingComplete = () => {
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
