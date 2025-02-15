import React from 'react';

function ResponseControls({ currentAction, onResponse }) {
    return (
        <div className="response-controls">
            <button onClick={() => onResponse('allow')}>
                Allow Action
            </button>
            <button onClick={() => onResponse('bluff')}>
                Call Bluff
            </button>
            {currentAction?.type === 'king' && (
                <button onClick={() => onResponse('ace')}>
                    Claim Ace
                </button>
            )}
        </div>
    );
}

export default ResponseControls;