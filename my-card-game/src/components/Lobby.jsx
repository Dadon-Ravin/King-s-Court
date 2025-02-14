import { useState, useEffect } from 'react';
import SignOut from './SignOut';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import SelectActive from './Game/SelectActive';

function Lobby({ gameCode, playerNumber }) {
    const [bothPlayersJoined, setBothPlayersJoined] = useState(false);

    useEffect(() => {
        const gameRef = ref(db, `games/${gameCode}`);

        //Listen for changes in the game state
        const unsubscribe = onValue(gameRef, (snapshot) => {
            const gameData = snapshot.val();

            if (gameData.players.player1 && gameData.players.player2) {
                setBothPlayersJoined(true);
            }
        });

        return () => unsubscribe();
    }, [gameCode]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(gameCode)
            .then(() => alert('Code copied!'))
            .catch(err => console.error('Error copying text: ', err));
    };

    if (bothPlayersJoined) {
        return <SelectActive playerNumber={playerNumber} gameCode={gameCode} />;
    }

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <SignOut></SignOut>
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