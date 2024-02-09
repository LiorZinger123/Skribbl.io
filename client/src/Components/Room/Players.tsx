import PlayerType from "../../types/RoomTypes/playerType"

type Props = {
  players: PlayerType[]
}

const Players = (props: Props) => {

  return (
    <div>
      <ul>
        {props.players.map(player => (
          <li key={player.id}>{player.username}: {player.score}</li>
        ))}
      </ul>
    </div>
  )
}

export default Players