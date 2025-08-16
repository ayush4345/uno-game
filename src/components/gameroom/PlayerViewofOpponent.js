import React from "react";
import MemoizedSpinner from "./Spinner";

const PlayerViewofOpponent = ({ opponentDeck, turn, opponent }) => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "0.5rem",
      width: "100%",
      maxWidth: "400px"
    }}>
      {opponentDeck.map((item, i) => (
        <div 
          key={item + i}
          style={{
            position: "relative",
            margin: "0 -10px",
            transform: `rotate(${i % 2 === 0 ? '-5' : '5'}deg)`,
            zIndex: i
          }}
        >
          <img
            style={{ 
              pointerEvents: "none",
              width: "3.5rem",
              height: "5rem",
              borderRadius: "0.5rem",
              // boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            }}
            alt={`opponent-cards-back`}
            className={turn === opponent ? "glow" : ""}
            src={`../assets/card-back.png`}
          />
        </div>
      ))}
      {turn === opponent ? <MemoizedSpinner /> : null}
    </div>
  );
};

export default PlayerViewofOpponent;
