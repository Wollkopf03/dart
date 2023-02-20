import { createRoot } from 'react-dom/client';
import { Root } from './Root';

export const API_BASE_URL = "https://api.mcs-rbg.de/dart/"

createRoot(document.getElementById('root') as HTMLElement).render(
	<Root />
);
