import { AppBar, Container, createTheme, Grid, Paper, ThemeProvider, Typography } from "@mui/material";
import { Outlet } from "react-router";
import { DisplayBreadcrumbs } from "./DisplayBreadcrumbs";
import { BredcrumbsProvider } from "./hooks/useBreadcrumbs";
import { PlayersProvider } from "./hooks/usePlayers";
import { TournamentsProvider } from "./hooks/useTournaments";

export function App() {
	return (
		<ThemeProvider theme={createTheme()}>
			<BredcrumbsProvider>
				<AppBar
					position="relative"
					color="default"
					sx={{
						width: '100%',
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						p: 0,
						borderTop: (theme) => `1px solid ${theme.palette.divider}`,
					}}
				>
					<DisplayBreadcrumbs />
				</AppBar>
				<Container sx={{ my: 8 }}>
					<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
						<PlayersProvider>
							<TournamentsProvider>
								<Outlet />
							</TournamentsProvider>
						</PlayersProvider>
					</Paper>
				</Container>
			</BredcrumbsProvider>
			<AppBar
				position="relative"
				color="default"
				sx={{
					width: '100%',
					position: 'fixed',
					bottom: 0,
					left: 0,
					right: 0,
					p: 0,
					borderTop: (theme) => `1px solid ${theme.palette.divider}`,
				}}
			>
				<Grid sx={{ display: 'flex' }}>
					<Typography sx={{
						position: 'relative',
						left: 5,
					}} variant="h6" color="rgba(0, 0, 0, 0.5)">
						by {process.env.REACT_APP_AUTHOR}
					</Typography>
					<Typography sx={{
						position: 'fixed',
						right: 5,
					}} variant="h6" color="rgba(0, 0, 0, 0.5)">
						v{process.env.REACT_APP_VERSION}
					</Typography>
				</Grid>
			</AppBar>
		</ThemeProvider >
	)
}