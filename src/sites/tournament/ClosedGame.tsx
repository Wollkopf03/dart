import { Grid, Paper, Typography } from '@mui/material'
import { PlayerType } from '../../hooks/usePlayers'

type Props = {
	player1: PlayerType,
	player2: PlayerType,
	game: {
		uid: number;
		players: [{
			uid: number;
			legs: number;
		}, {
			uid: number;
			legs: number;
		}];
	}
}

export function ClosedGame({ player1, player2, game }: Props) {
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
						<Typography sx={{ textAlign: "center" }}>{game.players[0].legs}</Typography>
					</Grid>
					<Grid item sm={6}>
						<Typography sx={{ textAlign: "center" }}>{game.players[1].legs}</Typography>
					</Grid>
				</Grid>
			</Paper >
		</Grid >
	)
}