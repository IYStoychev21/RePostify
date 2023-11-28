import axios from "axios"
import OrganizationProfile from "../components/OrganizationProfile"
import { useEffect, useState } from "react"
import backArrow from "/icon/back-arrow.svg"
import { useNavigate } from 'react-router-dom'
import Modal from "react-modal"

export default function Profile() {
    let [user, setUser] = useState(null)
    let [organizations, setOrganizations] = useState([])
    let [organizationsBridge, setOrganizationsBridge] = useState([])
    let navigation = useNavigate()
    let [modalIsOpen, setModalIsOpen] = useState(false)

    useEffect(() => {
        axios.get('http://localhost:8000/user', {withCredentials: true}).then((res) => {
            setUser(res.data)
        })
    }, [])
 
    useEffect(() => { 
        if(user){
            axios.get(`http://localhost:8000/user/organisations/${user.id}`, {withCredentials: true}).then((res) => {
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

    const signOut = () => {
        axios.delete("http://localhost:8000/signout", { withCredentials: true }).then(() => {
            navigation("/")
        })
    }

    const deleteAccount = () => {
        setModalIsOpen(true)
    }
    
    const confirmDelete = () => {
        axios.delete("http://localhost:8000/user/delete", { withCredentials: true }).then(() => {
            navigation("/")
        })
    }

    const closeModal = () => {
        setModalIsOpen(false)
    }

    return (
        <>
            <div>
                <img onClick={() => window.history.back()} className="mt-3 ml-3 hover:scale-105 absolute active:scale-100 cursor-pointer duration-100" width="80" src={backArrow} alt="" />

                <div className="h-screen flex items-center justify-center gap-10">
                    <div className="p-6 rounded-[40px] flex flex-col items-center justify-start h-4/5 w-1/4 bg-background-200">
                        {user && <div className="flex flex-col items-center">
                            <img className="rounded-full mb-6 mt-16 w-80 h-80" src={ user.pfp } alt="" />
                            <h1 className="text-2xl">{ user.name }</h1>
                            <h1 className="text-xl">{ user.email }</h1>
                        </div>}
                    </div>

                    <div className="w-2/4 h-4/5 flex flex-col gap-10">
                        <div className="w-full h-3/5 bg-background-200 rounded-[40px] flex flex-col overflow-hidden">
                            {
                                organizations.map((organization) => {
                                    if(organization){
                                        return <OrganizationProfile id={organization.id} key={organization.id} name={organization.name} />
                                    }
                                })
                            }
                        </div>

                        <div className="w-full h-2/5 bg-background-200 rounded-[40px] grid place-content-center">
                            <div className="flex gap-10">
                                <button onClick={signOut} className="rounded-lg hover:bg-[#913636] hover:scale-105 text-[#fff] active:scale-100 duration-100 p-4 bg-[#ba3f3f]">Sign Out</button>
                                <button onClick={deleteAccount} className="rounded-lg hover:bg-[#913636] hover:scale-105 text-[#fff] active:scale-100 duration-100 p-4 bg-[#ba3f3f]">Delete Account</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={modalIsOpen} ariaHideApp={false} className="flex flex-col items-center justify-center h-screen">
                <div>
                    <h1 className="text-2xl">Are you sure you want to delete your account?</h1>
                    <div className="flex gap-10 mt-10 w-full items-center justify-center">
                        <button onClick={confirmDelete} className="rounded-lg hover:bg-[#913636] hover:scale-105 text-[#fff] active:scale-100 duration-100 p-4 bg-[#ba3f3f]">Yes</button>
                        <button onClick={closeModal} className="rounded-lg hover:bg-[#913636] hover:scale-105 text-[#fff] active:scale-100 duration-100 p-4 bg-[#ba3f3f]">No</button>
                    </div>
                </div>
            </Modal>
        </>
    )
}