import axios from "axios";
import NavElement from "./NavElement";
import NavUser from "./NavUser"
import { useEffect, useState } from "react";

export default function Nav() {
    let [userData, setUserData] = useState(null)

    useEffect(() => {
        axios.get('http://localhost:8000/user', { withCredentials: true })
        .then((res) => {
            setUserData(res.data)
        })
    }, [])

    return (
        <>
            <div className="flex h-20 shadow-md">
                <div className="flex gap-5 ml-6 h-full items-center">
                    <NavElement text="HOME" handleClick={() => window.location.href = "http://localhost:5173/home"} />
                    <div className="w-0.5 h-2/5 bg-text-300"></div>

                    <NavElement text="ORGANIZATION" handleClick={() => window.location.href = "http://localhost:5173/organization"}/>
                </div>

                <div className="absolute right-[20px] py-2">
                    {userData && <NavUser name={userData.name} image={userData.picture} role="USER" />}
                </div>
            </div>
        </>
    )
}