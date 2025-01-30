import { useState, useEffect } from 'react';
import './App.css';
import { ref, set, get } from 'firebase/database';
import { database } from './firebaseConfig';

function App() {
  const [gameState, setGameState] = useState({
    players: [],
    currentPlayer: 0,
    gameOver: false,
  });
  const [playerId, setPlayerId] = useState(null); // Add state for player selection
  const [isSelectingPlayer, setIsSelectingPlayer] = useState(true); // Add state for handling player selection

  // Fetch the game state when the component first renders
  useEffect(() => {
    fetchGameState();
  }, []);

  // Function to create a new game if it doesn't exist
  const createGame = () => {
    const initialHand = ['King', 'Queen', 'Jack', 'Ace', 'Joker', 'Joker'];
    set(ref(database, 'games/gameId123'), {
      players: {
        player1: {
          name: 'Player 1',
          color: 'red',
          hand: [...initialHand],
        },
        player2: {
          name: 'Player 2',
          color: 'black',
          hand: [...initialHand],
        },
      },
      currentPlayer: 'player1',
      gameOver: false,
    }).then(() => {
      fetchGameState();  // Fetch the game state after it's created
    });
  };

  // Fetch the game state from Firebase
  const fetchGameState = async () => {
    const gameRef = ref(database, 'games/gameId123');
    const snapshot = await get(gameRef);
    if (snapshot.exists()) {
      const gameData = snapshot.val();
      setGameState(gameData);
    } else {
      createGame();  // If no game exists, create a new one
    }
  };

  // Handle the End Game button
  const endGame = () => {
    set(ref(database, 'games/gameId123/gameOver'), true).then(() => {
      fetchGameState();  // Fetch the updated game state
    });
  };

  // Handle the Restart Game button
  const startGame = () => {
    createGame();  // Create a new game from scratch
  };

  // Get images for the cards
  const getCardImage = (card, playerColor) => {
    const imagePath = `/images/${card.toLowerCase()}_${playerColor}.svg`;  // Dynamic path using card and player color
    return imagePath;  // Return the correct image path for the card
  };

  // Handle the player selection
  const handlePlayerSelect = (player) => {
    setPlayerId(player);
    setIsSelectingPlayer(false);
  };

  if (isSelectingPlayer) {
    return (
      <div className="player-selection">
        <h2>Select Your Player</h2>
        <button onClick={() => handlePlayerSelect('player1')}>Play as Player 1 (Red)</button>
        <button onClick={() => handlePlayerSelect('player2')}>Play as Player 2 (Black)</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>King's Court - The Card Game</h1>
      {gameState.gameOver ? (
        <div>
          <h2>Game Over!</h2>
          <button onClick={startGame}>Restart Game</button>
        </div>
      ) : (
        <div>
          <h2>Game is On!</h2>
          {/* Player-Specific View */}
          <div className="player-view">
            <h3>{gameState.players[playerId]?.name}'s Hand</h3>
            <div className="card-hand">
              {gameState.players[playerId]?.hand.map((card, index) => (
                <div key={index} className="card">
                  <img src={getCardImage(card, gameState.players[playerId].color)} alt={card} />
                </div>
              ))}
            </div>
          </div>
          <button onClick={endGame}>End Game</button>
        </div>
      )}
    </div>
  );
}

export default App;