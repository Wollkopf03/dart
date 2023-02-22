import { Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import { API_BASE_URL } from "../..";
import { useAuth } from "../../hooks/useAuth";
import { TournamentEntry, TournamentType } from "./TournamentEntry";

export const loadTournaments = async (): Promise<TournamentType[]> => {
	const data = await axios.get<{ tournaments: TournamentType[] } | { error: string }>(API_BASE_URL + "loadTournaments/")
		.then(response => response.data)
		.catch(e => {
			console.error(e)
			return { error: e }
		})
	if ("error" in data)
		console.log(data.error)
	else
		return data.tournaments
	return []
}

export function Tournaments() {
	const [open, setOpen] = useState(false)
	const [name, setName] = useState("")
	const [rounds, setRounds] = useState(6)
	const [target, setTarget] = useState(501)
	const [legs, setLegs] = useState(3)
	const [sets, setSets] = useState(1)
	const [ko, setKo] = useState(false)
	const [finalists, setFinalists] = useState(8)
	const [tournaments, setTournaments] = useState<TournamentType[]>(useLoaderData() as TournamentType[])
	const auth = useAuth()

	const [error, setError] = useState<string | undefined>()

	const addTournament = async () => {
		if (name === "")
			return setError("name can't be empty")
		else if (rounds < 1)
			return setError("rounds can't be below 1")
		else if (target < 2)
			return setError("target can't be below 2")
		else if (legs < 1)
			return setError("legs can't be below 1")
		else if (sets < 1)
			return setError("sets can't be below 1")
		else if (finalists < 2)
			return setError("finalists must greater than 2")
		const data = await axios.post(API_BASE_URL + "addTournament/",
			{ token: localStorage.getItem("token")!, name, rounds, target, legs, sets, ko, finalists })
			.then(response => response.data as { success: boolean } | { error: string })
		if ("error" in data) {
			if (data.error === "Token expired") {
				auth.refresh()
				addTournament()
			} else
				setError(data.error)
			return
		}
		setOpen(false)
		setName("")
		setRounds(6)
		setTarget(501)
		setLegs(3)
		setSets(1)
		setKo(false)
		setFinalists(8)
		reload()
	}

	const reload = async () => {
		setTournaments(await loadTournaments())
	}

	useEffect(() => {
		setError(undefined);
	}, [name])

	return (
		<>
			<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
				<DialogTitle>Add new Tournament</DialogTitle>
				<DialogContent>
					<Grid container spacing={3} sx={{ mt: 0 }}>
						<Grid item sm={12}>
							<TextField
								autoFocus
								value={name}
								id="name"
								label="Name"
								fullWidth
								onChange={(e) => setName(e.target.value)}
							/>
						</Grid>
						<Grid item>
							<TextField
								value={rounds}
								id="rounds"
								label="Rounds"
								type="number"
								fullWidth
								onChange={(e) => setRounds(Number(e.target.value))}
							/>
						</Grid>
						<Grid item>
							<TextField
								value={target}
								id="target"
								label="Target"
								type="number"
								fullWidth
								onChange={(e) => setTarget(Number(e.target.value))}
							/>
						</Grid>
						<Grid item>
							<TextField
								value={legs}
								id="legs"
								label="Legs"
								type="number"
								fullWidth
								onChange={(e) => setLegs(Number(e.target.value))}
							/>
						</Grid>
						<Grid item>
							<TextField
								value={sets}
								id="sets"
								label="Sets"
								type="number"
								fullWidth
								onChange={(e) => setSets(Number(e.target.value))}
							/>
						</Grid>
						<Grid item sm={12}>
							<FormControlLabel control={<Checkbox
								value={ko}
								id="ko"
								onChange={(e, value) => setKo(value)}
							/>} label="Ko" />
						</Grid>
						{ko && <Grid item>
							<TextField
								value={finalists}
								id="finalists"
								label="Finalists"
								type="number"
								fullWidth
								onChange={(e) => setFinalists(Number(e.target.value))}
							/>
						</Grid>}
						{error && <Grid item lg={12}><Alert sx={{ mt: 3 }} severity="error">{error}</Alert></Grid>}
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button onClick={addTournament}>Add</Button>
				</DialogActions>
			</Dialog>
			<Button onClick={() => setOpen(true)}>+ Add Tournament</Button>
			{tournaments.sort((a, b) => a.name.localeCompare(b.name))
				.map((tournament, index) => <TournamentEntry key={index} {...tournament} reloadCB={reload} />)}
		</>
	)
}