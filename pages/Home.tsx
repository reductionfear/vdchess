import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, BarChart2, Play, Lock, Clock, ChevronRight, Edit3 } from 'lucide-react';
import Layout from '../components/Layout';
import { Difficulty } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [showModeSelect, setShowModeSelect] = useState(false);
  const [customFen, setCustomFen] = useState('');

  const startTraining = (difficulty: Difficulty) => {
    navigate('/trainer', { 
        state: { 
            settings: { 
                mode: 'CLASSIC', 
                difficulty, 
                memorizeTime: difficulty === Difficulty.EASY ? 10 : difficulty === Difficulty.MEDIUM ? 15 : 30 
            } 
        } 
    });
  };

  const startCustomTraining = () => {
    if (!customFen.trim()) return;
    navigate('/trainer', {
        state: {
            settings: {
                mode: 'CLASSIC',
                difficulty: Difficulty.HARD, // Defaults to Hard for custom
                memorizeTime: 30,
                fen: customFen.trim()
            }
        }
    });
  };

  return (
    <Layout>
      <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto animate-fade-in-up">
          <Crown className="h-16 w-16 text-amber-400 mx-auto mb-6 drop-shadow-lg" />
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight mb-4">
            VIDIT<span className="text-amber-400">CHESS</span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-400 font-light mb-12">
            Master Blindfold Chess. Train your visual memory like a GM.
          </p>

          {!showModeSelect ? (
            <div className="space-y-6 w-full max-w-md mx-auto">
               {/* Track Progress CTA */}
               <div className="p-1 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-800 shadow-2xl">
                  <div className="bg-slate-900 rounded-xl p-8 border border-slate-700/50">
                    <Lock className="h-8 w-8 text-amber-400 mx-auto mb-3" />
                    <h3 className="text-white font-bold text-lg mb-2">Track Your Progress</h3>
                    <p className="text-slate-400 text-sm mb-6">Sign up to save sessions, track accuracy, and maintain streaks.</p>
                    <button 
                        onClick={() => navigate('/auth')}
                        className="w-full py-3 px-6 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-lg transition-all transform hover:-translate-y-0.5"
                    >
                        Create Free Account
                    </button>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setShowModeSelect(true)}
                    className="group relative overflow-hidden p-6 bg-slate-800 border border-amber-500/30 hover:border-amber-400 rounded-xl transition-all text-left"
                  >
                    <div className="absolute inset-0 bg-amber-400/5 group-hover:bg-amber-400/10 transition-colors"></div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">Begin Training</h3>
                    <p className="text-xs text-slate-400">Try it now, no account needed</p>
                  </button>
                  
                  <button 
                    onClick={() => navigate('/auth')}
                    className="p-6 bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl transition-all text-left"
                  >
                    <BarChart2 className="h-6 w-6 text-slate-500 mb-2" />
                    <h3 className="text-lg font-bold text-slate-300">Dashboard</h3>
                    <p className="text-xs text-slate-500">Requires sign in</p>
                  </button>
               </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl animate-fade-in">
                 <div className="flex items-center justify-center mb-8">
                    <button onClick={() => setShowModeSelect(false)} className="text-slate-500 hover:text-white text-sm flex items-center">
                        &larr; Back
                    </button>
                    <h2 className="text-3xl font-bold text-white ml-4">Select Training Mode</h2>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Classic Mode */}
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-amber-500/50 transition-all">
                        <div className="flex items-center mb-4">
                            <div className="bg-amber-500 w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                                <Crown className="text-slate-900 h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Classic Mode</h3>
                                <p className="text-slate-400 text-sm">Fixed difficulty levels</p>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <button onClick={() => startTraining(Difficulty.EASY)} className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg flex justify-between items-center group">
                                <span>Easy <span className="text-slate-500 text-xs ml-2">(4-6 Pieces)</span></span>
                                <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-white" />
                            </button>
                            <button onClick={() => startTraining(Difficulty.MEDIUM)} className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg flex justify-between items-center group">
                                <span>Medium <span className="text-slate-500 text-xs ml-2">(7-10 Pieces)</span></span>
                                <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-white" />
                            </button>
                            <button onClick={() => startTraining(Difficulty.HARD)} className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg flex justify-between items-center group">
                                <span>Hard <span className="text-slate-500 text-xs ml-2">(11+ Pieces)</span></span>
                                <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Custom Mode */}
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col">
                         <div className="flex items-center mb-4">
                            <div className="bg-indigo-500 w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                                <Edit3 className="text-white h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Custom Position</h3>
                                <p className="text-slate-400 text-sm">Load any FEN string</p>
                            </div>
                        </div>
                        <div className="flex-grow flex flex-col gap-4">
                            <textarea 
                                value={customFen}
                                onChange={(e) => setCustomFen(e.target.value)}
                                placeholder="Paste FEN here (e.g., rnbqk...)"
                                className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder:text-slate-600 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <button 
                                onClick={startCustomTraining}
                                disabled={!customFen}
                                className={`w-full py-3 font-bold rounded-lg transition-colors ${customFen ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                            >
                                Load Position
                            </button>
                        </div>
                    </div>
                 </div>
            </div>
          )}

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-t border-slate-800 pt-8 w-full max-w-4xl mx-auto">
             <div>
                <Crown className="h-6 w-6 text-amber-400 mx-auto mb-2" />
                <h4 className="text-white font-semibold">Classic Mode</h4>
                <p className="text-slate-500 text-sm">Choose difficulty and practice</p>
             </div>
             <div>
                <Edit3 className="h-6 w-6 text-amber-400 mx-auto mb-2" />
                <h4 className="text-white font-semibold">Custom Position</h4>
                <p className="text-slate-500 text-sm">Train specific openings or endgames</p>
             </div>
             <div>
                <BarChart2 className="h-6 w-6 text-amber-400 mx-auto mb-2" />
                <h4 className="text-white font-semibold">Track Progress</h4>
                <p className="text-slate-500 text-sm">Monitor your improvement</p>
             </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Home;