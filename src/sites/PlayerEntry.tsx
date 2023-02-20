import { Close } from '@mui/icons-material'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Paper, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { API_BASE_URL } from '..'
import { useAuth } from '../hooks/useAuth'

export type PlayerType = {
	uid: number,
	firstName: string,
	lastName: string,
	legs_won: number,
	legs_lost: number
}

type Props = PlayerType & {
	reloadCB: () => void
}

export function PlayerEntry({ uid, firstName, lastName, legs_won, legs_lost, reloadCB }: Props) {
	const [open, setOpen] = useState(false)
	const [name, setName] = useState("")
	const [error, setError] = useState<string | undefined>()
	const auth = useAuth()

	const percentage = ((legs_won / (legs_won + legs_lost)).toFixed(3)).substring((legs_won > 0 && legs_lost === 0) || legs_won + legs_lost === 0 ? 0 : 1)

	const removePlayer = async () => {
		if (name === firstName + " " + lastName) {
			const data = await axios.post(API_BASE_URL + "removePlayer/", { token: localStorage.getItem("token")!, uid })
				.then(response => response.data as { success: boolean } | { error: string })
			if ("error" in data)
				if (data.error === "Token expired") {
					auth.refresh()
					removePlayer()
				} else
					setError(data.error)
			else {
				setOpen(false)
				setName("")
				setError(undefined)
				reloadCB()
			}
		} else {
			setError("Name incorrect")
		}

	}

	useEffect(() => {
		setError(undefined);
	}, [name])

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
							id="name"
							value={name}
							label="Name"
							fullWidth
							onChange={(e) => setName(e.target.value)}
						/>
					</Grid>
					{error && <Grid item lg={12}><Alert sx={{ mt: 3 }} severity="error">{error}</Alert></Grid>}
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => setOpen(false)}>Cancel</Button>
				<Button onClick={removePlayer}>Delete</Button>
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