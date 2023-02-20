import { Alert, Box, Button, Container, FormControl, Grid, InputLabel, OutlinedInput, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function Login() {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState<string | undefined>()

	const auth = useAuth()

	useEffect(() => {
		setError(undefined);
	}, [username, password])

	return (
		<Container maxWidth="sm" sx={{ mb: 8 }}>
			<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
				<Typography component="h1" variant="h4" align="center">
					{process.env.REACT_APP_NAME}
				</Typography>
				<Typography variant="h5" gutterBottom>
					Login
				</Typography>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={12}>
						<TextField
							required
							id="username"
							name="username"
							label="Name"
							fullWidth
							placeholder="Max Mustermann"
							onChange={e => setUsername(e.target.value)}
							value={username}
						/>
					</Grid>
					<Grid item xs={12} sm={12}>
						<FormControl fullWidth variant="outlined">
							<InputLabel htmlFor="password">Password *</InputLabel>
							<OutlinedInput
								required
								id="password"
								type="password"
								name="password"
								label="Passwort"
								fullWidth
								placeholder="*****"
								onChange={(e) => setPassword(e.target.value)}
								value={password}
							/>
						</FormControl>
					</Grid>
				</Grid>
				<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
					{error === undefined ?
						<Button
							variant="contained"
							onClick={async () => setError(await auth.login({ username, password }))}
							sx={{ mt: 3, ml: 1 }}
						>
							Anmelden
						</Button>
						:
						<Alert sx={{ mt: 3, width: "100%" }} severity="error">{error}</Alert>
					}
				</Box>
			</Paper>
		</Container>
	)
}
