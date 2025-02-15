import React from 'react';
import Card from './Card';

const Hand = ({ handData, owner, currentPlayer }) => {
    return (
        <div
            className="hand"
            style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}
        >
            {handData.map((card, index) => (
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

export default Hand;