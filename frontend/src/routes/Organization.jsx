import Nav from "../components/Nav"
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import bgElement from "/background/background-new.png"
import bgCirle from "/background/background-cricle.png"
import NavUser from "../components/NavUser"

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

                <h1 className="relative z-10 text-white text-5xl font-bold text-center mt-24 mb-12">Членове</h1>

                <div className="m-6 flex gap-6">
                    {
                       members.map((member) => {
                            return <NavUser key={member.id} name={member.name} image={member.pfp} role={member.role}/>
                          }) 
                    }

                    {role == "owner" &&
                    <div onClick={() => {navigate(`/users/add?id=${organizationId}`)}} className="flex text-center relative z-10 flex-col items-center justify-center bg-[#ffffff20] p-5 w-[160px] h-[260px] rounded-xl cursor-pointer text-xl hover:scale-105 active:scale-100 duration-100 border-black border">
                        <h1 className="text-white select-none">Добави нов член</h1>
                    </div>}
                    
                    <img src={bgElement} className="absolute z-0 top-0 left-0 w-full" alt="" />
                    <img src={bgCirle} className="absolute z-0 top-0 right-0" alt="" />
                </div> 
            </>
        )
    }
}