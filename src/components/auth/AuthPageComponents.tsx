import React from 'react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

interface AuthWrapperProps {
  onToggleAuth: () => void;
}

export const Login: React.FC<AuthWrapperProps> = ({ onToggleAuth }) => {
  return (
    <LoginModal 
      isOpen={true} 
      onClose={() => {}} // No-op since this is embedded in page, not a modal
      onToggleToSignup={onToggleAuth} 
    />
  );
};

export const Signup: React.FC<AuthWrapperProps> = ({ onToggleAuth }) => {
  return (
    <SignupModal 
      isOpen={true} 
      onClose={() => {}} // No-op since this is embedded in page, not a modal
      onToggleToLogin={onToggleAuth} 
    />
  );
}; 