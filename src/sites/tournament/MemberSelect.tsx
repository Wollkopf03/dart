import { Checkbox, FormControlLabel, FormGroup, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { PlayerType } from '../../hooks/usePlayers';
import { TournamentType, useTournaments } from '../../hooks/useTournaments';
import { useUpdateEffect } from '../../hooks/useUpdateEffect';

type Props = {
	players: PlayerType[],
	uid: number,
	setTournament: React.Dispatch<React.SetStateAction<TournamentType>>
}

export function MemberSelect({ players, uid, setTournament }: Props) {
	const { getTournament } = useTournaments()
	const [members, setMembers] = useState<number[]>(
		players
			.filter(player => getTournament(uid)?.members.indexOf(player.uid) !== -1)
			.map(player => player.uid)
	)


	useUpdateEffect(() => {
		setTournament(t => { return { ...t, members } })
	}, [members])

	const change = (uid: number) => {
		if (members.indexOf(uid) === -1)
			setMembers([...members, uid])
		else
			setMembers([...members].filter(member => member !== uid))
	}

	return (
		<Paper variant='outlined' sx={{ p: 3, mt: 4, minWidth: "max-content" }}>
			<Typography variant="h6" sx={{}}>Members:</Typography>
			{players.map((player, index) =>
				<FormGroup key={index}>
					<FormControlLabel control={
						<Checkbox onClick={() => change(player.uid)} checked={members.indexOf(player.uid) !== -1} />
					} label={player.lastName + ", " + player.firstName} />
				</FormGroup>
			)}
		</Paper>
	);
}