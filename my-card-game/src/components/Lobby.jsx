import React from 'react';

function Lobby({ gameCode, playerNumber }) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(gameCode)
            .then(() => alert('Code copied!'))
            .catch(err => console.error('Error copying text: ', err));
    };

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Game Created!</h1>
            <p>Your join code is:</p>
            <div style={{ fontSize: '2rem', margin: '20px 0' }}>
                {gameCode}
            </div>
            <button onClick={copyToClipboard}>Copy Code</button>
            <p>You are Player {playerNumber}</p>
        </div>
    );
}

export default Lobby;