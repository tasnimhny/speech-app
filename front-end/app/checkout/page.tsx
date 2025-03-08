"use client";
import { useState } from "react";

export default function Checkout() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const basePrice = 20;
  const taxRate = 0.08; // 8% tax
  const tax = basePrice * taxRate;
  const total = basePrice + tax;

  return (
    <main className="py-12 px-4 flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl w-full bg-gray-800 p-8 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Payment Form */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Checkout</h2>
          
          <label className="block text-sm text-gray-400">Full Name</label>
          <input 
            type="text" 
            className="w-full p-2 rounded-md bg-gray-700 text-white mb-4"
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />

          <label className="block text-sm text-gray-400">Email</label>
          <input 
            type="email" 
            className="w-full p-2 rounded-md bg-gray-700 text-white mb-4"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />

          <label className="block text-sm text-gray-400">Card Number</label>
          <input 
            type="text" 
            className="w-full p-2 rounded-md bg-gray-700 text-white mb-4"
            value={cardNumber} 
            onChange={(e) => setCardNumber(e.target.value)} 
            placeholder="1234 5678 9012 3456"
            required 
          />

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm text-gray-400">Expiry Date</label>
              <input 
                type="text" 
                className="w-full p-2 rounded-md bg-gray-700 text-white"
                value={expiry} 
                onChange={(e) => setExpiry(e.target.value)} 
                placeholder="MM/YY"
                required 
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm text-gray-400">CVV</label>
              <input 
                type="text" 
                className="w-full p-2 rounded-md bg-gray-700 text-white"
                value={cvv} 
                onChange={(e) => setCvv(e.target.value)} 
                placeholder="123"
                required 
              />
            </div>
          </div>

          <button className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Complete Payment
          </button>
        </div>

        {/* Summary Section */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          <div className="flex justify-between text-gray-300">
            <span>Pro Plan (1 Month)</span>
            <span>$20.00</span>
          </div>
          <div className="flex justify-between text-gray-400 mt-2">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <hr className="my-4 border-gray-600" />
          <div className="flex justify-between text-xl font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
