// src/App.jsx
import { useState, useEffect } from 'react';
import { GameService } from './firebase/gameService';
import { ActiveCardSelector } from './components/game/ActiveCardSelector';
import { PlayerArea } from './components/game/PlayerArea';
import { TurnManager } from './components/game/TurnManager';
import { Card } from './components/ui/Card';
import './App.css';

const getPlayerId = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('player') === 'player1' ? 'player1' : 'player2';
};

function App() {
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);
  const playerId = getPlayerId();
  const opponentId = playerId === 'player1' ? 'player2' : 'player1';

  // Firebase subscription setup
  useEffect(() => {
    let unsubscribe;

    const initializeGameState = async () => {
      try {
        // Check if game exists, initialize if not
        const snapshot = await GameService.getGameSnapshot();
        if (!snapshot.exists()) {
          await GameService.initializeGame();
        }

        // Set up real-time listener
        unsubscribe = GameService.subscribeToGame((snapshot) => {
          setGameState(snapshot);
          setLoading(false);
        });
      } catch (error) {
        console.error('Game initialization failed:', error);
        setLoading(false);
      }
    };

    if (playerId) {
      initializeGameState();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [playerId]);

  const handleResetGame = async () => {
    if (window.confirm('Reset game for all players?')) {
      try {
        await GameService.initializeGame();
      } catch (error) {
        console.error('Reset failed:', error);
      }
    }
  };

  if (!playerId) {
    return (
      <div className="error-container">
        <h2 >Invalid player ID</h2>
        <p>Join using ?player=player1 or ?player=player2</p>
      </div>
    );
  }

  if (loading || !gameState) {
    return <div className="loading">Loading game state...</div>;
  }

  const currentPlayer = gameState.players[playerId];
  const opponent = gameState.players[opponentId];

  return (
    <div className="app-container">
      <header className="game-header">
        <h1>King's Court</h1>
        <button className="reset-button" onClick={handleResetGame}>
          Reset Game
        </button>
      </header>

      {currentPlayer.needsToChooseActiveCards ? (
        <ActiveCardSelector
          playerId={playerId}
          gameState={gameState}
        />
      ) : (
        <main className="game-board">
          {/* Opponent's Area */}
          <PlayerArea
            player={opponent}
            isOpponent={true}
            playerId={opponentId}
          />

          {/* Turn Display */}
          {gameState.currentTurn && (
            <div className="turn-display">
              {gameState.currentTurn === playerId 
                ? "Your Turn" 
                : "Opponent's Turn"}
            </div>
          )}

          {/* Current Player's Area */}
          <PlayerArea
            player={currentPlayer}
            isOpponent={false}
            playerId={playerId}
          />

          {/* Turn Management */}
          {gameState.currentTurn === playerId && (
            <TurnManager
              gameState={gameState}
              playerId={playerId}
              opponentId={opponentId}
            />
          )}
        </main>
      )}
    </div>
  );
}

export default App;