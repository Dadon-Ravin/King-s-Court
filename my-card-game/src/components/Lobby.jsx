import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

function Lobby({ gameCode, currentUserUID }) {
    const [gameData, setGameData] = useState(null);
    const [copyStatus, setCopyStatus] = useState('');

    useEffect(() => {
        // Set up a listener for changes to the game node in the database.
        const gameRef = ref(db, `games/${gameCode}`);
        const unsubscribe = onValue(gameRef, (snapshot) => {
            setGameData(snapshot.val());
        });
        return () => unsubscribe();
    }, [gameCode]);

    // Copy game code to clipboard using the Clipboard API.
    const copyCode = () => {
        navigator.clipboard
            .writeText(gameCode)
            .then(() => setCopyStatus('Copied!'))
            .catch(() => setCopyStatus('Failed to copy.'));
    };

    // Determine the player's number based on the game data.
    let playerNumber = null;
    if (gameData && gameData.players) {
        Object.keys(gameData.players).forEach((key) => {
            if (gameData.players[key].id === currentUserUID) {
                playerNumber = key === 'player1' ? 1 : 2;
            }
        });
    }

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Game Lobby</h1>
            <div style={{ marginBottom: '20px' }}>
                <p>Your game code:</p>
                <div style={{ fontSize: '2rem', margin: '20px 0' }}>{gameCode}</div>
                <button onClick={copyCode}>Copy Code</button>
                {copyStatus && <p>{copyStatus}</p>}
            </div>
            {playerNumber ? (
                <p>Game created, you are Player {playerNumber}</p>
            ) : (
                <p>Waiting for player assignment...</p>
            )}
        </div>
    );
}

export default Lobby;
