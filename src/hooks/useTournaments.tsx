import { createContext, ReactNode, useContext } from "react"
import { useLocalStorage } from "./useStorage"

export type TournamentType = {
	uid: number,
	name: string,
	members: number[],
	playType: string,
	rounds: number,
	legs: number,
	ko: boolean,
	finalists: number,
	started: boolean,
	data: {
		tree: string,
		open: {
			games: {
				uid: number,
				players: [number, number]
			}[]
		}[],
		closed: {
			uid: number,
			players: [
				{
					uid: number,
					legs: number
				}, {
					uid: number,
					legs: number
				}
			]
		}[]
	}
}

type TournamentSetup = {
	name: string,
	playType: string,
	rounds: number,
	legs: number,
	ko: boolean,
	finalists: number,
}

const TournamentsContext = createContext<{
	tournaments: TournamentType[],
	addTournament: (tournament: TournamentSetup) => void,
	editTournament: (tournament: TournamentType | ((t: TournamentType) => TournamentType)) => void,
	getTournament: (uid: number) => TournamentType | undefined,
	removeTournament: (uid: number) => void
}>({
	tournaments: [],
	addTournament: (tournament: TournamentSetup) => { },
	editTournament: (tournament: TournamentType | ((t: TournamentType) => TournamentType)) => { },
	getTournament: (uid: number) => undefined,
	removeTournament: (uid: number) => { },
})

export const useTournaments = () => useContext(TournamentsContext)

export function TournamentsProvider({ children }: { children: ReactNode }) {
	const [tournaments, setTournaments] = useLocalStorage<TournamentType[]>("tournaments", [])

	const addTournament = (tournament: TournamentSetup) => {
		setTournaments(tournaments => [...tournaments,
		{
			uid: Date.now(),
			members: [],
			started: false,
			data: { tree: "", open: [], closed: [] },
			...tournament
		}])
	}

	const editTournament = (tournament: TournamentType | ((t: TournamentType) => TournamentType)) => {
		if (typeof tournament === "function")
			setTournaments(tournaments => tournaments.map(t => t.uid === tournament(t).uid
				? tournament(t)
				: t
			))
		else
			setTournaments(tournaments => tournaments.map(t => t.uid === tournament.uid
				? tournament
				: t
			))
	}

	const getTournament = (uid: number) => {
		const tournament = tournaments.filter(t => t.uid === uid)
		if (tournament.length === 0)
			return undefined
		return tournament[0]
	}

	const removeTournament = (uid: number) => {
		setTournaments(tournaments => tournaments.filter(tournament => tournament.uid !== uid))
	}

	return (
		<TournamentsContext.Provider value={{ tournaments, addTournament, editTournament, getTournament, removeTournament }}>
			{children}
		</TournamentsContext.Provider>
	)
}