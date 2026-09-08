import React, { useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { AuthModal } from './pages/AuthModal';
import { HomePage } from './pages/HomePage';
import { BranchPage } from './pages/BranchPage';
import { ClubsPage } from './pages/ClubsPage';
import { DoubtChatPage } from './pages/DoubtChatPage';
import { AIChatbotPage } from './pages/AIChatbotPage';
import { PlacementPage } from './pages/PlacementPage';
import { ScholarshipsPage } from './pages/ScholarshipsPage';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem('skillbridge_theme') === 'dark');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const validTabs = ['home', 'branch', 'clubs', 'doubts', 'ai-chatbot', 'placement', 'scholarships'];
  const navigateTo = (tab: string) => setActiveTab(validTabs.includes(tab) ? tab : 'home');

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    localStorage.setItem('skillbridge_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = React.useCallback((title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  return (
    <div className={`app-container ${darkMode ? 'theme-dark' : ''}`}>
      {/* Background ambient glowing orbs */}
      <div className="ambient-glow">
        <div className="glow-orb-1" />
        <div className="glow-orb-2" />
        <div className="glow-orb-3" />
      </div>

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={navigateTo}
        openAuthModal={() => setIsAuthModalOpen(true)}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(prev => !prev)}
      />

      {/* Main Routed Page Content */}
      <main className="main-content">
        {activeTab === 'home' && (
          <HomePage
            setActiveTab={navigateTo}
            openAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'branch' && (
          <BranchPage onToast={addToast} />
        )}

        {activeTab === 'clubs' && (
          <ClubsPage onToast={addToast} />
        )}

        {activeTab === 'doubts' && (
          <DoubtChatPage onToast={addToast} />
        )}

        {activeTab === 'ai-chatbot' && (
          <AIChatbotPage />
        )}

        {activeTab === 'placement' && (
          <PlacementPage />
        )}

        {activeTab === 'scholarships' && (
          <ScholarshipsPage />
        )}
      </main>

      {/* Universal Footer */}
      <Footer setActiveTab={navigateTo} />

      {/* Universal Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessToast={(msg) => addToast('Authentication Successful', msg, 'success')}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
