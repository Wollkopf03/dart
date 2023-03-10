import { Close } from '@mui/icons-material'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Paper, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { TournamentType, useTournaments } from '../../hooks/useTournaments'

export function TournamentEntry({ uid, name, members }: TournamentType) {
	const [open, setOpen] = useState(false)
	const [confirmName, setConfirmName] = useState("")
	const [error, setError] = useState<string | undefined>()
	const { removeTournament } = useTournaments()
	const navigate = useNavigate()

	const submit = () => {
		if (name === confirmName) {
			removeTournament(uid)
			setOpen(false)
			setConfirmName("")
			setError(undefined)
		} else
			setError("Name incorrect")
	}

	useEffect(() => {
		setError(undefined);
	}, [name])

	return (<>
		<Dialog open={open} onClose={() => {
			setOpen(false)
			setConfirmName("")
		}} fullWidth maxWidth="sm">
			<DialogTitle>Remove Tournament</DialogTitle>
			<DialogContent>
				<Grid container spacing={3}>
					<Grid item>
						<Typography>
							Please confirm deletion of Tournament <strong>{name}</strong> by confirming the name.
						</Typography>
					</Grid>
					<Grid item lg={12}>
						<TextField
							autoFocus
							id="confirmName"
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
				<Button onClick={() => {
					setOpen(false)
					setConfirmName("")
				}}>Cancel</Button>
				<Button onClick={submit}>Delete</Button>
			</DialogActions>
		</Dialog>
		<Paper variant='outlined' sx={{ my: 1, p: 1 }} onClick={() => navigate("/tournament/" + uid)}>
			<Grid container display="flex">
				<Grid item sm={2}>
					<Typography sx={{ m: 1 }}>{name}</Typography>
				</Grid>
				<Grid item sm={9} display="flex">
					<Typography sx={{ m: 1, color: 'gray', margin: "auto" }}>{new Date(uid).toLocaleString()}</Typography>
					<Typography sx={{ m: 1, color: 'gray', margin: "auto" }}>{members.length} Members</Typography>
				</Grid>
				<Grid item sm={1}>
					<IconButton sx={{ float: "right" }} onClick={(e) => {
						setOpen(true);
						e.stopPropagation();
					}}><Close /></IconButton>
				</Grid>
			</Grid>
		</Paper>
	</>
	)
}