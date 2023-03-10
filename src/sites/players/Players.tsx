import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import { usePlayers } from "../../hooks/usePlayers";
import { PlayerEntry } from "./PlayerEntry";

export function Players() {
	const [open, setOpen] = useState(false);
	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const { players, addPlayer } = usePlayers()

	const [error, setError] = useState<string | undefined>()

	const { setPath } = useBreadcrumbs()

	useEffect(() => {
		setPath([{ name: "Home", href: "/" }, { name: "Players", href: "/players" }])
	}, [setPath])

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
					<Button onClick={() => {
						if (firstName === "" || lastName === "")
							return
						addPlayer({ firstName, lastName })
						setOpen(false)
						setFirstName("")
						setLastName("")
					}}>Add</Button>
				</DialogActions>
			</Dialog>
			<Button onClick={() => setOpen(true)}>+ Add Player</Button>
			{players.sort((a, b) => {
				const a_perc = isNaN(a.legs_won / (a.legs_won + a.legs_lost)) ? 0 : a.legs_won / (a.legs_won + a.legs_lost)
				const b_perc = isNaN(b.legs_won / (b.legs_won + b.legs_lost)) ? 0 : b.legs_won / (b.legs_won + b.legs_lost)
				return b_perc - a_perc
			})
				.map((player, index) => <PlayerEntry key={index} {...player} />)}
		</>
	)
}