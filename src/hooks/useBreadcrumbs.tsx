import { createContext, ReactNode, useState, useContext } from "react"

export type Path = {
	name: string,
	href: string
}[]

const BreadcrumbsContext = createContext({
	path: [{ name: "Home", href: "/" }],
	setPath: (path: Path) => { }
})

export function useBreadcrumbs() {
	return useContext(BreadcrumbsContext)
}

type Props = { children: ReactNode }

export function BredcrumbsProvider({ children }: Props) {
	const [path, setPath] = useState<Path>([{ name: "Home", href: "/" }])

	return (
		<BreadcrumbsContext.Provider value={{ path, setPath }}>
			{children}
		</BreadcrumbsContext.Provider>
	)
}