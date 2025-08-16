import React from "react";
import StyledButton from "../styled-button";

const CommonView = ({
  playedCardsPile,
  onCardDrawnHandler,
  isDrawDisabled,
  onUnoClicked,
  isUnoDisabled,
}) => {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Hide the buttons as they're now handled in the parent component */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* <StyledButton
          className='bg-green-500'
          disabled={isDrawDisabled}
          onClick={onCardDrawnHandler}
          style={isDrawDisabled ? {pointerEvents: "none"} : null}
        > */}
        <div
          className="draw-deck"
          style={{
            left: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pointerEvents: isDrawDisabled ? "none" : "auto",
          }}
          role="button"
          disabled={isDrawDisabled}
          onClick={onCardDrawnHandler}
        >
          <div
            style={{
              width: "4rem",
              height: "6rem",
              backgroundColor: "#334155",
              borderRadius: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "semibold",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ fontSize: "1.5rem", color: "#0ea5e9" }}>+</span>
          </div>
          <div style={{ color: "white", fontSize: "0.875rem" }}>Draw Deck</div>
        </div>
      {playedCardsPile && playedCardsPile.length > 0 && (
        <div style={{
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "fit-content",
          margin: "0 auto",
          left: "50%",
          transform: "translateX(-50%)"
        }}>
          <img
            style={{
              pointerEvents: "none",
              width: "5.5rem",
              height: "8rem",
              borderRadius: "0.5rem",
              boxShadow: "0 0 15px rgba(14, 165, 233, 0.5)"
            }}
            alt={`cards-front ${playedCardsPile[playedCardsPile.length - 1]}`}
            src={`../assets/cards-front/${playedCardsPile[playedCardsPile.length - 1]}.png`}
          />
        </div>
      )}
        {/* DRAW CARD */}
        {/* </StyledButton> */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            onClick={onUnoClicked}
            disabled={isUnoDisabled}
            style={{
              backgroundColor: isUnoDisabled ? "#f97316" : "#475569",
              color: "white",
              fontWeight: "bold",
              padding: "0.75rem 1rem",
              borderRadius: "9999px",
              border: "none",
              fontSize: "1rem",
              boxShadow: "0 0 15px #FF6B35",
            }}
          >
            ZUNNO
          </button>
        </div>
      </div>

      {/* Current card display with glow effect */}
    </div>
  );
};

export default CommonView;
