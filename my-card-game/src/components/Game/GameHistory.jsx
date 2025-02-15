import React from 'react';

function GameHistory({ history }) {
    const formatAction = (action) => {
        switch (action.type) {
            case 'swap':
                return `Player ${action.player} swapped their active card ${action.activeCard}`;
            case 'king':
                return `Player ${action.player} attacked with King at active${action.activeCard}`;
            case 'jack':
                return `Player ${action.player} used Jack to reveal a card`;
            case 'queen':
                return `Player ${action.player} used Queen to unreveal cards`;
            default:
                return 'Unknown action';
        }
    };

    return (
        <div className="game-history">
            <h3>Game History</h3>
            <div className="history-list">
                {history.map((action, index) => (
                    <div key={index} className="history-entry">
                        {formatAction(action)}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GameHistory; 