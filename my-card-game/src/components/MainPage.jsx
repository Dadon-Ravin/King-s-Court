import React, { useState } from 'react';
import { db } from '../firebase';
import { ref, set, update, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import SignOut from './SignOut';

function MainPage() {
    const [gameCode, setGameCode] = useState('');
    const [joinCode, setJoinCode] = useState('');

    // Function to generate a 6-character code
    const generateGameCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    // Create Game handler
    const handleCreateGame = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.error('User not authenticated');
            return;
        }

        const code = generateGameCode();
        setGameCode(code);

        const player1hand = [
            { rank: 'ace', revealed: false },
            { rank: 'king', revealed: false },
            { rank: 'queen', revealed: false },
            { rank: 'jack', revealed: false },
            { rank: 'joker1', revealed: false },
            { rank: 'joker2', revealed: false },
        ];

        // Set initial game state in Firebase with player1 as the creator
        await set(ref(db, 'games/' + code), {
            players: {
                player1: {
                    id: user.uid,
                    hand: player1hand,
                },
            },
            currentTurn: "player1",
            createdAt: Date.now(),
        });

        console.log('Game created with code:', code, 'Player 1 UID:', user.uid);
    };

    const handleJoinGame = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.error('User not authenticated');
            return;
        }

        if (!joinCode) {
            console.error('No game code entered');
            return;
        }

        const gameRef = ref(db, `games/${joinCode}`);

        try {
            const snapshot = await get(gameRef);
            if (snapshot.exists()) {
                const gameData = snapshot.val();

                // Check if player2 already exists
                if (gameData.players?.player2) {
                    console.error('Game already has two players');
                    return;
                }

                // Add user as player2
                const player2hand = [
                    { rank: 'ace', revealed: false },
                    { rank: 'king', revealed: false },
                    { rank: 'queen', revealed: false },
                    { rank: 'jack', revealed: false },
                    { rank: 'joker1', revealed: false },
                    { rank: 'joker2', revealed: false },
                ];



                await update(gameRef, {
                    players: {
                        ...gameData.players,
                        player2: {
                            id: user.uid,
                            hand: player2hand,
                        },
                    },
                });

                console.log('Joined game with code:', joinCode, 'as Player 2, UID:', user.uid);
            } else {
                console.error('Invalid game code');
            }
        } catch (error) {
            console.error('Error joining game:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <SignOut></SignOut>
            <h1>King's Court</h1>
            <button onClick={handleCreateGame}>Create Game</button>
            <br /><br />
            <input
                type="text"
                placeholder="Enter Game Code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
            />
            <button onClick={handleJoinGame}>Join Game</button>
        </div>
    );
}

export default MainPage;
