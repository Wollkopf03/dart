import { DependencyList, EffectCallback, useEffect, useRef } from "react"

export function useUpdateEffect(callback: EffectCallback, dependencies: DependencyList) {
	const firstRenderRef = useRef(true)
	useEffect(() => {
		if (firstRenderRef.current)
			firstRenderRef.current = false
		else
			return callback()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies)
} 