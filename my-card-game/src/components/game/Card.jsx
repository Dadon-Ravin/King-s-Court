function Card({
    cardType,   // "Ace", "King", "Queen", "Jack", "Joker"
    ownerId,    // Player ID (e.g., "player1", "player2")
    state,      // "inHand", "activeZone", "dead"
    isRevealed, // Boolean (true/false)
    currentPlayerId, // ID of the player viewing the card
    onReveal,   // Callback to trigger reveal (if needed)
    onUnreveal, // Callback to trigger unreveal (if needed)
  }) {
    // Determine visibility based on game rules
    const isVisibleToViewer = determineVisibility({
      ownerId,
      currentPlayerId,
      state,
      isRevealed,
    });
  
    return (
      <div className={`card ${state} ${isVisibleToViewer ? 'face-up' : 'face-down'}`}>
        {isVisibleToViewer ? cardType : '🂠'}
        {/* Add click handlers for reveal/unreveal mechanics if applicable */}
      </div>
    );
  }

  function determineVisibility({ ownerId, currentPlayerId, state, isRevealed }) {
    // Rule 1: Dead cards are always visible to everyone
    if (state === 'dead') return true;
  
    // Rule 2: If the viewer owns the card, it’s always visible
    if (ownerId === currentPlayerId) return true;
  
    // Rule 3: If the card is revealed (via game mechanics), it’s visible
    if (isRevealed) return true;
  
    // Default: Card is hidden from opponents
    return false;
  }