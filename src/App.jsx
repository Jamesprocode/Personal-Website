import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Suspense, lazy, useEffect, useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MiniPlayer from './components/MiniPlayer';
import ScrollToTop from './components/ScrollToTop';
import CursorMusicTrail from './components/CursorMusicTrail';
import MotionDebugProbe from './performance/MotionDebugProbe';
import { isMotionEffectDisabled } from './performance/motionDebug';
import { AudioPlayerProvider } from './hooks/useAudioPlayer';
import { ThemeProvider } from './hooks/useTheme';
import './App.css';

const routeImports = {
  landing: () => import('./pages/Landing/Landing'),
  music: () => import('./pages/Music/Music'),
  timeline: () => import('./pages/Timeline/Timeline'),
  project: () => import('./pages/Project/ProjectDetail'),
};

const Landing = lazy(routeImports.landing);
const Music = lazy(routeImports.music);
const Timeline = lazy(routeImports.timeline);
const ProjectDetail = lazy(routeImports.project);

function preloadRoute(pathname) {
  if (pathname.startsWith('/music')) return routeImports.music();
  if (pathname.startsWith('/timeline')) return routeImports.timeline();
  if (pathname.startsWith('/projects/')) return routeImports.project();
  return routeImports.landing();
}

function LazyRoute({ children, showRouteFallback }) {
  return <Suspense fallback={showRouteFallback ? <RouteLoadingFallback /> : null}>{children}</Suspense>;
}

function RouteLoadingFallback() {
  return (
    <div className="route-loading-fallback" role="status" aria-label="Loading page">
      <div className="route-loading-card">
        <span className="route-loading-reel" aria-hidden="true" />
        <span>Changing sides…</span>
      </div>
    </div>
  );
}

// Inner component lives below <Router> so it can call useLocation. Keying
// Routes by location.pathname lets framer-motion animate route changes while
// keeping the next route mounted quickly enough to avoid blank transition gaps.
function AppRoutes({ showRouteFallback = true }) {
  const location = useLocation();
  return (
    <AnimatePresence initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <LazyRoute showRouteFallback={showRouteFallback}>
              <Landing />
            </LazyRoute>
          }
        />
        <Route
          path="/music"
          element={
            <LazyRoute showRouteFallback={showRouteFallback}>
              <Music />
            </LazyRoute>
          }
        />
        <Route
          path="/timeline"
          element={
            <LazyRoute showRouteFallback={showRouteFallback}>
              <Timeline />
            </LazyRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <LazyRoute showRouteFallback={showRouteFallback}>
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
  const [shouldLoadInitially] = useState(shouldShowInitialLoading);
  const [isLoading, setIsLoading] = useState(shouldLoadInitially);
  const [initialRouteReady, setInitialRouteReady] = useState(!shouldLoadInitially);
  const showContent = !shouldLoadInitially || initialRouteReady;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let isMounted = true;

    preloadRoute(window.location.pathname)
      .catch(() => {})
      .finally(() => {
        if (isMounted) setInitialRouteReady(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <Router>
      <ScrollToTop />
      <ThemeProvider>
        <MotionDebugProbe />
        {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}

        {showContent && (
          <AudioPlayerProvider>
            <div className="app">
              <Navbar />
              <AppRoutes showRouteFallback={!isLoading} />
              <Footer />
              <MiniPlayer />
            </div>
          </AudioPlayerProvider>
        )}
        {/* Cursor music trail follows the user across loading and every route */}
        {!isMotionEffectDisabled('cursor') && <CursorMusicTrail />}
      </ThemeProvider>
    </Router>
  );
}

export default App;
