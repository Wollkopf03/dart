import { Close } from '@mui/icons-material'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Paper, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { PlayerType, usePlayers } from '../../hooks/usePlayers'

export function PlayerEntry({ uid, firstName, lastName, legs_won, legs_lost }: PlayerType) {
	const [open, setOpen] = useState(false)
	const [confirmName, setConfirmName] = useState("")
	const [error, setError] = useState<string | undefined>()
	const { removePlayer } = usePlayers()

	const percentage = ((legs_won / (legs_won + legs_lost)).toFixed(3)).substring((legs_won > 0 && legs_lost === 0) || legs_won + legs_lost === 0 ? 0 : 1)

	useEffect(() => {
		setError(undefined);
	}, [confirmName])

	return (<>
		<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
			<DialogTitle>Remove Player</DialogTitle>
			<DialogContent>
				<Grid container spacing={3}>
					<Grid item>
						<Typography>
							Please confirm deletion of player <strong>{firstName} {lastName}</strong> by confirming his name.
						</Typography>
					</Grid>
					<Grid item lg={12}>
						<TextField
							autoFocus
							id="name"
							value={confirmName}
							label="Name"
							fullWidth
							onChange={(e) => setConfirmName(e.target.value)}
						/>
					</Grid>
					{error && <Grid item lg={12}><Alert sx={{ mt: 3 }} severity="error">{error}</Alert></Grid>}
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => setOpen(false)}>Cancel</Button>
				<Button onClick={() => {
					if (confirmName === firstName + " " + lastName) {
						removePlayer(uid)
						setOpen(false)
					} else
						setError("Name incorrect")

				}}>Delete</Button>
			</DialogActions>
		</Dialog>
		<Paper variant='outlined' sx={{ my: 1, p: 1 }}>
			<Grid container display="flex">
				<Grid item sm={2}>
					<Typography sx={{ m: 1 }}>{lastName}, {firstName}</Typography>
				</Grid>
				<Grid item sm={9} display="flex">
					<Typography sx={{ m: 1, color: 'gray', margin: "auto" }}>{legs_won} : {legs_lost}</Typography>
					<Typography sx={{ m: 1, color: 'gray', margin: "auto" }}>{percentage}</Typography>
				</Grid>
				<Grid item sm={1}>
					<IconButton sx={{ float: "right" }} onClick={() => setOpen(true)}><Close /></IconButton>
				</Grid>
			</Grid>
		</Paper>
	</>
	)
}