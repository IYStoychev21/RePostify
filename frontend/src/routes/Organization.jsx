import Nav from "../components/Nav"
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from "react"
import NavUser from "../components/NavUser"
import { useNavigate } from 'react-router-dom'

export default function Organization() {
    let [queryParam] = useSearchParams()
    let [role, setRole] = useState(null)
    let [userData, setUserData] = useState(null)
    let [members, setMembers] = useState([])
    let navigate = useNavigate()

    let organizationId = null
    organizationId = queryParam.get("id")

    useEffect(() => {
        axios.get('http://localhost:8000/user', {withCredentials: true}).then((res) => {
            setUserData(res.data)
        })
    }, [])

    useEffect(() => {
        if(userData){
            axios.get(`http://localhost:8000/user/organisations/${userData.id}`, {withCredentials: true}).then((res) => {
                res.data.map(org => {
                    if(org.oid == organizationId){
                        setRole(org.role)
                    }
                })
            })
        }
    }, [userData]) 

    useEffect(() => {
        if(organizationId) {
            axios.get(`http://localhost:8000/organisation/members/${organizationId}`, {withCredentials: true}).then((res) => {
                setMembers(res.data.users)
            })
        }
    }, [])

    if(organizationId == null) {
        navigate("/organizations")
    } else {
        return (
            <>
                <Nav organizationId={organizationId} />

                <div className="m-6 flex gap-6">
                    {
                       members.map((member) => {
                            return <NavUser key={member.id} name={member.name} image={member.pfp} role={member.role}/>
                          }) 
                    }

                    {role == "owner" && <div> <h1 onClick={() => {navigate(`/users/add?id=${organizationId}`)}} className="py-4 px-8 hover:scale-105 select-none cursor-pointer active:scale-100 duration-100 font-thin border-background-950 border w-fit">Add Users +</h1></div>}
                </div> 
            </>
        )
    }
}