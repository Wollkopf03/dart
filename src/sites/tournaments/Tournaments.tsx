import { Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import { useTournaments } from "../../hooks/useTournaments";
import { TournamentEntry } from "./TournamentEntry";

export function Tournaments() {
	const [open, setOpen] = useState(false)
	const [name, setName] = useState("")
	const [rounds, setRounds] = useState(6)
	const [playType, setPlayType] = useState("")
	const [legs, setLegs] = useState(3)
	const [ko, setKo] = useState(false)
	const [finalists, setFinalists] = useState(8)
	const { tournaments, addTournament } = useTournaments()

	const [error, setError] = useState<string | undefined>()

	const { setPath } = useBreadcrumbs()
	useEffect(() => {
		setPath([{ name: "Home", href: "/" }, { name: "Tournaments", href: "/tournaments" }])
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const submit = () => {
		if (name === "")
			return setError("name can't be empty")
		else if (playType === "" || !playType)
			return setError("Play type can't be empty")
		else if (rounds < 1)
			return setError("rounds can't be below 1")
		else if (legs < 1)
			return setError("legs can't be below 1")
		else if (finalists < 2)
			return setError("finalists must greater than 2")
		addTournament({ name, playType, rounds, legs, ko, finalists })
		setOpen(false)
		setName("")
		setPlayType("")
		setRounds(6)
		setLegs(3)
		setKo(false)
		setFinalists(8)
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
								value={legs}
								id="legs"
								label="Legs"
								type="number"
								fullWidth
								onChange={(e) => setLegs(Number(e.target.value))}
							/>
						</Grid>
						<Grid item sm={12}>
							<ToggleButtonGroup
								color="primary"
								value={playType}
								exclusive
								onChange={(e, value) => setPlayType(value)}
							>
								<ToggleButton value="swissSystem">Swiss System</ToggleButton>
								<ToggleButton value="roundRobin">Round Robin</ToggleButton>
							</ToggleButtonGroup>
						</Grid>
						{playType === "swissSystem" && <Grid item>
							<TextField
								value={rounds}
								id="rounds"
								label="Rounds"
								type="number"
								fullWidth
								onChange={(e) => setRounds(Number(e.target.value))}
							/>
						</Grid>}
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
					<Button onClick={submit}>Add</Button>
				</DialogActions>
			</Dialog>
			<Button onClick={() => setOpen(true)}>+ Add Tournament</Button>
			{tournaments.sort((a, b) => a.name.localeCompare(b.name))
				.map((tournament, index) => <TournamentEntry key={index} {...tournament} />)}
		</>
	)
}