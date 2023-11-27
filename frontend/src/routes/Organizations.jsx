import axios from "axios"
import Organization from "../components/Organization"
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'

export default function Organizations() {
    let [user, setUser] = useState(null)
    let [organizations, setOrganizations] = useState([])
    let [organizationsBridge, setOrganizationsBridge] = useState([])
    let navigation = useNavigate()

    useEffect(() => {
        axios.get('http://localhost:8000/user', {withCredentials: true}).then((res) => {
            setUser(res)
        })
    }, [])
 
    useEffect(() => { 
        if(user && user.data){
            axios.get(`http://localhost:8000/user/organisations/${user.data.id}`, {withCredentials: true}).then((res) => {
                setOrganizationsBridge(res.data)
            })
        }
    }, [user])

    useEffect(() => {
        if(organizationsBridge && organizationsBridge.length != 0) {
            organizationsBridge.map((org) => {
                axios.get(`http://localhost:8000/organisation/${org.oid}`, {withCredentials: true}).then((response) => {
                    setOrganizations((prev) => [...prev, response.data])
                })
            })
        }
    }, [organizationsBridge])

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

                <div onClick={() => {navigation("/organization/create")}} className="flex gap-5 flex-col items-center justify-center bg-background-200 p-5 w-2/3 h-2/3 rounded-xl cursor-pointer text-xl hover:scale-105 active:scale-100 duration-100">
                    <h1>Create New Organization+</h1>
                </div>
            </div>
        </>
    )
}