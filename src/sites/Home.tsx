import { Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router";

export const Home = () => {
	const navigate = useNavigate()

	return (
		<Grid container spacing={3}>
			<Grid item sm={6}>
				<Paper variant="outlined" sx={{ p: 3 }} onClick={() => navigate("/players")}>
					<Typography variant="h3">Players</Typography>
				</Paper>
			</Grid>
			<Grid item sm={6} sx={{ mb: 1, height: "max-content" }}>
				<Paper variant="outlined" sx={{ p: 3 }} onClick={() => navigate("/tournaments")}>
					<Typography variant="h3">Tournaments</Typography>
				</Paper>
			</Grid>
		</Grid>
	)
}