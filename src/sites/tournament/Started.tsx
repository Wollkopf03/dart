import { Grid, Paper, Typography } from '@mui/material'
import { usePlayers } from '../../hooks/usePlayers'
import { TournamentType } from '../../hooks/useTournaments'
import { ClosedGame } from './ClosedGame'
import { Game } from './Game'

type Props = {
	tournament: TournamentType,
	setTournament: React.Dispatch<React.SetStateAction<TournamentType>>
}

export function Started({ tournament, setTournament }: Props) {

	const { players } = usePlayers()

	return (
		<>
			<hr />
			<Typography variant='h5' sx={{ ml: 1, mt: 2 }}>
				Pending
			</Typography>
			{tournament.data.open.map((round, index) =>
				<Paper key={index} sx={{ p: 1, my: 2 }} variant="outlined">
					<Grid container spacing={3}>
						{round.games.map((game, index) => {
							if (game.players.filter(player => player === -1).length !== 0)
								return null
							const player1 = players.filter(player => player.uid === game.players[0])[0]
							const player2 = players.filter(player => player.uid === game.players[1])[0]
							return <Game key={game.uid} player1={player1} player2={player2} tournament={tournament} setTournament={setTournament} uid={game.uid} />
						})}
					</Grid>
				</Paper>
			)}
			{tournament.data.closed.length > 0 && <>
				<Typography variant='h5' sx={{ ml: 1, my: 2 }}>
					Finished
				</Typography>
				<Paper sx={{ p: 1 }} variant="outlined">
					<Grid container spacing={3}>
						{tournament.data.closed.map((game, index) => {
							const player1 = players.filter(player => player.uid === game.players[0].uid)[0]
							const player2 = players.filter(player => player.uid === game.players[1].uid)[0]
							return <ClosedGame key={game.uid} player1={player1} player2={player2} game={game} />
						})}
					</Grid>
				</Paper>
			</>}
		</>
	)
}