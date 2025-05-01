import { Link } from 'react-router-dom';
import PageTransition from '../components/ui/PageTransition';

const NotFound = () => {
  return (
    <PageTransition type="fade">
      <div className="container py-20">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-9xl font-heading font-bold text-primary mb-4">404</h1>
          
          <h2 className="text-3xl font-heading font-bold text-neutral-800 mb-6">Page Not Found</h2>
          
          <p className="text-neutral-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn btn-primary px-6 py-3"
            >
              Back to Home
            </Link>
            
            <Link
              to="/products"
              className="btn bg-white text-primary border border-primary hover:bg-neutral-50 px-6 py-3"
            >
              Browse Products
            </Link>
          </div>
          
          <div className="mt-12">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              className="h-24 w-24 mx-auto text-neutral-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound; 