import NavElement from "./NavElement";
import NavUser from "./NavUser"
import { useEffect, useState } from "react";
import axios from "axios";

export default function Nav(props) {
    return (
        <>
            <div className="flex h-20 justify-end gap-8 relative z-10">
                <div className="flex gap-6 ml-6 h-full items-center">
                    <NavElement text="home" handleClick={() => window.location.href = `http://localhost:5173/home?id=${props.organizationId}`}/>
                    <NavElement text="organisations" handleClick={() => window.location.href = "http://localhost:5173/organizations"}/>
                    <NavElement text="this organisation" handleClick={() => window.location.href = `http://localhost:5173/organization?id=${props.organizationId}`}/>
                </div>

                <div className="p-5 flex justify-center">
                    <button onClick={() => window.location.href = "/profile"} className="border-2 text-white p-4 px-16 hover:scale-105 active:scale-100 duration-100 flex justify-center items-center border-gray">My Account</button>
                </div>
            </div>
        </>
    )
}