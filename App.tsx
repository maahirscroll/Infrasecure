import React, { useState, useCallback, useEffect } from 'react';
import { auth } from './services/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import LoginScreen from './components/LoginScreen';
import ManholeSelector from './components/ManholeSelector';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedManholeId, setSelectedManholeId] = useState<string | null>(null);
  const [selectedManholeName, setSelectedManholeName] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthLoading(false);
      if (!user) {
        setSelectedManholeId(null);
        setSelectedManholeName(null);
      }
    });
    return () => unsubscribe();
  }, []);


  const handleSelectManhole = useCallback((manholeId: string, name: string) => {
    setSelectedManholeId(manholeId);
    setSelectedManholeName(name);
  }, []);

  const handleLogout = useCallback(() => {
    auth.signOut();
  }, []);

  const handleBackToSelector = useCallback(() => {
    setSelectedManholeId(null);
    setSelectedManholeName(null);
  }, []);
  
  if (authLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-cyan-400 text-xl">
            Authenticating...
        </div>
    );
  }

  const renderContent = () => {
    if (!authUser) {
        return <LoginScreen />;
    }
    if (selectedManholeId) {
        return <Dashboard manholeId={selectedManholeId} manholeName={selectedManholeName || selectedManholeId} onBack={handleBackToSelector} onLogout={handleLogout} />;
    }
    return <ManholeSelector onSelectManhole={handleSelectManhole} onLogout={handleLogout} />;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 antialiased">
      {renderContent()}
    </div>
  );
};

export default App;
