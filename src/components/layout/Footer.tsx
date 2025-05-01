import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-white pt-12 pb-6">
      <div className="container">
        {/* Footer top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Company */}
          <div>
            <h3 className="text-xl font-heading font-semibold mb-4">Freshly Basket</h3>
            <p className="text-neutral-300 mb-4">
              Your premium online store for fresh vegetables, groceries, and daily amenities delivered right to your doorstep.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-neutral-300 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-neutral-300 hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/terms" className="text-neutral-300 hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-neutral-300 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/faq" className="text-neutral-300 hover:text-primary transition-colors">FAQs</Link></li>
              <li><Link to="/shipping" className="text-neutral-300 hover:text-primary transition-colors">Shipping & Returns</Link></li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/products/vegetables" className="text-neutral-300 hover:text-primary transition-colors">Fresh Vegetables</Link></li>
              <li><Link to="/products/fruits" className="text-neutral-300 hover:text-primary transition-colors">Fruits</Link></li>
              <li><Link to="/products/dairy" className="text-neutral-300 hover:text-primary transition-colors">Dairy Products</Link></li>
              <li><Link to="/products/groceries" className="text-neutral-300 hover:text-primary transition-colors">Groceries</Link></li>
              <li><Link to="/products/bakery" className="text-neutral-300 hover:text-primary transition-colors">Bakery Items</Link></li>
              <li><Link to="/products/beverages" className="text-neutral-300 hover:text-primary transition-colors">Beverages</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-neutral-300">123 Fresh Street, Grocery Lane, Vegetable City, 12345</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-neutral-300">+1 (123) 456-7890</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-neutral-300">support@freshly.com</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-neutral-300">Mon - Fri: 8AM - 10PM<br />Sat - Sun: 9AM - 8PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="border-t border-neutral-700 pt-8 pb-6">
          <div className="flex flex-wrap justify-center gap-4">
            <img src="/payment-visa.png" alt="Visa" className="h-8" />
            <img src="/payment-mastercard.png" alt="Mastercard" className="h-8" />
            <img src="/payment-amex.png" alt="American Express" className="h-8" />
            <img src="/payment-paypal.png" alt="PayPal" className="h-8" />
            <img src="/payment-applepay.png" alt="Apple Pay" className="h-8" />
            <img src="/payment-googlepay.png" alt="Google Pay" className="h-8" />
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-neutral-700 pt-6 text-center">
          <p className="text-neutral-400 text-sm">
            © {new Date().getFullYear()} Freshly. All rights reserved. Premium e-commerce for fresh groceries.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 