import React, { useState } from 'react';
import { Check, CreditCard, Smartphone, Bitcoin, Shield } from 'lucide-react';
import Layout from '../components/Layout';

const Pricing: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'crypto'>('card');

  return (
    <Layout>
      <div className="py-12 px-4 max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
           <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
           <p className="text-xl text-slate-400">Unlock full access to the Progressive Mode, unlimited history, and advanced analytics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Free Tier */}
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2">Rookie</h3>
                <div className="text-4xl font-black text-white mb-6">$0 <span className="text-lg font-normal text-slate-500">/ mo</span></div>
                <ul className="space-y-4 mb-8 flex-grow">
                    {['Classic Mode (Easy)', 'Daily Limit: 5 Puzzles', 'Basic Accuracy Stats'].map((feat) => (
                        <li key={feat} className="flex items-center text-slate-300">
                            <Check className="h-5 w-5 text-emerald-400 mr-3" />
                            {feat}
                        </li>
                    ))}
                </ul>
                <button className="w-full py-3 border border-slate-600 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors">
                    Current Plan
                </button>
            </div>

            {/* Pro Tier */}
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-8 border border-amber-400/50 relative shadow-2xl shadow-amber-400/10 flex flex-col transform scale-105 z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Grandmaster</h3>
                <div className="text-4xl font-black text-white mb-6">$9 <span className="text-lg font-normal text-slate-500">/ mo</span></div>
                <ul className="space-y-4 mb-8 flex-grow">
                    {['Unlimited Puzzles', 'Access to Progressive Mode', 'Detailed Error Analysis', 'Cloud Save & Sync', 'Priority Support'].map((feat) => (
                        <li key={feat} className="flex items-center text-slate-300">
                            <Check className="h-5 w-5 text-amber-400 mr-3" />
                            {feat}
                        </li>
                    ))}
                </ul>
                <button className="w-full py-3 bg-amber-400 text-slate-900 rounded-xl font-bold hover:bg-amber-500 transition-colors shadow-lg">
                    Upgrade Now
                </button>
            </div>

            {/* Lifetime */}
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2">Lifetime</h3>
                <div className="text-4xl font-black text-white mb-6">$99 <span className="text-lg font-normal text-slate-500">/ once</span></div>
                <ul className="space-y-4 mb-8 flex-grow">
                    {['One-time payment', 'All Pro features forever', 'Early access to new modes', 'Supporter Badge'].map((feat) => (
                        <li key={feat} className="flex items-center text-slate-300">
                            <Check className="h-5 w-5 text-emerald-400 mr-3" />
                            {feat}
                        </li>
                    ))}
                </ul>
                <button className="w-full py-3 border border-slate-600 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors">
                    Get Lifetime Access
                </button>
            </div>

        </div>

        {/* Checkout Demo Section */}
        <div className="mt-24 max-w-3xl mx-auto bg-slate-800 rounded-2xl p-8 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Shield className="text-emerald-400" /> Secure Checkout Demo
            </h3>
            
            {/* Payment Tabs */}
            <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg mb-6">
                <button 
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors ${paymentMethod === 'card' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                    <CreditCard size={16} /> Card / Stripe
                </button>
                <button 
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors ${paymentMethod === 'upi' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                    <Smartphone size={16} /> UPI
                </button>
                <button 
                    onClick={() => setPaymentMethod('crypto')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors ${paymentMethod === 'crypto' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                    <Bitcoin size={16} /> Crypto
                </button>
            </div>

            {/* Payment Content */}
            <div className="min-h-[200px]">
                {paymentMethod === 'card' && (
                    <form className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Card Number" className="col-span-2 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white w-full outline-none focus:border-amber-400" />
                            <input type="text" placeholder="MM / YY" className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white w-full outline-none focus:border-amber-400" />
                            <input type="text" placeholder="CVC" className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white w-full outline-none focus:border-amber-400" />
                        </div>
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg mt-4">
                            Pay with Stripe
                        </button>
                    </form>
                )}

                {paymentMethod === 'upi' && (
                    <div className="text-center space-y-4 animate-fade-in">
                        <div className="bg-white p-4 rounded-lg inline-block mx-auto">
                            {/* Fake QR */}
                            <div className="w-32 h-32 bg-slate-200 flex items-center justify-center text-slate-400 text-xs">
                                QR CODE
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm">Scan with GPay, PhonePe, or Paytm</p>
                        <div className="flex items-center justify-center gap-2 text-white bg-slate-900 p-3 rounded-lg border border-slate-700 max-w-xs mx-auto">
                            <span>viditchess@okaxis</span>
                            <button className="text-amber-400 text-xs font-bold hover:underline">COPY</button>
                        </div>
                    </div>
                )}

                {paymentMethod === 'crypto' && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-1 gap-3">
                            <button className="flex items-center justify-between bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-amber-400 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">B</div>
                                    <span className="text-white">Bitcoin</span>
                                </div>
                                <span className="text-slate-500 group-hover:text-amber-400">&rarr;</span>
                            </button>
                            <button className="flex items-center justify-between bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-blue-400 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">E</div>
                                    <span className="text-white">Ethereum</span>
                                </div>
                                <span className="text-slate-500 group-hover:text-blue-400">&rarr;</span>
                            </button>
                             <button className="flex items-center justify-between bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-green-400 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">T</div>
                                    <span className="text-white">USDT (TRC20)</span>
                                </div>
                                <span className="text-slate-500 group-hover:text-green-400">&rarr;</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

        </div>

      </div>
    </Layout>
  );
};

export default Pricing;