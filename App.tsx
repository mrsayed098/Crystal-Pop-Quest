
import React, { useState, useEffect } from 'react';
import { GameState, LevelConfig, CrystalColor } from './types';
import { INITIAL_LEVELS, DEFAULT_ACTIVE_COLORS } from './constants/gameConstants';
import { Logo } from './components/Logo';
import { SplashScreen } from './components/Screens/SplashScreen';
import { MainMenu } from './components/Screens/MainMenu';
import { LevelSelect } from './components/Screens/LevelSelect';
import { GameScreen } from './components/Screens/GameScreen';
import { CrystalCollection } from './components/Screens/CrystalCollection';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.SPLASH);
  const [levels, setLevels] = useState<LevelConfig[]>(INITIAL_LEVELS);
  const [currentLevel, setCurrentLevel] = useState<LevelConfig | null>(null);
  const [activeColors, setActiveColors] = useState<CrystalColor[]>(DEFAULT_ACTIVE_COLORS);

  useEffect(() => {
    if (gameState === GameState.SPLASH) {
      const timer = setTimeout(() => setGameState(GameState.MENU), 2500);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const handleLevelSelect = (level: LevelConfig) => {
    setCurrentLevel(level);
    setGameState(GameState.PLAYING);
  };

  const handleToggleColor = (color: CrystalColor) => {
    setActiveColors(prev => {
      if (prev.includes(color)) {
        if (prev.length <= 4) return prev; // Minimum 4 colors
        return prev.filter(c => c !== color);
      }
      return [...prev, color];
    });
  };

  const handleLevelComplete = (score: number, moves: number) => {
    if (!currentLevel) return;

    const stars = score >= currentLevel.targetScore * 1.5 ? 3 : score >= currentLevel.targetScore * 1.2 ? 2 : 1;
    
    setLevels(prev => prev.map(lvl => {
      if (lvl.id === currentLevel.id) {
        return { ...lvl, stars: Math.max(lvl.stars, stars) };
      }
      if (lvl.id === currentLevel.id + 1) {
        return { ...lvl, unlocked: true };
      }
      return lvl;
    }));

    setGameState(GameState.LEVEL_COMPLETE);
  };

  const handleGameOver = () => {
    setGameState(GameState.GAME_OVER);
  };

  return (
    <div className="w-full h-full text-white bg-[#0c0a1a] flex flex-col items-center justify-center overflow-hidden">
      {gameState === GameState.SPLASH && <SplashScreen />}
      
      {gameState === GameState.MENU && (
        <MainMenu 
          onPlay={() => setGameState(GameState.LEVEL_SELECT)} 
          onCollection={() => setGameState(GameState.COLLECTION)}
          onExit={() => alert("Exiting game...")} 
        />
      )}

      {gameState === GameState.COLLECTION && (
        <CrystalCollection 
          activeColors={activeColors} 
          onToggleColor={handleToggleColor} 
          onBack={() => setGameState(GameState.MENU)} 
        />
      )}

      {gameState === GameState.LEVEL_SELECT && (
        <LevelSelect 
          levels={levels} 
          onSelect={handleLevelSelect} 
          onBack={() => setGameState(GameState.MENU)} 
        />
      )}

      {gameState === GameState.PLAYING && currentLevel && (
        <GameScreen 
          level={currentLevel} 
          activeColors={activeColors}
          onComplete={handleLevelComplete} 
          onGameOver={handleGameOver}
          onQuit={() => setGameState(GameState.LEVEL_SELECT)}
        />
      )}

      {(gameState === GameState.LEVEL_COMPLETE || gameState === GameState.GAME_OVER) && currentLevel && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-morphism p-8 rounded-3xl text-center max-w-sm w-full mx-4 border-2 border-cyan-500/30">
            <h2 className={`text-4xl font-fantasy font-bold mb-4 ${gameState === GameState.LEVEL_COMPLETE ? 'text-yellow-400' : 'text-rose-500'}`}>
              {gameState === GameState.LEVEL_COMPLETE ? 'SUCCESS!' : 'FAILED!'}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {gameState === GameState.LEVEL_COMPLETE 
                ? 'Level Cleared! You found the hidden energy!' 
                : 'Out of moves! The energy dissipated...'}
            </p>
            <div className="space-y-4">
              {gameState === GameState.LEVEL_COMPLETE && (
                <button 
                  onClick={() => setGameState(GameState.LEVEL_SELECT)}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-bold text-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  NEXT LEVEL
                </button>
              )}
              <button 
                onClick={() => setGameState(GameState.PLAYING)}
                className="w-full py-4 bg-white/10 rounded-xl font-bold text-xl border border-white/20 hover:bg-white/20 transition-all"
              >
                TRY AGAIN
              </button>
              <button 
                onClick={() => setGameState(GameState.LEVEL_SELECT)}
                className="w-full py-4 text-emerald-300 font-bold hover:underline"
              >
                BACK TO MAP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
