import React from 'react';

function ActionControls({ selectedCard, targetCard, onAction }) {
    return (
        <div className="action-controls">
            <button
                onClick={() => onAction('swap', selectedCard)}
                disabled={!selectedCard}
            >
                Swap
            </button>
            <button
                onClick={() => onAction('king', selectedCard, targetCard)}
                disabled={!selectedCard || !targetCard}
            >
                King Attack
            </button>
            <button
                onClick={() => onAction('jack', selectedCard)}
                disabled={!selectedCard}
            >
                Jack Reveal
            </button>
            <button
                onClick={() => onAction('queen', selectedCard)}
                disabled={!selectedCard}
            >
                Queen Unreveal
            </button>
        </div>
    );
}

export default ActionControls;