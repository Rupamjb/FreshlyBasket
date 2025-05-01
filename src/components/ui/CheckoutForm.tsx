import { useState } from 'react';
import { OrderAddress, BillingAddress } from '../../services/orderService';

interface CheckoutFormProps {
  onSubmit: (data: {
    shippingAddress: OrderAddress;
    billingAddress: BillingAddress;
    paymentMethod: string;
    notes?: string;
  }) => void;
  isLoading: boolean;
}

const CheckoutForm = ({ onSubmit, isLoading }: CheckoutFormProps) => {
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [notes, setNotes] = useState('');
  // Shipping address fields
  const [shippingAddress, setShippingAddress] = useState<OrderAddress>({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    country: 'IN' // Default to India
  });

  // Billing address fields
  const [billingAddress, setBillingAddress] = useState<OrderAddress>({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    country: 'IN' // Add default country for billing address
  });

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBillingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      shippingAddress,
      billingAddress: {
        ...billingAddress,
        sameAsShipping: sameAsBilling
      },
      paymentMethod,
      notes: notes.trim() || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Shipping Address Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="shipping-firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              id="shipping-firstName"
              name="firstName"
              type="text"
              required
              value={shippingAddress.firstName}
              onChange={handleShippingChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="shipping-lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              id="shipping-lastName"
              name="lastName"
              type="text"
              required
              value={shippingAddress.lastName}
              onChange={handleShippingChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="shipping-address1" className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 1 *
            </label>
            <input
              id="shipping-address1"
              name="address1"
              type="text"
              required
              value={shippingAddress.address1}
              onChange={handleShippingChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="shipping-address2" className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 2
            </label>
            <input
              id="shipping-address2"
              name="address2"
              type="text"
              value={shippingAddress.address2}
              onChange={handleShippingChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="shipping-city" className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              id="shipping-city"
              name="city"
              type="text"
              required
              value={shippingAddress.city}
              onChange={handleShippingChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="shipping-state" className="block text-sm font-medium text-gray-700 mb-1">
              State/Province *
            </label>
            <input
              id="shipping-state"
              name="state"
              type="text"
              required
              value={shippingAddress.state}
              onChange={handleShippingChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="shipping-postalCode" className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code *
            </label>
            <input
              id="shipping-postalCode"
              name="postalCode"
              type="text"
              required
              value={shippingAddress.postalCode}
              onChange={handleShippingChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="shipping-phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              id="shipping-phone"
              name="phone"
              type="tel"
              required
              value={shippingAddress.phone}
              onChange={handleShippingChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Billing Address Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold">Billing Address</h2>
          <div className="ml-auto">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sameAsBilling}
                onChange={(e) => setSameAsBilling(e.target.checked)}
                className="form-checkbox h-5 w-5 text-primary"
              />
              <span className="ml-2 text-sm">Same as shipping address</span>
            </label>
          </div>
        </div>

        {!sameAsBilling && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="billing-firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                id="billing-firstName"
                name="firstName"
                type="text"
                required={!sameAsBilling}
                value={billingAddress.firstName}
                onChange={handleBillingChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="billing-lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                id="billing-lastName"
                name="lastName"
                type="text"
                required={!sameAsBilling}
                value={billingAddress.lastName}
                onChange={handleBillingChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="billing-address1" className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1 *
              </label>
              <input
                id="billing-address1"
                name="address1"
                type="text"
                required={!sameAsBilling}
                value={billingAddress.address1}
                onChange={handleBillingChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="billing-address2" className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2
              </label>
              <input
                id="billing-address2"
                name="address2"
                type="text"
                value={billingAddress.address2}
                onChange={handleBillingChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="billing-city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                id="billing-city"
                name="city"
                type="text"
                required={!sameAsBilling}
                value={billingAddress.city}
                onChange={handleBillingChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="billing-state" className="block text-sm font-medium text-gray-700 mb-1">
                State/Province *
              </label>
              <input
                id="billing-state"
                name="state"
                type="text"
                required={!sameAsBilling}
                value={billingAddress.state}
                onChange={handleBillingChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="billing-postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code *
              </label>
              <input
                id="billing-postalCode"
                name="postalCode"
                type="text"
                required={!sameAsBilling}
                value={billingAddress.postalCode}
                onChange={handleBillingChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="billing-phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                id="billing-phone"
                name="phone"
                type="tel"
                required={!sameAsBilling}
                value={billingAddress.phone}
                onChange={handleBillingChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* Payment Method Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:border-primary">
            <input
              type="radio"
              name="paymentMethod"
              value="credit_card"
              checked={paymentMethod === 'credit_card'}
              onChange={() => setPaymentMethod('credit_card')}
              className="form-radio h-5 w-5 text-primary"
            />
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Credit Card
            </span>
          </label>
          
          <label className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:border-primary">
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              checked={paymentMethod === 'upi'}
              onChange={() => setPaymentMethod('upi')}
              className="form-radio h-5 w-5 text-primary"
            />
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              UPI
            </span>
          </label>
          
          <label className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:border-primary">
            <input
              type="radio"
              name="paymentMethod"
              value="cash_on_delivery"
              checked={paymentMethod === 'cash_on_delivery'}
              onChange={() => setPaymentMethod('cash_on_delivery')}
              className="form-radio h-5 w-5 text-primary"
            />
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              Cash on Delivery
            </span>
          </label>
        </div>
      </div>

      {/* Order Notes */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Order Notes (Optional)</h2>
        <textarea
          id="order-notes"
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special instructions for your order..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-3 bg-[#0F5132] text-white rounded-md font-medium hover:bg-[#0D4328] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm; 