import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, update, onValue } from 'firebase/database';
import Card from './Card';
import SignOut from '../SignOut';
import GameBoard from './GameBoard';

function SelectActive({ playerNumber, gameCode }) {
    const [hand, setHand] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [waiting, setWaiting] = useState(false);
    const [bothSumbit, setBothSumbit] = useState(false);


    useEffect(() => {
        const handRef = ref(db, `games/${gameCode}/players/player${playerNumber}/hand`);
        onValue(handRef, (snapshot) => {
            if (snapshot.exists()) {
                setHand(snapshot.val());
            }
        });
    }, [gameCode, playerNumber]);

    const toggleCardSelection = (card, index) => {
        if (selectedCards.includes(index)) {
            setSelectedCards(selectedCards.filter((i) => i !== index));
        } else if (selectedCards.length < 2) {
            setSelectedCards([...selectedCards, index]);
        }
    };

    const handleSubmit = async () => {
        if (selectedCards.length === 2) {
            const activeCards = selectedCards.map((index) => hand[index]);
            const updatedHand = hand.filter((_, index) => !selectedCards.includes(index));

            await update(ref(db, `games/${gameCode}/players/player${playerNumber}`), {
                active1: activeCards[0],
                active2: activeCards[1],
                hand: updatedHand
            });
            setWaiting(true);

            // Listen for opponent's submission
            const gameRef = ref(db, `games/${gameCode}/players`);
            onValue(gameRef, (snapshot) => {
                const players = snapshot.val();
                if (players.player1?.active1 && players.player2?.active1) {
                    setBothSumbit(true); // Transition to GameBoard
                }
            });
        }
    };

    return (
        bothSumbit ? (
            <>
                <GameBoard gameCode={gameCode} playerNumber={playerNumber} />
            </>
        ) : (
            <div style={{ textAlign: 'center' }}>
                <h2>Select 2 Active Cards</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    {hand.map((card, index) => (
                        <div
                            key={index}
                            style={{
                                boxShadow: selectedCards.includes(index)
                                    ? `0px 0px 10px ${playerNumber === 1 ? 'red' : 'black'}`
                                    : 'none',
                                borderRadius: '5px',
                                padding: '5px',
                                cursor: 'pointer',
                            }}
                            onClick={() => toggleCardSelection(card, index)}
                        >
                            <Card rank={card.rank} revealed={true} player={playerNumber} playerNumber={playerNumber} />
                        </div>
                    ))}
                </div>
                <button onClick={handleSubmit} disabled={selectedCards.length !== 2}>
                    Submit Selection
                </button>
                <SignOut></SignOut>
                {waiting && <p>Waiting for opponent...</p>}
            </div>
        )
    );
}

export default SelectActive;

