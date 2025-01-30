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
          hand: [...initialHand],
        },
        player2: {
          name: 'Player 2',
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
  const getCardImage = (card) => {
    const [cardType, cardColor] = card.split('_');  // e.g., ['King', 'red']
    return `/images/${cardType}_${cardColor}.svg`.toLowerCase();  // Return the path to the image
  };

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
          <div className="card-hand">
            {gameState.players[gameState.currentPlayer]?.hand.map((card, index) => (
              <div key={index} className="card">
                <img src={getCardImage(card)} alt={card} />  {/* Display the card image */}
              </div>
            ))}
          </div>
          <button onClick={endGame}>End Game</button>
        </div>
      )}
    </div>
  );
}

export default App;