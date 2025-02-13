import React, { useState, useEffect } from 'react';
import { ref, get, update } from 'firebase/database';
import { db } from '../../firebase';
import Card from './Card';

function SelectActive({ gameCode, playerNumber }) {
    const [hand, setHand] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [bothPlayersSubmitted, setBothPlayersSubmitted] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);

    useEffect(() => {
        const fetchHand = async () => {
            const gameRef = ref(db, `games/${gameCode}`);
            const snapshot = await get(gameRef);
            const gameData = snapshot.val();

            // Get the player's hand from Firebase
            const playerData = gameData.players[`player${playerNumber}`];
            setHand(playerData.hand || []);
            setBothPlayersSubmitted(gameData.players.player1?.activeCards && gameData.players.player2?.activeCards);
        };

        fetchHand();
    }, [gameCode, playerNumber]);

    // Handle card selection and unselection
    const handleCardClick = (card) => {
        const isSelected = selectedCards.some((selected) => selected.rank === card.rank);

        if (isSelected) {
            setSelectedCards(selectedCards.filter((selected) => selected.rank !== card.rank)); // Unselect the card
        } else {
            if (selectedCards.length < 2) {
                setSelectedCards([...selectedCards, card]); // Select the card
            }
        }
    };

    // Handle submit action
    const handleSubmitSelection = async () => {
        if (selectedCards.length === 2) {
            const gameRef = ref(db, `games/${gameCode}`);
            const snapshot = await get(gameRef);
            const gameData = snapshot.val();

            const updatedPlayers = { ...gameData.players };

            // Update player's active cards in Firebase
            updatedPlayers[`player${playerNumber}`].activeCards = selectedCards;

            // Remove selected cards from hand and update Firebase
            updatedPlayers[`player${playerNumber}`].hand = hand.filter(
                (card) => !selectedCards.some((selected) => selected.rank === card.rank)
            );

            await update(gameRef, { players: updatedPlayers });

            console.log(`Player ${playerNumber} submitted selection`);

            // Check if both players have submitted their selection
            const bothPlayersSubmitted = updatedPlayers.player1?.activeCards && updatedPlayers.player2?.activeCards;
            if (bothPlayersSubmitted) {
                setBothPlayersSubmitted(true);
            } else {
                setIsWaiting(true);
            }
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Select Your Active Cards</h1>
            {isWaiting && <p>Waiting for the other player to select their cards...</p>}

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {hand.map((card, index) => (
                    <Card
                        key={`${card.rank}-${playerNumber}-${index}`} // Unique key for each card
                        color={playerNumber === 1 ? 'red' : 'black'}
                        rank={card.rank}
                        revealed={card.revealed}
                        onClick={() => handleCardClick(card)}
                        isSelected={selectedCards.some((selected) => selected.rank === card.rank)} // Visual indicator for selection
                    />
                ))}
            </div>
            <div>
                <button
                    onClick={handleSubmitSelection}
                    disabled={selectedCards.length !== 2}
                >
                    Submit Selection
                </button>
            </div>

            {bothPlayersSubmitted && <p>Both players have selected their cards. The game is now starting!</p>}
        </div>
    );
}

export default SelectActive;
