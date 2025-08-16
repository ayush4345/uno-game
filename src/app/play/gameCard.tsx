export default function GameCard({index, gameId, joinGame, joinLoading}: {index: number, gameId: BigInt, joinGame: (gameId: BigInt) => void, joinLoading: boolean}) {

  return (
    <div
      key={index}
      className="bg-gray-700/40 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-700/60 transition-all"
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold">
            #{gameId.toString().slice(-2)}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Room {gameId.toString()}</h3>
          <div className="flex items-center text-gray-400 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span>Waiting for players</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => joinGame(gameId)}
        disabled={joinLoading}
        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 px-6 py-2 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 active:scale-95"
      >
        {joinLoading ? "Joining..." : "Join"}
      </button>
    </div>
  );
}
