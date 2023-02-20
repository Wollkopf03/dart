import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "./App";
import { Home } from "./sites/Home";
import { Login } from "./sites/Login";
import { loadPlayers, Players } from "./sites/Players";

export function Root() {
	return (
		<RouterProvider router={createBrowserRouter([{
			path: "/",
			element: <App />,
			children: [
				{ index: true, element: <Home /> },
				{ path: "/login", element: <Login /> },
				{ path: "/players", element: <Players />, loader: loadPlayers }
			]
		}])} />
	)
}