import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function OrganizationProfile(props) {
    const leaveOrganization = () => {
        axios.delete(`http://localhost:8000/user/organisation/leave/${props.id}`, {withCredentials: true}).then(() => {
            window.location.href = "/organizations"
        }).catch((err) => {
            toast.error(err.response.data.detail)
        })
    }

    return (
        <>
            <div className="p-6 flex items-center gap-16 duration-100 hover:bg-background-300 relative">
                <img className="rounded-xl" src={`https://ui-avatars.com/api/?name=${props.name}&size=64`} alt="" />
                <h1 className="uppercase text-2xl">{props.name}</h1>
                <button onClick={leaveOrganization} className="rounded-lg hover:bg-[#913636] hover:scale-105 absolute right-6 text-[#fff] active:scale-100 duration-100 p-4 bg-[#ba3f3f]">LEAVE</button>
            </div> 
            <ToastContainer />
        </>
    )
}