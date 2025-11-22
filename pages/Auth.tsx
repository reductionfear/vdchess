import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Crown } from 'lucide-react';
import Layout from '../components/Layout';

// Simple icon components for social auth
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const AppleIcon = () => (
  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.48C2.7 15.25 3.66 7.75 9.75 7.5c1.3.05 2.3.82 2.89.82.5 0 1.8-.89 3.2-.82 1.25.06 2.3.62 2.95 1.55-2.6 1.55-2.17 5.15.39 6.24-.65 1.73-1.56 3.45-2.13 4.99zM13.03 5.5c.6-2.56 2.9-3.95 3.46-3.95.04 2.5-2.55 4.56-3.46 3.95z" />
  </svg>
);

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        
        <div className="w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
           {/* Header */}
           <div className="bg-slate-900 p-6 text-center border-b border-slate-700">
              <Crown className="h-10 w-10 text-amber-400 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {isLogin ? 'Sign in to continue training' : 'Join ViditChess to track your mastery'}
              </p>
           </div>

           {/* Body */}
           <div className="p-8">
              
              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button className="flex items-center justify-center px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors">
                  <GoogleIcon />
                </button>
                <button className="flex items-center justify-center px-4 py-2 border border-slate-600 rounded-lg bg-black hover:bg-gray-900 transition-colors text-white">
                  <AppleIcon />
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800 text-slate-500">Or continue with</span>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
                    <input 
                      type="email" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                      placeholder="name@example.com" 
                    />
                  </div>
                </div>
                
                <div>
                   <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                   <input 
                      type="password" 
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-4 text-white focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                      placeholder="••••••••" 
                   />
                </div>

                <button className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-3 rounded-lg transition-colors shadow-lg hover:shadow-amber-400/20">
                   {isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center text-sm">
                <span className="text-slate-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button 
                    onClick={() => setIsLogin(!isLogin)} 
                    className="text-amber-400 hover:text-amber-300 font-medium"
                >
                    {isLogin ? 'Sign Up' : 'Log In'}
                </button>
              </div>

           </div>
        </div>

      </div>
    </Layout>
  );
};

export default Auth;