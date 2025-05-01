import React, { createContext, useContext, useState } from 'react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

interface AuthModalsContextType {
  openLogin: () => void;
  openSignup: () => void;
  closeModals: () => void;
  isLoginOpen: boolean;
  isSignupOpen: boolean;
}

const AuthModalsContext = createContext<AuthModalsContextType | undefined>(undefined);

export const useAuthModals = () => {
  const context = useContext(AuthModalsContext);
  if (!context) {
    throw new Error('useAuthModals must be used within AuthModalsProvider');
  }
  return context;
};

export const AuthModalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const openLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const openSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const closeModals = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
  };

  return (
    <AuthModalsContext.Provider
      value={{
        openLogin,
        openSignup,
        closeModals,
        isLoginOpen,
        isSignupOpen
      }}
    >
      {children}
      
      {/* Render the modals */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={closeModals} 
        onToggleToSignup={openSignup} 
      />
      
      <SignupModal 
        isOpen={isSignupOpen} 
        onClose={closeModals} 
        onToggleToLogin={openLogin} 
      />
    </AuthModalsContext.Provider>
  );
};

export default AuthModalsProvider; 