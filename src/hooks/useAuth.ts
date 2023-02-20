import axios from "axios"
import jwtDecode from "jwt-decode"
import { useState } from "react"
import { useNavigate } from "react-router"

export type TokenType = {
	app: string,
	exp: number,
	user_id: number,
	user_name: string
} | null

type Credentials = {
	username: string,
	password: string
} | null

export function useAuth() {
	const [token, _setToken] = useState(localStorage.getItem('token'))
	const [credentials, _setCredentials] = useState<Credentials | null>(JSON.parse(localStorage.getItem('credentials')!))
	const navigate = useNavigate()

	const getTokenData: () => TokenType = () => token ? jwtDecode(token) : null

	const refresh = async () => {
		const data = await axios.post('https://api.mcs-rbg.de/auth/getToken/?app=dart', { ...credentials })
			.then(response => response.data as { token: string } | { error: string })
		if ("token" in data) {
			setToken(data.token);
		} else {
			clear();
			return data.error
		}
	}

	const setToken = (token: string) => {
		_setToken(token)
		localStorage.setItem('token', token)
	}

	const setCredentials = (credentials: Credentials) => {
		_setCredentials(credentials)
		localStorage.setItem('credentials', JSON.stringify(credentials))
	}

	const clear = () => {
		_setToken(null)
		_setCredentials(null)
		localStorage.clear()
	}

	const login = async (credentials: Credentials) => {
		const token = await axios.post('https://api.mcs-rbg.de/auth/getToken/?app=dart', { ...credentials })
			.then(response => response.data as { token: string } | { error: string })
		if ("token" in token) {
			setCredentials(credentials)
			setToken(token.token)
			if (window.location.pathname === "/login")
				navigate("/", { replace: true })
			return undefined
		} else {
			clear()
			return token.error
		}
	}

	const logout = () => {
		clear()
		if (window.location.pathname !== "/login")
			navigate("/login", { replace: true })
	}

	return { token, getTokenData, refresh, login, logout }
}