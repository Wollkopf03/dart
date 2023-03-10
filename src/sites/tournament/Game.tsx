import { Alert, Button, Grid, Paper, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { PlayerType } from '../../hooks/usePlayers'
import { TournamentType } from '../../hooks/useTournaments'

type Props = {
	uid: number,
	player1: PlayerType,
	player2: PlayerType,
	tournament: TournamentType,
	setTournament: React.Dispatch<React.SetStateAction<TournamentType>>
}

export function Game({ uid, player1, player2, tournament, setTournament }: Props) {
	const [leftScore, setLeftScore] = useState(0)
	const [rightScore, setRightScore] = useState(0)
	const [error, setError] = useState<string | undefined>()

	useEffect(() => {
		setError(undefined)
	}, [leftScore, rightScore])

	const submitGame = async () => {
		if (leftScore < 0 || rightScore < 0)
			setError(`Score can't be below 0`)
		else if (leftScore > (tournament.legs + 1) / 2)
			setError(`Too many legs for ${player1.firstName} ${player1.lastName}`)
		else if (rightScore > (tournament.legs + 1) / 2)
			setError(`Too many legs for ${player2.firstName} ${player2.lastName}`)
		else if (leftScore + rightScore > tournament.legs)
			setError("Too many legs")
		else if (leftScore !== (tournament.legs + 1) / 2 && rightScore !== (tournament.legs + 1) / 2)
			setError(`No player reached ${(tournament.legs + 1) / 2} legs`)
		else {
			setTournament(tournament => {
				return {
					...tournament,
					data: {
						tree: "",
						open: tournament.data.open
							.map(round => { return { games: round.games.filter(game => game.uid !== uid) } })
							.filter(round => round.games.length > 0),
						closed: [
							...tournament.data.closed,
							{
								uid,
								players: [
									{
										uid: player1.uid,
										legs: leftScore
									}, {
										uid: player2.uid,
										legs: rightScore
									}
								]
							}]
					}
				}
			})
		}
	}

	return (
		<Grid item sm={3}>
			<Paper variant="outlined">
				<Grid container spacing={1} sx={{ p: 1 }}>
					<Grid item sm={6}>
						<Typography align='center'>{player1.firstName}<br />{player1.lastName}</Typography>
					</Grid>
					<Grid item sm={6}>
						<Typography align='center'>{player2.firstName}<br />{player2.lastName}</Typography>
					</Grid>
					<Grid item sm={6}>
						<TextField
							id={`${uid}-left`}
							fullWidth
							type="number"
							value={leftScore}
							onChange={(e) => setLeftScore(Number(e.target.value))} />
					</Grid>
					<Grid item sm={6}>
						<TextField
							id={`${uid}-right`}
							fullWidth
							type="number"
							value={rightScore}
							onChange={(e) => setRightScore(Number(e.target.value))} />
					</Grid>
					<Grid item sm={12}>
						{error
							? <Grid item lg={12}><Alert severity="error">{error}</Alert></Grid>
							: <Button
								disabled={
									(leftScore !== (tournament.legs + 1) / 2 && rightScore !== (tournament.legs + 1) / 2)
									|| leftScore + rightScore > tournament.legs
									|| leftScore > (tournament.legs + 1) / 2
									|| rightScore > (tournament.legs + 1) / 2
									|| leftScore < 0
									|| rightScore < 0
								}
								fullWidth
								variant='contained'
								onClick={submitGame}>
								Submit
							</Button>
						}
					</Grid>
				</Grid>
			</Paper >
		</Grid >
	)
}