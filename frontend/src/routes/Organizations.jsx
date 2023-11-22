import { useState, useEffect } from "react"
import axios from "axios"
import Organization from "../components/Organization"

export default function Organizations() {
    let [organizations, setOrganizations] = useState([
        {
            id: 1,
            name: "Test Organization One",
            members: ["ivan.stoychev10@gmail.com"],
            owner: "ivan.stoychev10@gmail.com"
        },
        {
            id: 2,
            name: "Test Organization Two",
            members: ["craft0289@gmail.com", "ivan.stoychev10@gmail.com"],
            owner: "ivan.stoychev10@gmail.com"
        },
    ])

    let [userData, setUserData] = useState(null)

    useEffect(() => { 
        axios.get('http://localhost:8000/user', { withCredentials: true })
        .then((res) => {
            setUserData(res.data)
        })
    }, [])

    return (
        <>
            <div className="grid grid-cols-3 place-items-center h-screen">
                {
                    organizations.map((organization) => {
                        return userData != null && organization.members.includes(userData.email) && <Organization id={organization.id} key={organization.id} name={organization.name} />
                    })
                }

                <div className="flex gap-5 flex-col items-center justify-center bg-background-200 p-5 w-2/3 h-2/3 rounded-xl cursor-pointer text-xl hover:scale-105 active:scale-100 duration-100">
                    <h1>Create New Project+</h1>
                </div>
            </div>
        </>
    )
}