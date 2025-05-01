import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleToSignup?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onToggleToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Close modal with ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      onClose();
      navigate('/');
    } catch (err: any) {
      if (err?.message) {
        setError(err.message);
      } else {
        setError('Invalid email or password. Please try again.');
      }
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FiX size={24} />
        </CloseButton>
        
        <form className="form_container" onSubmit={handleSubmit}>
          <div className="title_container">
            <LogoText><GreenText>Freshly</GreenText> <YellowText>Basket</YellowText></LogoText>
          </div>
          
          <div className="title_container">
            <p className="title">Login to your Account</p>
            <span className="subtitle">Get started with our app, just create an account and enjoy the experience.</span>
          </div>
          
          {error && (
            <ErrorMessage>{error}</ErrorMessage>
          )}
          
          <div className="input_container">
            <label className="input_label" htmlFor="email_field">Email</label>
            <svg fill="none" viewBox="0 0 24 24" height={24} width={24} xmlns="http://www.w3.org/2000/svg" className="icon">
              <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" stroke="#0F5132" d="M7 8.5L9.94202 10.2394C11.6572 11.2535 12.3428 11.2535 14.058 10.2394L17 8.5" />
              <path strokeLinejoin="round" strokeWidth="1.5" stroke="#0F5132" d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z" />
            </svg>
            <input 
              placeholder="name@mail.com" 
              title="Email Address" 
              type="email" 
              className="input_field" 
              id="email_field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input_container">
            <label className="input_label" htmlFor="password_field">Password</label>
            <svg fill="none" viewBox="0 0 24 24" height={24} width={24} xmlns="http://www.w3.org/2000/svg" className="icon">
              <path strokeLinecap="round" strokeWidth="1.5" stroke="#0F5132" d="M18 11.0041C17.4166 9.91704 16.273 9.15775 14.9519 9.0993C13.477 9.03404 11.9788 9 10.329 9C8.67911 9 7.18091 9.03404 5.70604 9.0993C3.95328 9.17685 2.51295 10.4881 2.27882 12.1618C2.12602 13.2541 2 14.3734 2 15.5134C2 16.6534 2.12602 17.7727 2.27882 18.865C2.51295 20.5387 3.95328 21.8499 5.70604 21.9275C6.42013 21.9591 7.26041 21.9834 8 22" />
              <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" stroke="#0F5132" d="M6 9V6.5C6 4.01472 8.01472 2 10.5 2C12.9853 2 15 4.01472 15 6.5V9" />
              <path fill="#0F5132" d="M21.2046 15.1045L20.6242 15.6956V15.6956L21.2046 15.1045ZM21.4196 16.4767C21.7461 16.7972 22.2706 16.7924 22.5911 16.466C22.9116 16.1395 22.9068 15.615 22.5804 15.2945L21.4196 16.4767ZM18.0228 15.1045L17.4424 14.5134V14.5134L18.0228 15.1045ZM18.2379 18.0387C18.5643 18.3593 19.0888 18.3545 19.4094 18.028C19.7299 17.7016 19.7251 17.1771 19.3987 16.8565L18.2379 18.0387ZM14.2603 20.7619C13.7039 21.3082 12.7957 21.3082 12.2394 20.7619L11.0786 21.9441C12.2794 23.1232 14.2202 23.1232 15.4211 21.9441L14.2603 20.7619ZM12.2394 20.7619C11.6914 20.2239 11.6914 19.358 12.2394 18.82L11.0786 17.6378C9.86927 18.8252 9.86927 20.7567 11.0786 21.9441L12.2394 20.7619ZM12.2394 18.82C12.7957 18.2737 13.7039 18.2737 14.2603 18.82L15.4211 17.6378C14.2202 16.4587 12.2794 16.4587 11.0786 17.6378L12.2394 18.82ZM14.2603 18.82C14.8082 19.358 14.8082 20.2239 14.2603 20.7619L15.4211 21.9441C16.6304 20.7567 16.6304 18.8252 15.4211 17.6378L14.2603 18.82ZM20.6242 15.6956L21.4196 16.4767L22.5804 15.2945L21.785 14.5134L20.6242 15.6956ZM15.4211 18.82L17.8078 16.4767L16.647 15.2944L14.2603 17.6377L15.4211 18.82ZM17.8078 16.4767L18.6032 15.6956L17.4424 14.5134L16.647 15.2945L17.8078 16.4767ZM16.647 16.4767L18.2379 18.0387L19.3987 16.8565L17.8078 15.2945L16.647 16.4767ZM21.785 14.5134C21.4266 14.1616 21.0998 13.8383 20.7993 13.6131C20.4791 13.3732 20.096 13.1716 19.6137 13.1716V14.8284C19.6145 14.8284 19.619 14.8273 19.6395 14.8357C19.6663 14.8466 19.7183 14.8735 19.806 14.9391C19.9969 15.0822 20.2326 15.3112 20.6242 15.6956L21.785 14.5134ZM18.6032 15.6956C18.9948 15.3112 19.2305 15.0822 19.4215 14.9391C19.5091 14.8735 19.5611 14.8466 19.5879 14.8357C19.6084 14.8273 19.6129 14.8284 19.6137 14.8284V13.1716C19.1314 13.1716 18.7483 13.3732 18.4281 13.6131C18.1276 13.8383 17.8008 14.1616 17.4424 14.5134L18.6032 15.6956Z" />
            </svg>
            <input 
              placeholder="Password" 
              title="Password" 
              type="password" 
              className="input_field" 
              id="password_field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button title="Sign In" type="submit" className="sign-in_btn" disabled={isLoading}>
            <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
          </button>
          
          <div className="separator">
            <hr className="line" />
            <span>Or</span>
            <hr className="line" />
          </div>
          
          <button type="button" className="sign-in_ggl">
            <svg height={18} width={18} viewBox="0 0 32 32" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" id="A" />
              </defs>
              <clipPath id="B">
              </clipPath>
              <g transform="matrix(.727273 0 0 .727273 -.954545 -1.45455)">
                <path fill="#fbbc05" clipPath="url(#B)" d="M0 37V11l17 13z" />
                <path fill="#ea4335" clipPath="url(#B)" d="M0 11l17 13 7-6.1L48 14V0H0z" />
                <path fill="#34a853" clipPath="url(#B)" d="M0 37l30-23 7.9 1L48 0v48H0z" />
                <path fill="#4285f4" clipPath="url(#B)" d="M48 48L17 24l-4-3 35-10z" />
              </g>
            </svg>
            <span>Sign In with Google</span>
          </button>
          
          <div className="signup-link">
            Don't have an account?{" "}
            <SignupButton onClick={onToggleToSignup}>
              Sign up
            </SignupButton>
          </div>
          
          <p className="note">Terms of use &amp; Conditions</p>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 81, 50, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  font-family: 'Poppins', sans-serif;
`;

const ModalContainer = styled.div`
  position: relative;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-width: 90%;
  width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
  animation: slideIn 0.3s ease-out forwards;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .form_container {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }

  .logo_container {
    box-sizing: border-box;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, rgba(15, 81, 50, 0.05) 50%, rgba(15, 81, 50, 0.1) 100%);
    border: 1px solid rgba(15, 81, 50, 0.1);
    filter: drop-shadow(0px 0.5px 0.5px rgba(10, 59, 36, 0.1)) 
            drop-shadow(0px 1px 0.5px rgba(10, 59, 36, 0.1));
    border-radius: 11px;
  }

  .title_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #0F5132;
    font-family: 'Montserrat', sans-serif;
  }

  .subtitle {
    font-size: 0.725rem;
    max-width: 80%;
    text-align: center;
    line-height: 1.1rem;
    color: #616161;
  }

  .input_container {
    width: 100%;
    height: fit-content;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .icon {
    width: 20px;
    position: absolute;
    z-index: 99;
    left: 12px;
    bottom: 9px;
  }

  .input_label {
    font-size: 0.75rem;
    color: #616161;
    font-weight: 600;
  }

  .input_field {
    width: auto;
    height: 40px;
    padding: 0 0 0 40px;
    border-radius: 7px;
    outline: none;
    border: 1px solid #E0E0E0;
    filter: drop-shadow(0px 1px 0px #F5F5F5)
      drop-shadow(0px 1px 0.5px rgba(15, 81, 50, 0.05));
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
  }

  .input_field:focus {
    border: 1px solid transparent;
    box-shadow: 0px 0px 0px 2px rgba(15, 81, 50, 0.3);
    background-color: transparent;
  }

  .sign-in_btn {
    width: 100%;
    height: 40px;
    border: 0;
    background: #0F5132;
    border-radius: 7px;
    outline: none;
    color: #ffffff;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    font-family: 'Poppins', sans-serif;
  }

  .sign-in_btn:hover {
    background: #0A3B24;
  }

  .sign-in_btn:disabled {
    background: #1A7D4E;
    cursor: not-allowed;
  }

  .sign-in_ggl {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: #ffffff;
    border-radius: 7px;
    outline: none;
    color: #424242;
    border: 1px solid #E0E0E0;
    filter: drop-shadow(0px 1px 0px #F5F5F5)
      drop-shadow(0px 1px 0.5px rgba(15, 81, 50, 0.05));
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
  }

  .sign-in_ggl:hover {
    background: #F5F5F5;
    border-color: #BDBDBD;
  }

  .separator {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    color: #9E9E9E;
  }

  .separator .line {
    display: block;
    width: 100%;
    height: 1px;
    border: 0;
    background-color: #E0E0E0;
  }

  .note {
    font-size: 0.75rem;
    color: #757575;
    text-decoration: underline;
    cursor: pointer;
    margin-top: 5px;
  }
  
  .signup-link {
    font-size: 0.85rem;
    color: #616161;
    margin: 5px 0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #757575;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: #F5F5F5;
    color: #0F5132;
  }
`;

const LogoText = styled.span`
  font-weight: 700;
  font-size: 1.3rem;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const GreenText = styled.span`
  color: #0F5132;
`;

const YellowText = styled.span`
  color: #E6B118;
`;

const ErrorMessage = styled.div`
  width: 100%;
  padding: 10px;
  background-color: #FAECC3;
  color: #E6B118;
  border-radius: 7px;
  font-size: 0.85rem;
  text-align: center;
  border: 1px solid rgba(230, 177, 24, 0.3);
`;

const SignupButton = styled.button`
  background: transparent;
  border: none;
  color: #0F5132;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  
  &:hover {
    color: #0A3B24;
  }
`;

export default LoginModal; 