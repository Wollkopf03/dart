import { useEffect, useState } from "react";

function getSavedValue<T>(key: string, defaultValue: T, storage: Storage) {
	const savedValue = JSON.parse(storage.getItem(key)!)
	if (savedValue)
		return savedValue
	if (defaultValue instanceof Function)
		return defaultValue()
	return defaultValue
}

export function useStorage<T>(key: string, defaultValue: T | undefined, storage: Storage): [T, React.Dispatch<React.SetStateAction<T>>] {
	const [value, setValue] = useState<T>(getSavedValue(key, defaultValue, storage))

	useEffect(() => {
		storage.setItem(key, JSON.stringify(value))
	}, [key, value, storage])

	return [value, setValue]
}

export function useLocalStorage<T>(key: string, defaultValue?: T): [T, React.Dispatch<React.SetStateAction<T>>] {
	return useStorage(key, defaultValue, localStorage)
}

export function useSessionStorage<T>(key: string, defaultValue?: T): [T, React.Dispatch<React.SetStateAction<T>>] {
	return useStorage(key, defaultValue, sessionStorage)
}