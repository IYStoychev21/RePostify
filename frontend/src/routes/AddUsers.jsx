import { useSearchParams } from 'react-router-dom'
import NewMember from '../components/NewMember'
import { useState } from 'react'
import backArrow from "/icon/back-arrow.svg"
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'

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

export default function AddUsers() {
    let [queryParam] = useSearchParams()
    let [membersEntries, setMembersEntries] = useState([])
    let navigate = useNavigate()

    let organizationId = null
    organizationId = queryParam.get("id")

    const addNewMember = () => {
        setMembersEntries([...membersEntries, new Member()])
    }

    const removeMember = (index) => {
        let temp = [...membersEntries]
        temp.splice(index, 1)
        setMembersEntries(temp)
    }

    const submitForm = (event) => {
        event.preventDefault()

        console.log(membersEntries)
        
        axios.post(`http://localhost:8000/organisation/member/add/${organizationId}`, {"members":membersEntries}, {withCredentials: true}).then((res) => {
            navigate(`/organization?id=${organizationId}`)
        }).catch((err) => {
            toast.error(err.response.data.detail)
        })
    }

    if(organizationId == null) {
        navigate("/organizations")
    } else {
        return (
            <>
                <div>
                    <div className="text-3xl font-light ml-4 relative">
                        <img onClick={() => window.history.back()} className="mt-3 hover:scale-105 absolute active:scale-100 cursor-pointer duration-100" width="80" src={backArrow} alt="" />
                    </div>

                    <div className="flex flex-col h-screen justify-center items-center">
                        <form className="flex flex-col w-1/3 p-8 gap-5 bg-background-200 rounded-md" method="post" onSubmit={submitForm}>
                            <div className="flex flex-col gap-4">
                                {
                                    membersEntries.map((member, index) => {
                                        return <NewMember key={index} getEmail={(event) => member.gatherEmail(event)} getRole={(event) => member.gatherRole(event)} removeMember={() => removeMember(index)}/>
                                    })
                                }
                            </div>

                            <button onClick={addNewMember} className="rounded-md bg-accent-200 p-2 hover:scale-105 hover:bg-accent-300 active:scale-100 duration-100"> Add New Entry </button>
                            <button type="submit" className="p-3 bg-secondary-600 duration-100 hover:scale-105 hover:bg-secondary-700 active:scale-100 rounded-md">Add New Member</button>
                        </form>
                    </div>
                </div> 
                <ToastContainer />
            </>
        )
    }
}