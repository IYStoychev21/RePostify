import axios from "axios"
import { useState } from "react"
import NewMember from "../components/NewMember"
import useFetch from "../hooks/useFetch"
import backArrow from "/icon/back-arrow.svg"

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
            window.location.href = "/organizations"
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
            <div>
                <div className="text-3xl font-light m-4 relative">
                    <h1>NEW ORGANIZATION</h1>
                    <img onClick={() => window.history.back()} className="mt-3 hover:scale-105 absolute active:scale-100 cursor-pointer duration-100" width="80" src={backArrow} alt="" />
                </div>

                <div className="flex flex-col h-[80vh] justify-center items-center">
                    <form className="flex flex-col w-1/3 p-8 gap-5 bg-background-200 rounded-md" onSubmit={createOrganization} method="post">

                        <input type="text" onChange={getNameOnChange} className="w-full p-2 rounded-md" placeholder="ORGANIZATION NAME" name="name" id="name" required/> 
                        <div className="flex flex-col gap-4">
                            {
                                membersEntries.map((member, index) => {
                                    return <NewMember key={index} getEmail={(event) => member.gatherEmail(event)} getRole={(event) => member.gatherRole(event)} removeMember={() => removeMember(index)}/>
                                })
                            }
                        </div>

                        <button onClick={addNewMember} className="rounded-md bg-accent-200 p-2 hover:scale-105 hover:bg-accent-300 active:scale-100 duration-100"> Add New Member </button>
                        <button type="submit" className="p-3 bg-secondary-600 duration-100 hover:scale-105 hover:bg-secondary-700 active:scale-100 rounded-md">CREATE NEW ORGANIZATION</button>

                    </form>
                </div>
            </div>
        </>
    )
}