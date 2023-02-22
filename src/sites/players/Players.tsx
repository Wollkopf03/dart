import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import { API_BASE_URL } from "../..";
import { useAuth } from "../../hooks/useAuth";
import { PlayerEntry, PlayerType } from "./PlayerEntry";

export const loadPlayers = async (): Promise<PlayerType[]> => {
	const data = await axios.get<{ players: PlayerType[] } | { error: string }>(API_BASE_URL + "loadPlayers/")
		.then(response => response.data)
		.catch(e => {
			console.error(e)
			return { error: e }
		})
	if ("error" in data)
		console.log(data.error)
	else
		return data.players
	return []
}

export function Players() {
	const [open, setOpen] = useState(false);
	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const [players, setPlayers] = useState<PlayerType[]>(useLoaderData() as PlayerType[])
	const auth = useAuth()

	const [error, setError] = useState<string | undefined>()

	const addPlayer = async () => {
		if (firstName === "" || lastName === "")
			return
		const data = await axios.post(API_BASE_URL + "addPlayer/", { token: localStorage.getItem("token")!, firstName, lastName })
			.then(response => response.data as { success: boolean } | { error: string })
		if ("error" in data) {
			if (data.error === "Token expired") {
				auth.refresh()
				addPlayer()
			} else
				setError(data.error)
			return
		}
		setOpen(false)
		setFirstName("")
		setLastName("")
		reload()
	}

	const reload = async () => {
		setPlayers(await loadPlayers())
	}

	useEffect(() => {
		setError(undefined);
	}, [firstName, lastName])

	return (
		<>
			<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
				<DialogTitle>Add new Player</DialogTitle>
				<DialogContent>
					<Grid container spacing={3} sx={{ mt: 0 }}>
						<Grid item lg={6}>
							<TextField
								autoFocus
								value={firstName}
								id="firstname"
								label="Vorname"
								fullWidth
								onChange={(e) => setFirstName(e.target.value)}
							/>
						</Grid>
						<Grid item lg={6}>
							<TextField
								id="lastname"
								value={lastName}
								label="Nachname"
								fullWidth
								onChange={(e) => setLastName(e.target.value)}
							/>
						</Grid>
						{error && <Grid item lg={12}><Alert sx={{ mt: 3 }} severity="error">{error}</Alert></Grid>}
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button onClick={addPlayer}>Add</Button>
				</DialogActions>
			</Dialog>
			<Button onClick={() => setOpen(true)}>+ Add Player</Button>
			{players.sort((a, b) => {
				const a_perc = isNaN(a.legs_won / (a.legs_won + a.legs_lost)) ? 0 : a.legs_won / (a.legs_won + a.legs_lost)
				const b_perc = isNaN(b.legs_won / (b.legs_won + b.legs_lost)) ? 0 : b.legs_won / (b.legs_won + b.legs_lost)
				return b_perc - a_perc
			})
				.map((player, index) => <PlayerEntry key={index} {...player} reloadCB={reload} />)}
		</>
	)
}