import axios from "axios"
import { useState, useEffect } from "react"

export default function NewOrganization() {
    let name = null
    let [userData, setUserData] = useState(null)

    const getNameOnChange = (event) => {
        name = event.target.value
    }

    useEffect(() => { 
        axios.get('http://localhost:8000/user', { withCredentials: true })
        .then((res) => {
            setUserData(res.data)
        })
    }, [])

    const createOrganization = () => {
        let data = {
            id: 2,
            name: name,
            members: [userData.email],
            owner: userData.email
        }

        console.log(data)
    }

    return (
        <>
            <div>
                <h1 className="text-3xl font-light m-4">NEW ORGANIZATION</h1>

                <div className="flex flex-col h-[80vh] justify-center items-center">
                    <div className="flex flex-col w-1/3 p-8 gap-5 bg-background-200 rounded-md">
                        <input type="text" onChange={getNameOnChange} className="w-full p-2 rounded-md" placeholder="ORGANIZATION NAME" name="name" id="name" /> 
                        <button onClick={createOrganization} className="p-3 bg-secondary-600 duration-100 hover:scale-105 hover:bg-secondary-700 active:scale-100 rounded-md">CREATE NEW ORGANIZATION</button>
                    </div>
                </div>
            </div>
        </>
    )
}