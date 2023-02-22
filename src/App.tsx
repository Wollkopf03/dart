import { Logout } from "@mui/icons-material";
import { AppBar, Container, createTheme, Grid, IconButton, Paper, Tab, Tabs, ThemeProvider, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "./hooks/useAuth";

export function App() {
	const [site, setSite] = useState(window.location.pathname.substring(1))
	const navigate = useNavigate()
	const auth = useAuth()

	useEffect(() => {
		if (!localStorage.getItem('token') && window.location.pathname !== "/login")
			navigate("/login", { replace: true })
		else if (localStorage.getItem('token') && window.location.pathname === "/login")
			navigate("/", { replace: true })
	})

	return (
		<ThemeProvider theme={createTheme()}>
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
				<Grid sx={{ display: 'flex' }}>
					<Tooltip title="Logout">
						<IconButton onClick={auth.logout}>
							<Logout sx={{ color: "#ff0000" }} />
						</IconButton>
					</Tooltip>
					<Tabs value={site} onChange={(_event, value) => {
						setSite(value)
						navigate("/" + (value || ""))
					}}>
						<Tab label="Home" value="" />
						<Tab label="Players" value="players" />
						<Tab label="Tournaments" value="tournaments" />
					</Tabs>
				</Grid>
			</AppBar>
			<Container sx={{ my: 8 }}>
				<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
					<Outlet />
				</Paper>
			</Container>
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
		</ThemeProvider>
	)
}