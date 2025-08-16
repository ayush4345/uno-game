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
}) => {
  const playerDeck = currentUser === "Player 1" ? player1Deck : player2Deck;
  const opponentDeck = currentUser === "Player 1" ? player2Deck : player1Deck;
  const { isSoundMuted, toggleMute } = useSoundProvider();
  const [isMusicMuted, setMusicMuted] = React.useState(true);
  const [playBBgMusic, { pause }] = useSound(bgMusic, { loop: true });
  const router = useRouter();
  
  // Calculate opponent name and avatar
  const opponentName = currentUser === "Player 1" ? "Player 2" : "Player 1";
  const opponentDisplayName = opponentName === "Player 1" ? "You" : "Opponent";
  
  return (
    <div className="game-container" style={{
      background: "#0f172a", 
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      padding: "1rem"
    }}>
      {/* Game Header */}
      <div className="game-header" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem"
      }}>
        <button className="leave-button" style={{
          background: "transparent",
          border: "none",
          color: "#0ea5e9",
          fontSize: "1.25rem",
          display: "flex",
          alignItems: "center",
          cursor: "pointer"
        }}
        onClick={() => router.push("/play")}
        >
          <span style={{ marginRight: "0.5rem" }}>&lt;</span> Leave
        </button>
        
        <span>
        <StyledButton className='bg-green-500 mr-2' onClick={toggleMute}>
          <span className='material-icons'>{isSoundMuted ? "volume_off" : "volume_up"}</span>
        </StyledButton>
        <StyledButton
          className='bg-green-500'
          onClick={() => {
            if (isMusicMuted) playBBgMusic();
            else pause();
            setMusicMuted(!isMusicMuted);
          }}
        >
          <span className='material-icons'>{isMusicMuted ? "music_off" : "music_note"}</span>
        </StyledButton>
      </span>
      </div>

      {/* Opponent View */}
      <div className="opponent-section" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "2rem"
      }}>
        <div className="opponent-info" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "1rem",
          position: "relative"
        }}>
          <div className="avatar" style={{
            width: "3.5rem",
            height: "3.5rem",
            borderRadius: "50%",
            overflow: "hidden",
            border: turn === opponentName ? "3px solid #0ea5e9" : "3px solid transparent",
            marginBottom: "0.5rem"
          }}>
            <img 
              src="/user.png" 
              alt="Opponent Avatar" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{ color: "white", fontWeight: "bold" }}>Opponent</div>
          <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>Thinking...</div>
        </div>
        
        <PlayerViewofOpponent
          turn={turn}
          opponent={opponentName}
          opponentDeck={opponentDeck}
        />
      </div>

      {/* Game Board */}
      <div className="game-board" style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}>
        <div className="card-circles" style={{
          position: "relative",
          width: "100%",
          height: "12rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            position: "absolute",
            width: "11rem",
            height: "11rem",
            borderRadius: "50%",
            border: "2px solid rgba(14, 165, 233, 0.3)"
          }}></div>
          <div style={{
            position: "absolute",
            width: "8rem",
            height: "8rem",
            borderRadius: "50%",
            border: "2px solid rgba(14, 165, 233, 0.2)"
          }}></div>
          
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
      <div className="player-section" style={{
        marginTop: "2rem"
      }}>
        <div className="player-info" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem"
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="avatar" style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "50%",
              overflow: "hidden",
              border: turn === currentUser ? "3px solid #0ea5e9" : "3px solid transparent",
              marginRight: "1rem"
            }}>
              <img 
                src="/user.png" 
                alt="Player Avatar" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div>
              <div style={{ color: "white", fontWeight: "bold" }}>You</div>
              <div style={{ color: "#10b981", fontSize: "0.875rem", display: turn === currentUser ? "block" : "none" }}>Your Turn</div>
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
  );
};

export default GameScreen;
