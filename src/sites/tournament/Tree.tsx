import { Grid, Paper, Typography } from '@mui/material'
import { usePlayers } from '../../hooks/usePlayers'
import { TournamentType, useTournaments } from '../../hooks/useTournaments'
import { TreeGame } from './TreeGame'

type Props = {
	uid: number,
	setTournament: React.Dispatch<React.SetStateAction<TournamentType>>
}

export function Tree({ uid, setTournament }: Props) {

	const { getPlayer } = usePlayers()

	const { getTournament, editTournament } = useTournaments()

	const game = /\{[0-9]+,[0-9]+\}/g
	const player = /[0-9]+/g

	const duels = getTournament(uid)?.data.tree.match(game)

	const endGame = (player1: { uid: number, legs: number }, player2: { uid: number, legs: number }) => {
		let tournament = getTournament(uid)!
		tournament.data.tree = tournament.data.tree.replace(`{${player1.uid},${player2.uid}}`, String(player1.legs > player2.legs ? player1.uid : player2.uid))
		tournament.data.tree = tournament.data.tree.replace(`{${player2.uid},${player1.uid}}`, String(player1.legs > player2.legs ? player1.uid : player2.uid))
		editTournament(tournament)
	}

	if (!getTournament(uid)?.data.tree)
		return <></>

	return duels
		? <Paper sx={{ p: 1, my: 2 }} variant="outlined">
			<Grid container spacing={3}>
				{duels!.map(duel => {
					const players = duel.match(player)!.map(player => Number(player))
					const player1 = getPlayer(players[0])
					const player2 = getPlayer(players[1])
					return <TreeGame key={duel} player1={player1!} tournament={getTournament(uid)!} player2={player2!} endGame={endGame} />
				})}
			</Grid>
		</Paper>
		: <Typography variant='h1'>{getPlayer(Number(getTournament(uid)?.data.tree))!.firstName} {getPlayer(Number(getTournament(uid)?.data.tree))!.lastName}</Typography>
}
