import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useBreadcrumbs } from "./hooks/useBreadcrumbs";

export const DisplayBreadcrumbs = () => {
	const { path } = useBreadcrumbs()

	return (
		<Breadcrumbs sx={{ m: 1 }}>
			{path.map((entry, index) => index !== path.length - 1
				? <Link key={index} underline="hover" color="inherit" href={entry.href}>{entry.name}</Link>
				: <Typography key={index} color="text.primary">{entry.name}</Typography>)}
		</Breadcrumbs>
	)
}