import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase';
import Card from './Card'; // Assuming you use the Card component here

function GameBoard({ gameCode, playerNumber }) {
    const [opponentHand, setOpponentHand] = useState([]);
    const [opponentActiveCards, setOpponentActiveCards] = useState([]);
    const [playerActiveCards, setPlayerActiveCards] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);

    useEffect(() => {
        const gameRef = ref(db, `games/${gameCode}`);
        const unsubscribe = onValue(gameRef, (snapshot) => {
            const gameData = snapshot.val();
            if (!gameData) return;

            // Update opponent and player data
            const opponentPlayer = playerNumber === 1 ? 2 : 1;
            const opponentData = gameData.players[`player${opponentPlayer}`];
            const playerData = gameData.players[`player${playerNumber}`];

            // Opponent's hand and active cards
            setOpponentHand(opponentData.hand || []);
            setOpponentActiveCards(opponentData.activeCards || []);

            // Player's active cards and remaining hand
            setPlayerActiveCards(playerData.activeCards || []);
            setPlayerHand(playerData.hand || []);
        });

        return () => unsubscribe();
    }, [gameCode, playerNumber]);

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Game Board</h1>

            {/* Opponent's Hand (Face-down) */}
            <div style={{ marginBottom: '20px' }}>
                <h2>Opponent's Hand (Face-down)</h2>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {opponentHand.map((card) => (
                        <Card
                            key={card}
                            color={playerNumber === 1 ? 'black' : 'red'}
                            rank={card}
                            revealed={false} // Cards in opponent's hand are face-down
                            isPlayerCard={false} // They are not the player's card
                        />
                    ))}
                </div>
            </div>

            {/* Opponent's Active Cards (Face-down) */}
            <div style={{ marginBottom: '20px' }}>
                <h2>Opponent's Active Cards</h2>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {opponentActiveCards.map((card) => (
                        <Card
                            key={card}
                            color={playerNumber === 1 ? 'black' : 'red'}
                            rank={card}
                            revealed={false} // Opponent's active cards are face-down initially
                            isPlayerCard={false} // They are not the player's card
                        />
                    ))}
                </div>
            </div>

            {/* Player's Active Cards (Face-up) */}
            <div style={{ marginBottom: '20px' }}>
                <h2>Your Active Cards</h2>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {playerActiveCards.map((card) => (
                        <Card
                            key={card}
                            color={playerNumber === 1 ? 'red' : 'black'}
                            rank={card}
                            revealed={true} // Player's active cards are always face-up
                            isPlayerCard={true} // These are the player's cards
                        />
                    ))}
                </div>
            </div>

            {/* Player's Hand (Face-up) */}
            <div style={{ marginBottom: '20px' }}>
                <h2>Your Hand</h2>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {playerHand.map((card) => (
                        <Card
                            key={card}
                            color={playerNumber === 1 ? 'red' : 'black'}
                            rank={card}
                            revealed={true} // Player's hand is always face-up
                            isPlayerCard={true} // These are the player's cards
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GameBoard;
