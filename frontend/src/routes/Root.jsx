import axios from 'axios';
import { useEffect } from 'react';

export default function Root() {
    const handleLogIn = () => {
        axios.get('http://localhost:8000/login/google')
        .then((res) => {
           window.location.href = res.data.url
        })
    }

    // useEffect(() => {
    //     axios.get('http://localhost:8000/token', {withCredentials: true})
    //     .then((res) => {
    //         console.log(res)
    //     })
    // }, [])
    
    return (
        <>
            <button onClick={handleLogIn} className="p-3 bg-text-950 text-text-50 rounded-3xl">Log in with Google</button>
        </>
    )
}