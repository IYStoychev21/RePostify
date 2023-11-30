import axios from "axios"
import { useState } from "react"
import NewMember from "../components/NewMember"
import useFetch from "../hooks/useFetch"
import backArrow from "/icon/back-arrow.svg"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
import bgElement from "/background/background-new.png"
import bgCirle from "/background/background-cricle.png"

class Member {
    constructor() {
        this.email = null
        this.role = "user"
    }

    gatherEmail(event) {
        this.email = event.target.value
    }

    gatherRole(event) {
        this.role = event.target.value
    }
}

export default function NewOrganization() {
    let [name, setName] = useState(null)
    let [membersEntries, setMembersEntries] = useState([])
    let userData = useFetch('http://localhost:8000/user')
    let naviagte = useNavigate()
    
    const getNameOnChange = (event) => {
        setName(event.target.value)
    }

    const createOrganization = (event) => {
        event.preventDefault()

        let data = {
            name: name,
            members: membersEntries,
            owner: userData.data.email
        }

        axios.post('http://localhost:8000/organisation/create', data, {withCredentials: true}).then(() => {
            naviagte("/organizations")
        }).catch((err) => {
            toast.error(err.response.data.detail)
        })
    }

    const addNewMember = () => {
        setMembersEntries([...membersEntries, new Member()])
    }

    const removeMember = (index) => {
        let temp = [...membersEntries]
        temp.splice(index, 1)
        setMembersEntries(temp)
    }

    return (
        <>
            <div className="overflow-hidden">
                {/* <div className="text-3xl font-light m-4 relative">
                    <h1 className="uppercase">new organisation</h1>
                    <img onClick={() => window.history.back()} className="mt-3 hover:scale-105 absolute active:scale-100 cursor-pointer duration-100" width="80" src={backArrow} alt="" />
                </div> */}

                <div className="flex overflow-hidden flex-col h-screen justify-center items-center bg-background-gray relative">
                    <form className="z-10 flex flex-col w-3/5 rounded-xl py-16 px-32 gap-5 bg-[#ffffff20]" onSubmit={createOrganization} method="post">

                        <input type="text" onChange={getNameOnChange} className="w-full p-2 rounded-md" placeholder="ИМЕ НА ОРГАНИЗАЦИЯ" name="name" id="name" required/> 

                        <div className="flex flex-col gap-4">
                            {
                                membersEntries.map((member, index) => {
                                    return <NewMember key={index} getEmail={(event) => member.gatherEmail(event)} getRole={(event) => member.gatherRole(event)} removeMember={() => removeMember(index)}/>
                                })
                            }
                        </div>

                        <button onClick={addNewMember} className="rounded-md bg-gradient-to-r from-[#7700A0] to-[#E40045] p-2 hover:scale-105 hover:bg-accent-300 active:scale-100 duration-100"> Добави нов член </button>
                        <button type="submit" className="p-3 bg-gradient-to-r from-[#7700A0] to-[#E40045] duration-100 hover:scale-105 hover:bg-secondary-700 active:scale-100 rounded-md uppercase">Създай нова организация</button>

                    </form>

                    <img src={bgElement} className="absolute z-0 top-0 left-0 w-full" alt="" />
                    <img src={bgCirle} className="absolute z-0 top-0 right-0" alt="" />
                </div>
            </div>
            <ToastContainer />
        </>
    )
}