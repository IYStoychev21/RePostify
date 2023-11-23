import axios from "axios"
import Organization from "../components/Organization"
import useFetch from "../hooks/useFetch"
import { useEffect, useState } from "react"

export default function Organizations() {
    let user = useFetch("http://localhost:8000/user")
    let [organizations, setOrganizations] = useState([])
 
    useEffect(() => { 
        axios.get("http://localhost:8000/user/organisations/1", {withCredentials: true}).then((res) => {
            res.data.map((org) => {
                axios.get(`http://localhost:8000/organisation/${org.oid}`, {withCredentials: true}).then((response) => {
                    console.log(response.data)
                    setOrganizations((prev) => [...prev, response.data])
                })
            })
        })
    }, [])

    return (
        <>
            <div className="grid grid-cols-3 place-items-center h-screen">
                {
                   organizations.map((organization) => {
                        if(organization){
                            return <Organization id={organization.id} key={organization.id} name={organization.name} />
                        }
                    })
                }

                <div onClick={() => {window.location.href = "/neworganization"}} className="flex gap-5 flex-col items-center justify-center bg-background-200 p-5 w-2/3 h-2/3 rounded-xl cursor-pointer text-xl hover:scale-105 active:scale-100 duration-100">
                    <h1>Create New Organization+</h1>
                </div>
            </div>
        </>
    )
}