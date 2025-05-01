import React, { useEffect } from 'react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

interface AuthWrapperProps {
  onToggleAuth: () => void;
}

// This wrapper is needed to fix form submission in the embedded auth components
const fixFormSubmission = () => {
  useEffect(() => {
    // When components mount, find all forms and add a safeguard
    const forms = document.querySelectorAll('form');
    
    const preventDefaultSubmit = (e: Event) => {
      // Let the actual handlers in the components work, but prevent browser submission
      if (!e.defaultPrevented) {
        console.log('Preventing default form submission');
        e.preventDefault();
      }
    };
    
    // Add listeners
    forms.forEach(form => {
      form.addEventListener('submit', preventDefaultSubmit, true);
    });
    
    // Cleanup
    return () => {
      forms.forEach(form => {
        form.removeEventListener('submit', preventDefaultSubmit, true);
      });
    };
  }, []);
};

export const Login: React.FC<AuthWrapperProps> = ({ onToggleAuth }) => {
  // Add the form submission fix
  fixFormSubmission();
  
  return (
    <LoginModal 
      isOpen={true} 
      onClose={() => {}} // No-op since this is embedded in page, not a modal
      onToggleToSignup={onToggleAuth} 
    />
  );
};

export const Signup: React.FC<AuthWrapperProps> = ({ onToggleAuth }) => {
  // Add the form submission fix
  fixFormSubmission();
  
  return (
    <SignupModal 
      isOpen={true} 
      onClose={() => {}} // No-op since this is embedded in page, not a modal
      onToggleToLogin={onToggleAuth} 
    />
  );
}; 