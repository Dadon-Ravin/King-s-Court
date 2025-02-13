import React from 'react';

function Card({ color, rank, revealed }) {
    // Determine if the card should be face-up based on whether it's the player's card or if it's revealed
    const shouldFaceUp = isPlayerCard || revealed;

    // Determine the image path based on whether the card is face-up or face-down
    const imagePath = shouldFaceUp
        ? `/images/${color}/${rank}.svg`  // Show face-up card
        : `/images/${color}/back.svg`;    // Show color-specific back

    return (
        <img
            src={imagePath}
            alt={shouldFaceUp ? `${rank} of ${color}` : 'Card back'}
            onError={(e) => console.error('Image failed to load:', imagePath, e)}
            style={{ width: '80px', height: '120px', margin: '5px' }}
        />
    );
}

export default Card;

