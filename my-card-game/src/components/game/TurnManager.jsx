// src/components/game/TurnManager.jsx
export const TurnManager = ({ gameState, playerId }) => {
  const isCurrentTurn = gameState.currentTurn === playerId;
  
  return (
    <div className="turn-interface">
      {isCurrentTurn ? (
        <div className="player-actions">
          <button onClick={handleSwap}>Swap Cards</button>
          <button onClick={handleAction}>Use Action</button>
        </div>
      ) : (
        <div className="waiting-message">
          Waiting for opponent's turn...
        </div>
      )}
    </div>
  );
};