import axios from "axios"
import OrganizationProfile from "../components/OrganizationProfile"
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import Modal from "react-modal"
import Nav from "../components/Nav"
import backArrow from "/icon/back-arrow.svg"
import bgElements from "/background/profile-page-elements.png"

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
                <img onClick={() => window.history.back()} className="mt-3 ml-3 hover:scale-105 absolute z-10 active:scale-100 cursor-pointer duration-100" width="80" src={backArrow} alt="" />
                {/* <Nav /> */}
                <div className="flex">
                    <div className="w-2/3 h-screen bg-primary relative">
                        <h1 className="text-white text-8xl font-bold relative z-10 ml-28 pt-36">Моят Акаунт</h1>
                        <img src={bgElements} className="absolute bottom-0 w-full h-full select-none z-0"/>
                    </div>
                    <div className="w-1/3 h-screen">
                        <div className="flex p-8 items-center justify-center h-full flex-col">
                        <div className="flex justify-center items-center">
                            <div className="text-white">
                                <div className="flex justify-center items-center gap-10"> 
                                    <div className="flex flex-col">
                                        <div className="flex flex-col items-center">
                                            <h1 className="text-4xl">Име</h1>
                                            {user && <h1 className="text-xl">{user.name}</h1>}
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <h1 className="text-4xl">Имейл</h1>
                                            {user && <h1 className="text-xl">{user.email}</h1>}
                                        </div>
                                    </div>
                                    <div>
                                        {user && <img src={user.pfp} className="rounded-full h-[100px] w-[100px]" />}
                                    </div>
                                </div>
                                    <div className="text-white w-[80%] mt-14 flex flex-col gap-6">
                                        <button onClick={signOut} className="uppercase w-full bg-[#ba3f3f] hover:bg-[#913636] hover:scale-105 rounded-md active:scale-100 duration-100 p-3">Излез</button>
                                        <button onClick={deleteAccount} className="uppercase w-full bg-[#ba3f3f] hover:bg-[#913636] hover:scale-105 rounded-md active:scale-100 duration-100 p-3">Изтрий акаунт</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={modalIsOpen} ariaHideApp={false} className="flex flex-col items-center justify-center h-screen">
                <div>
                    <h1 className="text-2xl">Сигурни ли сте, че искате да изтриете акаунта си?</h1>
                    <div className="flex gap-10 mt-10 w-full items-center justify-center">
                        <button onClick={confirmDelete} className="rounded-lg hover:bg-[#913636] hover:scale-105 text-[#fff] active:scale-100 duration-100 p-4 bg-[#ba3f3f]">Да</button>
                        <button onClick={closeModal} className="rounded-lg hover:bg-[#913636] hover:scale-105 text-[#fff] active:scale-100 duration-100 p-4 bg-[#ba3f3f]">Не</button>
                    </div>
                </div>
            </Modal>
        </>
    )
}