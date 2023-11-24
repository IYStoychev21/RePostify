import NavElement from "./NavElement";
import NavUser from "./NavUser"
import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Nav(props) {
    let [userData, setUserData] = useState(null)
    let [role, setRole] = useState(null)

    useEffect(() => {
        axios.get('http://localhost:8000/user', {withCredentials: true}).then((res) => {
            setUserData(res.data)
        })
    }, [])

    useEffect(() => {
        if(userData){
            axios.get(`http://localhost:8000/user/organisations/${userData.id}`, {withCredentials: true}).then((res) => {
                res.data.map(org => {
                    if(org.oid == props.organizationId){
                        setRole(org.role)
                    }
                })
            })
        }
    }, [userData]) 

    return (
        <>
            <div className="flex h-20 shadow-md">
                <div className="flex gap-5 ml-6 h-full items-center">
                    <NavElement text="ORGANIZATIONS" handleClick={() => window.location.href = "http://localhost:5173/organizations"}/>
                    <div className="w-0.5 h-2/5 bg-text-300"></div>
                    <NavElement text="ORGANIZATION" handleClick={() => window.location.href = "http://localhost:5173/organization"}/>
                </div>

                <div className="absolute right-[20px] py-2">
                    {userData && <NavUser name={userData.name} image={userData.pfp} role={role} />}
                </div>
            </div>
        </>
    )
}