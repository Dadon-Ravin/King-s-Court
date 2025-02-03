import './App.css';
import { useState, useEffect } from 'react';
import { ref, set, onValue, update, get} from 'firebase/database';
import { database } from './firebaseConfig';

const initializeGame = async () => {
  // First create base node if missing
  await set(ref(database, 'games'), { exists: true }); 

  const initialHand = ['King', 'Queen', 'Jack', 'Ace', 'Joker', 'Joker'];
  const gameData = {
    players: {
      player1: {
        name: "Player 1",
        hand: [...initialHand],
        activeCards: [],
        revealedCards: [],
        deadCards: [],
        needsToChooseActiveCards: true,
        color: "red",
        jokersDestroyedByOpponentKings: 0
      },
      player2: {
        name: "Player 2",
        hand: [...initialHand],
        activeCards: [],
        revealedCards: [],
        deadCards: [],
        needsToChooseActiveCards: true,
        color: "black",
        jokersDestroyedByOpponentKings: 0
      }
    },
    currentTurn: null,
    gameOver: false
  };

  await set(ref(database, 'games/gameId123'), gameData);
};

const getPlayerId = () => {
  const params = new URLSearchParams(window.location.search);
  const playerId = params.get("player");
  return playerId === "player1" || playerId === "player2" ? playerId : null;
};

const getCardImage = (card, playerColor) => {
  return `/images/${playerColor}/${card.toLowerCase()}_${playerColor}.svg`;
};

function ActiveCardSelector({ playerId, gameState }) {
  const [selectedCards, setSelectedCards] = useState([]);

  const handleCardClick = (card) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter(c => c !== card));
    } else if (selectedCards.length < 2) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const confirmSelection = async () => {
    try {
      const playerRef = ref(database, `games/gameId123/players/${playerId}`);
      
      // Create a new array reference to force Firebase update
      const newActiveCards = selectedCards.map(card => ({ 
        card, 
        revealed: false 
      }));
      
      await update(playerRef, {
        activeCards: newActiveCards,
        hand: gameState.players[playerId].hand.filter(c => !selectedCards.includes(c)),
        needsToChooseActiveCards: false
      });
  
      // Force refresh the game state
      const gameSnapshot = await get(ref(database, 'games/gameId123'));
      const updatedGameState = gameSnapshot.val();
      
      // Check readiness with fresh data
      const bothReady = !updatedGameState.players.player1.needsToChooseActiveCards && 
                       !updatedGameState.players.player2.needsToChooseActiveCards;
  
      if (bothReady) {
        await update(ref(database, 'games/gameId123'), {
          currentTurn: "player1",
          gameStartTime: Date.now()  // Add game start timestamp
        });
      }
      
      // Show confirmation feedback
      alert('Cards submitted! Waiting for other player...');
      
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Error submitting cards! Please try again.');
    }
  };

  return (
    <div className="overlay">
      <div className="selection-prompt">
        <h2>Choose 2 cards to place face down</h2>
        <div className="card-hand">
          {gameState.players[playerId].hand.map((card, index) => (
            <div
              key={index}
              className={`card ${selectedCards.includes(card) ? 'selected' : ''}`}
              onClick={() => handleCardClick(card)}
            >
              <img 
                src={getCardImage(card, gameState.players[playerId].color)} 
                alt={card} 
              />
            </div>
          ))}
        </div>
        <button 
          className="confirm-button"
          onClick={confirmSelection}
          disabled={selectedCards.length !== 2}
        >
          Confirm Selection ({selectedCards.length}/2)
        </button>
      </div>
    </div>
  );
}

function App() {
  const [gameState, setGameState] = useState(null);
  const playerId = getPlayerId();
  const opponentId = playerId === "player1" ? "player2" : "player1";

  const handleResetGame = async () => {
    if (window.confirm("Are you sure you want to reset the game?")) {
      await initializeGame();
    }
  };

  useEffect(() => {
    
    if (playerId) {
      const gameRef = ref(database, 'games/gameId123');
          // Check if node exists
        get(gameRef).then((snapshot) => {
          if (!snapshot.exists()) {
            initializeGame();
          }
    });
      onValue(gameRef, (snapshot) => {
        if (snapshot.exists()) {
          setGameState(snapshot.val());
        }
      });
    }
  }, [playerId]);

  if (!playerId) {
    return <h2>Join as ?player=player1 or ?player=player2</h2>;
  }

  if (!gameState) {
    return <h2>Loading game...</h2>;
  }

  // Show card selection if needed
  if (gameState.players[playerId].needsToChooseActiveCards) {
    return <ActiveCardSelector playerId={playerId} gameState={gameState} />;
  }

  return (
    <div className="App">
      <div className="header-controls">
      <h1 className="game-title">King's Court</h1>
      <button 
        className="reset-button"
        onClick={handleResetGame}
      >
        Reset Game
      </button>
    </div>

      {/* Opponent Section */}
      <div className="opponent-area">
        <div className="opponent-hand">
          <div className="card-hand">
            {gameState.players[opponentId].hand.map((_, index) => (
              <div key={index} className="card">
                <img 
                  src={getCardImage("back", gameState.players[opponentId].color)} 
                  alt="Face-down card" 
                />
              </div>
            ))}
          </div>
        </div>

        <div className="opponent-active-cards">
          <div className="card-hand">
            {gameState.players[opponentId].activeCards.map((cardObj, index) => (
              <div key={index} className="card">
                <img 
                  src={cardObj.revealed ? 
                    getCardImage(cardObj.card, gameState.players[opponentId].color) : 
                    getCardImage("back", gameState.players[opponentId].color)} 
                  alt={cardObj.revealed ? cardObj.card : "Face-down card"} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Turn Display */}
      {gameState.currentTurn && (
        <div className="turn-display">
          {gameState.currentTurn === playerId ? 
            "Your Turn" : "Opponent's Turn"}
        </div>
      )}

      {/* Player Section */}
      <div className="player-area">
        <div className="your-active-cards">
          <div className="card-hand">
            {gameState.players[playerId].activeCards.map((cardObj, index) => (
              <div key={index} className="card">
                <img 
                  src={cardObj.revealed ? 
                    getCardImage(cardObj.card, gameState.players[playerId].color) : 
                    getCardImage("back", gameState.players[playerId].color)} 
                  alt={cardObj.revealed ? cardObj.card : "Face-down card"} 
                />
              </div>
            ))}
          </div>
        </div>

        <div className="your-hand">
          <div className="card-hand">
            {gameState.players[playerId].hand.map((card, index) => (
              <div key={index} className="card">
                <img 
                  src={getCardImage(card, gameState.players[playerId].color)} 
                  alt={card} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;