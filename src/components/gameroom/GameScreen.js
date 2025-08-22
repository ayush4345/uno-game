import React, { useEffect, useState, useRef } from "react";
import PlayerViewofOpponent from "./PlayerViewofOpponent";
import CommonView from "./CommonView";
import MainPlayerView from "./MainPlayerView";
import bgMusic from "../../assets/sounds/game-bg-music.mp3";
import useSound from "use-sound";
import { useSoundProvider } from "../../context/SoundProvider";
import StyledButton from "../styled-button";
import { useRouter } from "next/navigation";

const GameScreen = ({
  currentUser,
  turn,
  player1Deck,
  player2Deck,
  onUnoClicked,
  playedCardsPile,
  onCardPlayedHandler,
  onCardDrawnHandler,
  drawButtonPressed,
  onSkipButtonHandler,
  isComputerMode = false,
}) => {
  const playerDeck = currentUser === "Player 1" ? player1Deck : player2Deck;
  const opponentDeck = currentUser === "Player 1" ? player2Deck : player1Deck;
  const { isSoundMuted, toggleMute } = useSoundProvider();
  const [isMusicMuted, setMusicMuted] = useState(true);
  const [playBBgMusic, { pause }] = useSound(bgMusic, { loop: true });
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [skipTimer, setSkipTimer] = useState(null);
  const [skipTimeRemaining, setSkipTimeRemaining] = useState(10);
  const skipTimerRef = useRef(null);
  
  // Turn timer state
  const [turnTimeRemaining, setTurnTimeRemaining] = useState(10);
  const turnTimerRef = useRef(null);
  const router = useRouter();

  // Calculate opponent name and avatar
  const opponentName = currentUser === "Player 1" ? "Player 2" : "Player 1";
  const opponentDisplayName =
    isComputerMode && opponentName === "Player 2"
      ? "Computer"
      : opponentName === "Player 1"
      ? "You"
      : "Opponent";
      
  // Effect for turn animation
  useEffect(() => {
    setPulseAnimation(true);
    const timer = setTimeout(() => setPulseAnimation(false), 500);
    return () => clearTimeout(timer);
  }, [turn]);
  
  // Effect for turn timer
  useEffect(() => {
    // Reset timer when turn changes
    setTurnTimeRemaining(10);
    
    // Clear any existing timer
    if (turnTimerRef.current) {
      clearInterval(turnTimerRef.current);
      turnTimerRef.current = null;
    }
    
    // Start new timer
    turnTimerRef.current = setInterval(() => {
      setTurnTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up - auto change turn
          clearInterval(turnTimerRef.current);
          turnTimerRef.current = null;
          
          // If it's the current user's turn and they've drawn a card, skip
          if (turn === currentUser && drawButtonPressed) {
            onSkipButtonHandler();
          } 
          // Otherwise, draw a card and potentially skip
          else if (turn === currentUser) {
            onCardDrawnHandler();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Cleanup function
    return () => {
      if (turnTimerRef.current) {
        clearInterval(turnTimerRef.current);
        turnTimerRef.current = null;
      }
    };
  }, [turn, currentUser, drawButtonPressed, onSkipButtonHandler, onCardDrawnHandler]);

  // Effect for skip timer
  useEffect(() => {
    // Start timer when draw button is pressed and it's the current user's turn
    if (turn === currentUser && drawButtonPressed) {
      setSkipTimer(true);
      setSkipTimeRemaining(10);
      
      // Clear any existing timer
      if (skipTimerRef.current) clearInterval(skipTimerRef.current);
      
      // Start countdown
      skipTimerRef.current = setInterval(() => {
        setSkipTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up - auto skip
            clearInterval(skipTimerRef.current);
            onSkipButtonHandler();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Clear timer when it's not the user's turn or draw button is not pressed
      setSkipTimer(false);
      if (skipTimerRef.current) {
        clearInterval(skipTimerRef.current);
        skipTimerRef.current = null;
      }
    }
    
    // Cleanup function
    return () => {
      if (skipTimerRef.current) {
        clearInterval(skipTimerRef.current);
        skipTimerRef.current = null;
      }
    };
  }, [turn, currentUser, drawButtonPressed, onSkipButtonHandler]);

  return (
    <div className="game-container" style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      padding: "1rem"
    }}>
      {/* Game Header */}
      <div
        className="game-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          position: "absolute"
        }}
      >
        <button
          className="glossy-button glossy-button-blue"
          style={{
            minWidth: "56px",
            height: "28px",
            fontSize: "0.9rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            padding: "0 12px",
            borderRadius: "18px",
            boxShadow: "0 8px 16px rgba(0, 105, 227, 0.3), inset 0 -2px 0 rgba(0, 0, 0, 0.1), inset 0 2px 0 rgba(255, 255, 255, 0.3)",
            transition: "all 0.2s ease",
          }}
          onClick={() => router.push("/play")}
        >
          <svg width="24" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M24 12H5M12 19l-7-7 7-7"/>
          </svg>
          {/* Back */}
        </button>

        {/* <span>
          <StyledButton className="bg-green-500 mr-2" onClick={toggleMute}>
            <span className="material-icons">
              {isSoundMuted ? "volume_off" : "volume_up"}
            </span>
          </StyledButton>
          <StyledButton
            className="bg-green-500"
            onClick={() => {
              if (isMusicMuted) playBBgMusic();
              else pause();
              setMusicMuted(!isMusicMuted);
            }}
          >
            <span className="material-icons">
              {isMusicMuted ? "music_off" : "music_note"}
            </span>
          </StyledButton>
        </span> */}
      </div>

      {/* Opponent View */}
      <div
        className="opponent-section"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "calc(100vh - 100px)",
        }}
      >
        <div
          className="opponent-info"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            marginBottom: "24px"
          }}
        >
          <div
            className="avatar-container"
            style={{
              width: "2.5rem",
              height: "2.5rem",
              position: "relative",
              marginBottom: "0.5rem",
            }}
          >
            {turn === opponentName && (
              <svg 
                width="2.5rem" 
                height="2.5rem" 
                viewBox="0 0 100 100"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: "rotate(-90deg)",
                  zIndex: 1
                }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="rgba(4, 81, 214, 0.8)"
                  strokeWidth="8"
                  strokeDasharray={`${(turnTimeRemaining/10) * 301.6} 301.6`} // 301.6 is approx 2*PI*48 (circumference)
                  strokeLinecap="round"
                />
              </svg>
            )}
            <div
              className="avatar"
              style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "50%",
                overflow: "hidden",
                position: "relative",
                boxShadow: turn === opponentName ? "0 0 15px 5px rgba(14, 165, 233, 0.7)" : "none",
                transform: turn === opponentName && pulseAnimation ? "scale(1.1)" : "scale(1)",
                transition: "all 0.3s ease",
                zIndex: 2
              }}
            >
            <img
              src="https://api.dicebear.com/9.x/micah/svg?seed=game"
              alt="Opponent Avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                color: "#94a3b8",
                fontSize: "0.875rem",
                visibility: turn === opponentName ? "visible" : "hidden",
              }}
            >
              {isComputerMode && opponentName === "Player 2"
                ? `Computing move... (${turnTimeRemaining}s)`
                : `Thinking... (${turnTimeRemaining}s)`}
            </div>
            </div>
          </div>

          <PlayerViewofOpponent
            turn={turn}
            opponent={opponentName}
            opponentDeck={opponentDeck}
          />
        </div>

        {/* Game Board */}
        <div
          className="game-board"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            width: "100%",
          }}
        >
          <div
            className="card-circles"
            style={{
              position: "relative",
              width: "100%",
              height: "12rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CommonView
              isDrawDisabled={turn !== currentUser || drawButtonPressed}
              playedCardsPile={playedCardsPile}
              onCardDrawnHandler={onCardDrawnHandler}
              isUnoDisabled={turn !== currentUser || playerDeck.length !== 2}
              onUnoClicked={onUnoClicked}
            />
          </div>
        </div>

        {/* Player View */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* <button
            className="skip-button"
            disabled={turn !== currentUser || !drawButtonPressed}
            onClick={onSkipButtonHandler}
            style={{
              margin: "auto",
              cursor: "pointer",
              transition: "all 0.2s ease",
              opacity: turn !== currentUser || !drawButtonPressed ? "0.6" : "1",
              pointerEvents:
                turn !== currentUser || !drawButtonPressed ? "none" : "auto",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img src="/images/skip.png" className="w-20" alt="Skip" />
          </button> */}
          
          {skipTimer && (
            <div 
              // className="skip-timer"
              // style={{
              //   marginTop: "8px",
              //   fontSize: "1rem",
              //   fontWeight: "bold",
              //   color: skipTimeRemaining <= 5 ? "#ef4444" : "#10b981",
              //   animation: skipTimeRemaining <= 5 ? "pulse 1s infinite" : "none",
              // }}
            >
              {/* Auto-skip in {skipTimeRemaining}s
              <style jsx>{`
                @keyframes pulse {
                  0% { opacity: 0.7; }
                  50% { opacity: 1; }
                  100% { opacity: 0.7; }
                }
              `}</style> */}
            </div>
          )}
        </div>
        <div
          className="player-section"
          style={{
            marginTop: "1rem",
          }}
        >
          <div
            className="player-info"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                className="avatar-container"
                style={{
                  width: "3rem",
                  height: "3rem",
                  position: "relative",
                  marginRight: "1rem",
                }}
              >
                {turn === currentUser && (
                  <svg 
                    width="3rem" 
                    height="3rem" 
                    viewBox="0 0 100 100"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      transform: "rotate(-90deg)",
                      zIndex: 1
                    }}
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="48"
                      fill="none"
                      stroke="rgba(4, 81, 214, 0.8)"
                      strokeWidth="8"
                      strokeDasharray={`${(turnTimeRemaining/10) * 301.6} 301.6`} // 301.6 is approx 2*PI*48 (circumference)
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                <div
                  className="avatar"
                  style={{
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "50%",
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: turn === currentUser ? "0 0 20px 8px rgba(14, 165, 233, 0.8)" : "none",
                    transform: turn === currentUser && pulseAnimation ? "scale(1.1)" : "scale(1)",
                    transition: "all 0.3s ease",
                    zIndex: 2
                  }}
                >
                <img
                  src="https://api.dicebear.com/9.x/micah/svg?seed=gameboyy"
                  alt="Player Avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                </div>
              </div>
              <div>
                <div style={{ color: "white", fontWeight: "bold" }}>You</div>
                <div
                  style={{
                    color: "#10b981",
                    fontSize: "0.875rem",
                    display: turn === currentUser ? "block" : "none",
                    animation: turn === currentUser ? "fadeInOut 1.5s infinite" : "none",
                    fontWeight: "bold"
                  }}
                >
                  ✨ Your Turn ({turnTimeRemaining}s) ✨
                </div>
                <style jsx>{`
                  @keyframes fadeInOut {
                    0% { opacity: 0.7; }
                    50% { opacity: 1; }
                    100% { opacity: 0.7; }
                  }
                `}</style>
              </div>
            </div>
          </div>
          <MainPlayerView
            turn={turn}
            mainPlayer={currentUser}
            playerDeck={playerDeck}
            onCardPlayedHandler={onCardPlayedHandler}
            isSkipButtonDisabled={turn !== currentUser || !drawButtonPressed}
            onSkipButtonHandler={onSkipButtonHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
