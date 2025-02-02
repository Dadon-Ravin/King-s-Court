import './App.css'; 
import { useState, useEffect } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { database } from './firebaseConfig';

const initializeGame = async () => {
  const initialHand = ['King', 'Queen', 'Jack', 'Ace', 'Joker', 'Joker'];
  const gameData = {
    players: {
      player1: {
        name: "Player 1",
        hand: [...initialHand],
        activeCards: ["?", "?"], // Player will select these later
        revealedCards: [],
        color: "red"
      },
      player2: {
        name: "Player 2",
        hand: [...initialHand],
        activeCards: ["?", "?"], // Player will select these later
        revealedCards: [],
        color: "black"
      }
    },
    currentTurn: "player1",
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

function App() {
  const [gameState, setGameState] = useState(null);
  const playerId = getPlayerId();
  const opponentId = playerId === "player1" ? "player2" : "player1";

  console.log("Player ID:", playerId); // Debugging

  useEffect(() => {
    if (playerId) {
      const gameRef = ref(database, 'games/gameId123');
      onValue(gameRef, (snapshot) => {
        if (snapshot.exists()) {
          const gameStateData = snapshot.val();  // Change variable name to 'gameStateData'
          console.log("Game State Data:", gameStateData); // Log the correct data
          setGameState(gameStateData); // Update the state with the fetched data
        }
      });
    }
  }, [playerId]);

  if (!playerId) {
    return <h2>Please join as "player1" or "player2" using the URL (?player=player1)</h2>;
  }

  if (!gameState) {
    return <h2>Loading game...</h2>;
  }

return (
  <div className="App">
    <h1 className="game-title">King's Court</h1>

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
        {gameState.players[opponentId].activeCards.map((card, index) => (
          <div key={index} className="card">
            <img 
              src={card === "?" ? getCardImage("back", gameState.players[opponentId].color) : getCardImage(card, gameState.players[opponentId].color)} 
              alt={card === "?" ? "Face-down card" : card} 
            />
          </div>
        ))}
      </div>
    </div>

    <div className="your-active-cards">
      <div className="card-hand">
        {gameState.players[playerId].activeCards.map((card, index) => (
          <div key={index} className="card">
            <img 
              src={card === "?" ? getCardImage("back", gameState.players[playerId].color) : getCardImage(card, gameState.players[playerId].color)} 
              alt={card === "?" ? "Face-down card" : card} 
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
);
}
export default App;
