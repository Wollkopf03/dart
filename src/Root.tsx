import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "./App";
import { Home } from "./sites/Home";
import { Players } from "./sites/players/Players";
import { Tournament } from "./sites/tournament/Tournament";
import { Tournaments } from "./sites/tournaments/Tournaments";

export function Root() {
	return (
		<RouterProvider router={createBrowserRouter([{
			path: "/",
			element: <App />,
			children: [
				{ index: true, element: <Home /> },
				{ path: "/players", element: <Players /> },
				{ path: "/tournaments", element: <Tournaments /> },
				{ path: "/tournament/:uid", element: <Tournament /> }
			]
		}])} />
	)
}