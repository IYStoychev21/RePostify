import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function Protected({children}) { 
    let [isLoggedIn, setIsLoggedIn] = useState(true);
    
    useEffect(() => {
        axios.get('http://localhost:3000/token', {withCredentials: true}).then((response) => {
            if (response.data.length === 0) {
                setIsLoggedIn(false)
            }
        })
    }, [])

    
    if(!isLoggedIn)
        return <Navigate to="/"/>


    return children
}