import React from "react";
import StyledButton from "../styled-button";

const CommonView = ({playedCardsPile, onCardDrawnHandler, isDrawDisabled, onUnoClicked, isUnoDisabled}) => {
  return (
    <div className='middleInfo'>
      <StyledButton
        className='bg-green-500'
        disabled={isDrawDisabled}
        onClick={onCardDrawnHandler}
        style={isDrawDisabled ? {pointerEvents: "none"} : null}
      >
        DRAW CARD
      </StyledButton>
      {playedCardsPile && playedCardsPile.length > 0 && (
        <img
          style={{pointerEvents: "none"}}
          className='Card'
          alt={`cards-front ${playedCardsPile[playedCardsPile.length - 1]}`}
          src={`../assets/cards-front/${playedCardsPile[playedCardsPile.length - 1]}.png`}
        />
      )}
      <StyledButton
        className='bg-orange-500'
        disabled={isUnoDisabled}
        onClick={onUnoClicked}
        style={isUnoDisabled ? {pointerEvents: "none"} : null}
      >
        ZUNNO
      </StyledButton>
    </div>
  );
};

export default CommonView;
