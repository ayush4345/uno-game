import React from "react";
import bgMusic from "../../assets/sounds/game-bg-music.mp3";
import useSound from "use-sound";
import { useSoundProvider } from "../../context/SoundProvider";
import Link from "next/link";
import StyledButton from "../styled-button";

function Header({ roomCode }) {
  const { isSoundMuted, toggleMute } = useSoundProvider();
  const [isMusicMuted, setMusicMuted] = React.useState(true);
  const [playBBgMusic, { pause }] = useSound(bgMusic, { loop: true });

  return (
    <div className='topInfo'>
      <div className="flex gap-4 items-center">
        <Link href="/play" className='material-icons text-white text-2xl'>{"home"}</Link>
        <Link href="/profile" className='material-icons text-white text-2xl'>{"account_circle"}</Link>
        <h1 className="text-lg font-bold text-white mt-0">Room Code: {roomCode}</h1>
      </div>
      
    </div>
  );
}
const MemoizedHeader = React.memo(Header);
export default MemoizedHeader;
