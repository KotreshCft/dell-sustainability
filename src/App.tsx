import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Play, Pause } from 'lucide-react';
import { preloadData } from './services/dataService';
import HomePage from './pages/HomePage';
import ReducePage from './pages/ReducePage';
import ReduceCalc from './pages/ReduceCalc';
import ReusePage from './pages/ReusePage';
import ReuseCalc from './pages/ReuseCalc';
import RecyclePage from './pages/RecyclePage';
import RecycleCalc from './pages/RecycleCalc';
import RegeneratePage from './pages/RegeneratePage';
import RegenerateCalc from './pages/RegenerateCalc';
import DashboardPage from './pages/DashboardPage';
import ExtraPage from './pages/ExtraPage';

const routes = [
  { path: '/', name: 'Home', duration: 10 },
  { path: '/reduce', name: 'Reduce', duration: 10 },
  { path: '/reduce-calc', name: 'ReduceCalc', duration: 10 },
  { path: '/reuse', name: 'Reuse', duration: 10 },
  { path: '/reuse-calc', name: 'ReuseCalc', duration: 10 },
  { path: '/recycle', name: 'Recycle', duration: 10 },
  { path: '/recycle-calc', name: 'RecycleCalc', duration: 10 },
  { path: '/regenerate', name: 'Regenerate', duration: 10 },
  { path: '/regenerate-calc', name: 'RegenerateCalc', duration: 10 },
  { path: '/dashboard', name: 'Dashboard', duration: 10 }
];

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // Enable auto-play
  const [progress, setProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [showingExtra, setShowingExtra] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (showingExtra) {
            // After ExtraPage finishes, restart the normal cycle
            setShowingExtra(false);
            setCycleCount(0);
            setCurrentIndex(0);
            navigate(routes[0].path);
            return 0;
          } else {
            const nextIndex = (currentIndex + 1) % routes.length;
            
            // Check if we've completed a full cycle (back to index 0)
            if (nextIndex === 0) {
              const newCycleCount = cycleCount + 1;
              setCycleCount(newCycleCount);
              
              // After 10 cycles, show ExtraPage
              if (newCycleCount >= 3) {
                setShowingExtra(true);
                navigate('/extra');
                return 0;
              }
            }
            
            setCurrentIndex(nextIndex);
            navigate(routes[nextIndex].path);
            return 0;
          }
        }
        return prev + (showingExtra ? 0.33 : 1); // ExtraPage: 30 seconds (100/300 = 0.33), All other pages: 10 seconds (100/100 = 1)
      });
    }, 100); // Update progress every 100ms

    return () => clearInterval(interval);
  }, [currentIndex, isPlaying, navigate, location.pathname, cycleCount, showingExtra]);

  useEffect(() => {
    const currentPath = location.pathname;
    const routeIndex = routes.findIndex(route => route.path === currentPath);
    if (routeIndex !== -1) {
      setCurrentIndex(routeIndex);
      setProgress(0);
    }
  }, [location.pathname]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      setProgress(0);
    }
  };

  const goToRoute = (index: number) => {
    setCurrentIndex(index);
    navigate(routes[index].path);
    setProgress(0);
  };

  return (
    <div className="min-h-screen relative bg-[#044f52] overflow-hidden" >




      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reduce" element={<ReducePage />} />
        <Route path="/reduce-calc" element={<ReduceCalc />} />
        <Route path="/reuse" element={<ReusePage />} />
        <Route path="/reuse-calc" element={<ReuseCalc />} />
        <Route path="/recycle" element={<RecyclePage />} />
        <Route path="/recycle-calc" element={<RecycleCalc />} />
        <Route path="/regenerate" element={<RegeneratePage />} />
        <Route path="/regenerate-calc" element={<RegenerateCalc />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/extra" element={<ExtraPage />} />
      </Routes>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Preload all data when the app starts
    preloadData();
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;