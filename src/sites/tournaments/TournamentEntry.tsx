import { Close } from '@mui/icons-material'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Paper, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { API_BASE_URL } from '../..'
import { useAuth } from '../../hooks/useAuth'

export type TournamentType = {
	uid: number,
	name: string,
	created: number,
	members: number[],
	rounds: number,
	target: number,
	legs: number,
	sets: number,
	ko: number,
	finalists: number
}

type Props = TournamentType & {
	reloadCB: () => void
}

export function TournamentEntry({ uid, name, created, members, reloadCB }: Props) {
	const [open, setOpen] = useState(false)
	const [confirmName, setConfirmName] = useState("")
	const [error, setError] = useState<string | undefined>()
	const auth = useAuth()
	const navigate = useNavigate()

	const removeTournament = async () => {
		if (name === confirmName) {
			const data = await axios.post(API_BASE_URL + "removeTournament/", { token: localStorage.getItem("token")!, uid })
				.then(response => response.data as { success: boolean } | { error: string })
			if ("error" in data)
				if (data.error === "Token expired") {
					auth.refresh()
					removeTournament()
				} else
					setError(data.error)
			else {
				setOpen(false)
				setConfirmName("")
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

	console.log(members)

	return (<>
		<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
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
				<Button onClick={() => setOpen(false)}>Cancel</Button>
				<Button onClick={removeTournament}>Delete</Button>
			</DialogActions>
		</Dialog>
		<Paper variant='outlined' sx={{ my: 1, p: 1 }}> {/* TODO */}
			<Grid container display="flex">
				<Grid item sm={2}>
					<Typography sx={{ m: 1 }}>{name}</Typography>
				</Grid>
				<Grid item sm={9} display="flex">
					<Typography sx={{ m: 1, color: 'gray', margin: "auto" }}>{new Date(created * 1000).toLocaleDateString()}</Typography>
					<Typography sx={{ m: 1, color: 'gray', margin: "auto" }}>{members.length} Members</Typography>
				</Grid>
				<Grid item sm={1}>
					<IconButton sx={{ float: "right" }} onClick={() => setOpen(true)}><Close /></IconButton>
				</Grid>
			</Grid>
		</Paper>
	</>
	)
}