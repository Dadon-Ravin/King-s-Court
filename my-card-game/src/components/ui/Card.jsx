// src/components/ui/Card.jsx
export const Card = ({ 
    card, 
    isRevealed, 
    isSelected, 
    playerColor, 
    onClick 
  }) => {
    const image = isRevealed 
      ? `/images/${playerColor}/${card.type}_${playerColor}.svg`
      : `/images/${playerColor}/back_${playerColor}.svg`;
  
    return (
      <div 
        className={`card ${isSelected ? 'selected' : ''}`} 
        onClick={onClick}
      >
        <img src={image} alt={isRevealed ? card.type : 'Face-down card'} />
      </div>
    );
  };