import { createContext, ReactNode, useContext } from "react"
import { useLocalStorage } from "./useStorage"

export type PlayerType = {
	uid: number,
	firstName: string,
	lastName: string,
	legs_won: number,
	legs_lost: number
}

type PlayerSetup = {
	firstName: string,
	lastName: string
}

const PlayersContext = createContext<{
	players: PlayerType[],
	addPlayer: (player: PlayerSetup) => void,
	getPlayer: (uid: number) => PlayerType | undefined,
	removePlayer: (uid: number) => void
}>({
	players: [],
	addPlayer: (player: PlayerSetup) => { },
	getPlayer: (uid: number) => undefined,
	removePlayer: (uid: number) => { },
})

export const usePlayers = () => useContext(PlayersContext)

export function PlayersProvider({ children }: { children: ReactNode }) {
	const [players, setPlayers] = useLocalStorage<PlayerType[]>("players")

	const addPlayer = (player: PlayerSetup) => {
		setPlayers(players => [...players, {
			uid: Date.now(),
			legs_lost: 0,
			legs_won: 0,
			...player
		}])
	}

	const getPlayer = (uid: number) => {
		const player = players.filter(p => p.uid === uid)
		return player.length === 0 ? undefined : player[0]
	}

	const removePlayer = (uid: number) => {
		setPlayers(players => players.filter(player => player.uid !== uid))
	}

	return (
		<PlayersContext.Provider value={{ players, addPlayer, getPlayer, removePlayer }}>
			{children}
		</PlayersContext.Provider>
	)
}