// src/components/game/ActiveCardSelector.jsx
import { Card } from '../ui/Card';

export const ActiveCardSelector = ({ playerId, gameState }) => {
  const [selectedIndexes, setSelectedIndexes] = useState([]);

  const handleCardClick = (index) => {
    const newSelection = selectedIndexes.includes(index)
      ? selectedIndexes.filter(i => i !== index)
      : [...selectedIndexes, index];
      
    if (newSelection.length <= 2) {
      setSelectedIndexes(newSelection);
    }
  };

  const confirmSelection = async () => {
    const selectedCards = selectedIndexes.map(
      i => gameState.players[playerId].hand[i]
    );
    
    try {
      await GameService.submitCardSelection(playerId, selectedCards);
    } catch (error) {
      // Handle error in UI
    }
  };

  return (
    
    <div className="start-selection">
      <div className="card-grid">   
        {gameState.players[playerId].hand.map((card, index) => (
          <Card
            key={index}
            card={{ type: card }}
            isRevealed={true}
            isSelected={selectedIndexes.includes(index)}
            playerColor={gameState.players[playerId].color}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
      <button 
        className="confirm-button"
        disabled={selectedIndexes.length !== 2}
      >
        Confirm ({selectedIndexes.length}/2)
      </button>
    </div>
  );
};