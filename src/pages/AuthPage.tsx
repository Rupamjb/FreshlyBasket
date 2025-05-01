import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import PageTransition from '../components/ui/PageTransition';
import { motion } from 'framer-motion';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <PageTransition type="fade">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 py-8 px-4 sm:px-6">
        <div className="w-full max-w-md">
          {/* Card with shadow effect */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all">
            {/* Auth header */}
            <div className="bg-primary text-white p-6">
              <h1 className="text-2xl sm:text-3xl font-heading text-center">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-center mt-2 text-primary-50">
                {isLogin ? 'Sign in to continue to Freshly' : 'Join Freshly today'}
              </p>
            </div>
            
            <div className="p-6">
              {/* Tab switcher */}
              <div className="flex mb-8 border border-neutral-200 rounded-lg overflow-hidden">
                <button 
                  className={`flex-1 py-3 px-4 font-medium text-center transition-colors ${
                    isLogin 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-neutral-600 hover:bg-neutral-50'
                  }`}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
                <button 
                  className={`flex-1 py-3 px-4 font-medium text-center transition-colors ${
                    !isLogin 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-neutral-600 hover:bg-neutral-50'
                  }`}
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </button>
              </div>
              
              {/* Auth form */}
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                {isLogin ? (
                  <Login onToggleAuth={toggleAuthMode} />
                ) : (
                  <Signup onToggleAuth={toggleAuthMode} />
                )}
              </motion.div>
              
              {/* Back to shop */}
              <div className="mt-6 text-center border-t border-neutral-200 pt-6">
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center text-primary hover:underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Shopping
                </button>
              </div>
            </div>
          </div>
          
          {/* Brand footer */}
          <div className="mt-8 text-center text-neutral-500 text-sm">
            <p>© {new Date().getFullYear()} Freshly. All rights reserved.</p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AuthPage; 