import { useState } from 'react'
import './App.css'
import { set } from 'firebase/database'

function App() {
  const [gameState, setGameState] = useState({
    players: [
      { name: 'Player 1', hand: ['King', 'Queen', 'Jack', 'Ace', 'Joker'], color: 'red' },
      { name: 'Player 2', hand: ['King', 'Queen', 'Jack', 'Ace', 'Joker'], color: 'black' },
    ],
    currentPlayer: 0,
    gameOver: false,
  });

  const getCardImage = (card, playerColor) => {    
    // Determine the folder path based on player color
    const colorPrefix = playerColor === 'red' ? 'red' : 'black';
    
    // Return the path to the card image based on the color
    return `/images/${colorPrefix}/${card.toLowerCase()}_${colorPrefix}.svg`;
  };
  
  const startGame = () => {
    const cardHand = ['King', 'Queen', 'Jack', 'Ace', 'Joker', 'Joker']
        setGameState({
      players: [
        { name: 'Player 1', hand: [...cardHand], color: 'red'},
        { name: 'Player 2', hand: [...cardHand], color: 'black'},
      ],
      currentPlayer: 0,
      gameOver: false,
    })
  };

  const endGame = () => {
    setGameState({
      ...gameState,
      gameOver: true,
    })
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
          <div className="card-hand">
            {gameState.players[gameState.currentPlayer].hand.map((card, index) => (
              <img 
                key={index} 
                src={getCardImage(card, gameState.players[gameState.currentPlayer].color)} 
                alt={card} 
                className="card" 
              />
            ))}
          </div>
          <button onClick={endGame}>End Game</button>
        </div>
      )}
    </div>
  );
}

export default App
