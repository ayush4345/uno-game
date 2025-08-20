import React from "react";
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
  const [isMusicMuted, setMusicMuted] = React.useState(true);
  const [playBBgMusic, { pause }] = useSound(bgMusic, { loop: true });
  const router = useRouter();

  // Calculate opponent name and avatar
  const opponentName = currentUser === "Player 1" ? "Player 2" : "Player 1";
  const opponentDisplayName =
    isComputerMode && opponentName === "Player 2"
      ? "Computer"
      : opponentName === "Player 1"
      ? "You"
      : "Opponent";

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
            className="avatar"
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              overflow: "hidden",
              border:
                turn === opponentName
                  ? "3px solid #0ea5e9"
                  : "3px solid transparent",
              marginBottom: "0.5rem",
            }}
          >
            <img
              src="/user.png"
              alt="Opponent Avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* </div>
          <div style={{ color: "white", fontWeight: "bold" }}>
            {isComputerMode && opponentName === "Player 2" ? "🤖 Computer" : "Opponent"}
          </div> */}
            <div
              style={{
                color: "#94a3b8",
                fontSize: "0.875rem",
                visibility: turn === opponentName ? "visible" : "hidden",
              }}
            >
              {isComputerMode && opponentName === "Player 2"
                ? "Computing move..."
                : "Thinking..."}
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
        <div style={{ display: "flex" }}>
          <button
            className="skip-button"
            disabled={turn !== currentUser || !drawButtonPressed}
            onClick={onSkipButtonHandler}
            style={{
              margin: "auto",
              background: "linear-gradient(to bottom, #f43f5e, #e11d48)",
              color: "white",
              fontWeight: "bold",
              fontSize: "1.25rem",
              padding: "0.5rem 2rem",
              borderRadius: "0.5rem",
              border: "none",
              boxShadow:
                "0 0 15px rgba(225, 29, 72, 0.5), 0 4px 6px rgba(0, 0, 0, 0.3)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              opacity: turn !== currentUser || !drawButtonPressed ? "0.6" : "1",
              pointerEvents:
                turn !== currentUser || !drawButtonPressed ? "none" : "auto",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)",
                opacity: turn !== currentUser || !drawButtonPressed ? "0" : "1",
              }}
            ></span>
            SKIP
          </button>
        </div>
        <div
          className="player-section"
          style={{
            marginTop: "2rem",
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
                className="avatar"
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border:
                    turn === currentUser
                      ? "3px solid #0ea5e9"
                      : "3px solid transparent",
                  marginRight: "1rem",
                }}
              >
                <img
                  src="/user.png"
                  alt="Player Avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div>
                <div style={{ color: "white", fontWeight: "bold" }}>You</div>
                <div
                  style={{
                    color: "#10b981",
                    fontSize: "0.875rem",
                    display: turn === currentUser ? "block" : "none",
                  }}
                >
                  Your Turn
                </div>
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
