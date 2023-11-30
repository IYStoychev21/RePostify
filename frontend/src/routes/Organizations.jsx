import axios from "axios"
import Organization from "../components/Organization"
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import bgElement from "/background/background-new.png"
import bgCirle from "/background/background-cricle.png"

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
            <div className="bg-background-gray relative overflow-hidden">
                <h1 className="relative z-10 text-white text-5xl font-bold text-center mt-24">Организации</h1>

                <div className="grid grid-cols-6 place-items-center h-screen">
                    {
                    organizations.map((organization) => {
                            if(organization){
                                return <Organization id={organization.id} key={organization.id} name={organization.name} />
                            }
                        })
                    }

                    <div onClick={() => {navigation("/organization/create")}} className="flex text-center relative z-10 flex-col items-center justify-center bg-[#ffffff20] p-5 w-[160px] h-[260px] rounded-xl cursor-pointer text-xl hover:scale-105 active:scale-100 duration-100 border-black border">
                        <h1 className="text-white">Създай нова организация</h1>
                    </div>

                    <img src={bgElement} className="absolute z-0 top-0 left-0 w-full" alt="" />
                    <img src={bgCirle} className="absolute z-0 top-0 right-0" alt="" />
                </div>
            </div>
        </>
    )
}