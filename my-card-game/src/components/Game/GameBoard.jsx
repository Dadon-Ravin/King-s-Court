import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase';
import Hand from './Hand';
import ActiveCard from './ActiveCard';
import SignOut from '../SignOut';

const GameBoard = ({ gameCode, playerNumber }) => {
    // Local state to store game data (you can expand this as needed)
    const [gameState, setGameState] = useState(null);

    useEffect(() => {
        const gameRef = ref(db, `games/${gameCode}`);
        const unsubscribe = onValue(gameRef, (snapshot) => {
            setGameState(snapshot.val());
        });

        return () => unsubscribe();
    }, [gameCode]);

    if (!gameState) return <div>Loading game...</div>;

    // Extract relevant data for the current player and the opponent
    const opponentNumber = playerNumber === 1 ? 2 : 1;
    const yourData = gameState.players[`player${playerNumber}`];
    const opponentData = gameState.players[`player${opponentNumber}`];

    const handleEndTurn = async () => {
        // Toggle turn between "player1" and "player2"
        const nextTurn = gameState.currentTurn === "player1" ? "player2" : "player1";
        await update(ref(db, `games/${gameCode}`), {
            currentTurn: nextTurn,
        });
    };

    return (
        <div className="game-board">
            <SignOut />

            {/* Display current turn information */}
            <div style={{ textAlign: 'center', margin: '10px' }}>
                <h3>Current Turn: {gameState.currentTurn}</h3>
            </div>

            {/* End Turn Button */}
            <div style={{ textAlign: 'center', margin: '10px' }}>
                <button
                    onClick={handleEndTurn}
                    disabled={gameState.currentTurn !== `player${playerNumber}`}
                >
                    End Turn
                </button>
            </div>

            {/* Opponent's Hand */}
            <div className="opponent-hand">
                <h2>Opponent's Hand</h2>
                {opponentData ? (
                    <Hand
                        handData={opponentData.hand}
                        owner={opponentNumber}         // Opponent's number
                        currentPlayer={playerNumber}   // Your number
                    />
                ) : (
                    <p>Waiting for opponent...</p>
                )}
            </div>

            {/* Opponent's Active Cards */}
            <div className="opponent-active">
                <h2>Opponent's Active Cards</h2>
                {opponentData ? (
                    <ActiveCard
                        activeCards={[opponentData.active1, opponentData.active2]}
                        owner={opponentNumber}         // Opponent's number
                        currentPlayer={playerNumber}   // Your number
                    />
                ) : (
                    <p>Waiting for opponent active cards...</p>
                )}
            </div>

            {/* Your Active Cards */}
            <div className="your-active">
                <h2>Your Active Cards</h2>
                <ActiveCard
                    activeCards={[yourData.active1, yourData.active2]}
                    owner={playerNumber}           // Your number
                    currentPlayer={playerNumber}   // Also your number, so cards display face up
                />
            </div>
            {/* Your Hand */}
            <div className="your-hand">
                <h2>Your Hand</h2>
                <Hand
                    handData={yourData.hand}
                    owner={playerNumber}           // Your number
                    currentPlayer={playerNumber}   // Also your number, so cards display face up
                />
            </div>
        </div>
    );
};

export default GameBoard;