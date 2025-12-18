import { useEffect } from 'react';
import api from './services/api';

function App() {
	useEffect(() => {
		api.get('/health').then(res => console.log(res.data));
	}, []);

	return <h1>ATS Resume Builder</h1>;
}

export default App;
