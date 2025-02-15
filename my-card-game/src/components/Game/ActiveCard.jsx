// ActiveCard.js
import React from 'react';
import Card from './Card';

const ActiveCard = ({ activeCards, owner, currentPlayer }) => {
    return (
        <div
            className="activeCard"
            style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}
        >
            {activeCards.map((card, index) => (
                <Card
                    key={index}
                    rank={card.rank}
                    revealed={card.revealed}
                    player={owner}
                    playerNumber={currentPlayer}
                />
            ))}
        </div>
    );
};

export default ActiveCard;
