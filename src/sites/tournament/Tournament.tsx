import { Alert, Box, Button, Checkbox, FormControlLabel, Grid, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import { usePlayers } from "../../hooks/usePlayers";
import { TournamentType, useTournaments } from "../../hooks/useTournaments";
import { useUpdateEffect } from "../../hooks/useUpdateEffect";
import { MemberSelect } from "./MemberSelect";
import { Started } from "./Started";


class Duel {

	player1: PlayerType | Duel
	player2?: PlayerType | Duel
	leftBalance: number
	rightBalance?: number

	constructor(player1: PlayerType | Duel, player2?: PlayerType | Duel) {
		this.player1 = player1
		this.player2 = player2

		if (Duel.isDuel(player1))
			this.leftBalance = player1.bestBalance()
		else {
			this.leftBalance = player1.won / (player1.won + player1.lost)
		}
		if (player2)
			if (Duel.isDuel(player2))
				this.leftBalance = player2.bestBalance()
			else
				this.rightBalance = player2.won / (player2.won + player2.lost)
	}

	static isDuel(duel: PlayerType | Duel): duel is Duel {
		return !("uid" in duel)
	}

	bestBalance() {
		if (!this.rightBalance)
			return this.leftBalance
		return this.leftBalance > this.rightBalance ? this.leftBalance : this.rightBalance
	}

	toString() {
		let duel1 = ""
		let duel2 = ""

		if (Duel.isDuel(this.player1))
			duel1 = this.player1.toString()
		else
			duel1 = "" + this.player1.uid
		if (this.player2) {
			if (Duel.isDuel(this.player2))
				duel2 = this.player2.toString()
			else
				duel2 = "" + this.player2.uid
			return `{${duel1},${duel2}}`
		}
		return duel1
	}
}
type PlayerType = { uid: number, won: number, lost: number }

function recursivelyBuildTree(duels: Duel[]): string {
	const thisRound: Duel[] = []

	const lastRound = duels.sort((a, b) => b.bestBalance() - a.bestBalance())

	for (let i = 0; i < lastRound.length / 2; i++)
		thisRound.push(new Duel(lastRound[i], lastRound[lastRound.length - i - 1]))

	if (thisRound.length > 1)
		return recursivelyBuildTree(thisRound)
	else
		return thisRound[0].toString()
}

export function Tournament() {
	const params = useParams()
	const { setPath } = useBreadcrumbs()
	const { getTournament, editTournament } = useTournaments()
	const { players } = usePlayers()
	const [tournament, setTournament] = useState<TournamentType>(getTournament(Number(params["uid"]))!)
	const [error, setError] = useState<string | undefined>()

	useEffect(() => {
		setPath([{ name: "Home", href: "/" }, { name: "Tournaments", href: "/tournaments" }, { name: tournament.name, href: "/tournament/" + tournament.uid }])
	}, [tournament, setPath])

	useUpdateEffect(() => {
		console.log("hi")
		setError("")
		if (tournament.name === "")
			setError("name can't be empty")
		else if (tournament.rounds < 1)
			setError("rounds can't be below 1")
		else if (tournament.legs < 1)
			setError("legs can't be below 1")
		else if (tournament.ko && tournament.finalists < 2)
			setError("finalists must greater than 2")
		else
			editTournament(tournament)
		if (tournament.data.tree === "" && tournament.started && tournament.data.open.length === 0)
			generateTree()
	}, [tournament])

	const generateGames = () => {
		let uid = 0;
		const games: { games: { uid: number, players: [number, number] }[] }[] = []
		const players = [...tournament!.members]
		if (players.length % 2 === 1)
			players.push(-1)
		for (let roundNr = 1; roundNr < players.length; roundNr++) {
			const round: { uid: number, players: [number, number] }[] = []
			for (let i = 0; i < players.length / 2; i++)
				if (players[i] !== -1 && players[players.length - 1 - i] !== -1)
					round.push({ uid: uid++, players: [players[i], players[players.length - 1 - i]] });
			games.push({ games: round })
			players.push(players.splice(1, 1)[0])
		}
		return games
	}

	function generateTree() {
		if (!tournament)
			return
		var players = tournament.members.map(uid => { return { uid, won: 0, lost: 0 } })

		tournament.data.closed.forEach(duel => {
			players = players.map(player => {
				if (player.uid === duel.players[0].uid)
					return {
						uid: player.uid,
						won: player.won + duel.players[0].legs,
						lost: player.lost + duel.players[1].legs
					}
				else if (player.uid === duel.players[1].uid)
					return {
						uid: player.uid,
						won: player.won + duel.players[1].legs,
						lost: player.lost + duel.players[0].legs
					}
				else
					return player
			})
		})
		players = players.sort((a, b) => b.won / (b.won + b.lost) - a.won / (a.won + a.lost))

		if (tournament.finalists < players.length)
			players = players.slice(0, tournament.finalists)

		const wildCards = players.splice(0, Math.pow(2, Math.log2(players.length) + (Math.log2(players.length) % 1 === 0 ? 0 : 1 - Math.log2(players.length) % 1)) - players.length)

		const duels: Duel[] = []

		for (let i = 0; i < players.length / 2; i++)
			duels.push(new Duel(players[i], players[players.length - i - 1]))

		duels.push(...wildCards.map(player => new Duel(player)))

		tournament.data.tree = recursivelyBuildTree(duels)
		setTournament(tournament)
	}

	const start = () => {
		setTournament({ ...getTournament(Number(params["uid"]))!, started: true, data: { ...tournament.data, open: generateGames() } })
	}

	return (
		<>
			<Box display="flex" position="relative">
				<Typography variant="h4">{tournament?.name}</Typography>
				<Box position="absolute" right={0}>
					<Typography>{new Date(tournament?.uid! * 1000).toLocaleDateString()}</Typography>
					<Typography align="right">{new Date(tournament?.uid! * 1000).toLocaleTimeString()}</Typography>
				</Box>
			</Box>
			{tournament?.started
				? <Started tournament={tournament} setTournament={setTournament} />
				: <>
					<Button variant="contained" sx={{ p: 1, mt: 2 }} fullWidth onClick={start}>Start</Button>
					{players.length > 0 && tournament &&
						<Box display="flex">
							<MemberSelect players={players} uid={tournament.uid} setTournament={setTournament} />
							<Grid container spacing={3} sx={{ ml: 1, mt: 1 }}>
								<Grid item sm={12}>
									<TextField
										value={tournament.name}
										id="name"
										label="Name"
										fullWidth
										onChange={(e) => setTournament({ ...tournament, name: e.target.value })}
									/>
								</Grid>
								<Grid item>
									<TextField
										value={tournament.legs}
										id="legs"
										label="Legs"
										type="number"
										fullWidth
										onChange={(e) => setTournament({ ...tournament, legs: Number(e.target.value) })}
									/>
								</Grid>
								<Grid item sm={12}>
									<ToggleButtonGroup
										color="primary"
										value={tournament.playType}
										exclusive
										onChange={(e, value) => setTournament({ ...tournament, playType: value })}
									>
										<ToggleButton value="swissSystem">Swiss System</ToggleButton>
										<ToggleButton value="roundRobin">Round Robin</ToggleButton>
									</ToggleButtonGroup>
								</Grid>
								{tournament.playType === "swissSystem" &&
									<Grid item>
										<TextField
											value={tournament.rounds}
											id="rounds"
											label="Rounds"
											type="number"
											fullWidth
											onChange={(e) => setTournament({ ...tournament, rounds: Number(e.target.value) })}
										/>
									</Grid>
								}
								<Grid item sm={12}>
									<FormControlLabel control={<Checkbox
										checked={tournament.ko}
										id="ko"
										onChange={(e, value) => setTournament({ ...tournament, ko: value })}
									/>} label="Ko" />
								</Grid>
								{tournament.ko && <Grid item>
									<TextField
										value={tournament.finalists}
										id="finalists"
										label="Finalists"
										type="number"
										fullWidth
										onChange={(e) => setTournament({ ...tournament, finalists: Number(e.target.value) })}
									/>
								</Grid>}
								{error && <Grid item sm={12}>
									<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
										<Grid item lg={12}><Alert severity="error">{error}</Alert></Grid>
									</Box>
								</Grid>}
							</Grid>
						</Box>
					}
				</>
			}
		</>
	)
}