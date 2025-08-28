import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Play, Pause } from 'lucide-react';
import { preloadData } from './services/dataService';
import HomePage from './pages/HomePage';
import ReducePage from './pages/ReducePage';
import ReusePage from './pages/ReusePage';
import RecyclePage from './pages/RecyclePage';
import RegeneratePage from './pages/RegeneratePage';
import DashboardPage from './pages/DashboardPage';

const routes = [
  { path: '/', name: 'Home' },
  { path: '/reduce', name: 'Reduce' },
  { path: '/reuse', name: 'Reuse' },
  { path: '/recycle', name: 'Recycle' },
  { path: '/regenerate', name: 'Regenerate' },
  { path: '/dashboard', name: 'Dashboard' }
];

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // Enable auto-play
  const [progress, setProgress] = useState(0);

  // useEffect(() => {
  //   if (!isPlaying) return;

  //   // Stop auto-navigation when on Reduce page

  //   const interval = setInterval(() => {
  //     setProgress((prev) => {
  //       if (prev >= 100) {
  //         const nextIndex = (currentIndex + 1) % routes.length;
  //         setCurrentIndex(nextIndex);
  //         navigate(routes[nextIndex].path);
  //         return 0;
  //       }
  //       return prev + 0.5; // Progress: 200ms * 200 = 20 seconds per page
  //     });
  //   }, 100); // Update progress every 100ms for smoother animation, 20 second cycles

  //   return () => clearInterval(interval);
  // }, [currentIndex, isPlaying, navigate, location.pathname]);

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
    <div className="min-h-screen relative">




      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reduce" element={<ReducePage />} />
        <Route path="/reuse" element={<ReusePage />} />
        <Route path="/recycle" element={<RecyclePage />} />
        <Route path="/regenerate" element={<RegeneratePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
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