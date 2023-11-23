import axios from "axios"
import useFetch from "../hooks/useFetch"

export default function Profile() {
    let userData = useFetch("http://localhost:8000/user")

    const signOut = () => {
        axios.get("http://localhost:8000/signout", { withCredentials: true }).then(() => {
            window.location.href = "/"
        })
    }

    return (
        <>
            <div>
                <div className="h-screen flex items-center justify-center gap-10">
                    <div className="p-6 rounded-[40px] flex flex-col items-center justify-start h-4/5 w-1/4 bg-background-200">
                        {userData.data && <div className="flex flex-col items-center">
                            <img className="rounded-full mb-6 mt-16 w-80 h-80" src={ userData.data.pfp } alt="" />
                            <h1 className="text-2xl">{ userData.data.name }</h1>
                            <h1 className="text-xl">{ userData.data.email }</h1>
                        </div>}
                    </div>

                    <div className="w-2/4 h-4/5 flex flex-col gap-10">
                        <div className="w-full h-3/5 bg-background-200 rounded-[40px]">

                        </div>

                        <div className="w-full h-2/5 bg-background-200 rounded-[40px] grid place-content-center">
                            <div className="flex gap-10">
                                <button onClick={signOut} className="rounded-lg hover:bg-[#913636] hover:scale-105 text-[#fff] active:scale-100 duration-100 p-4 bg-[#ba3f3f]">Sign Out</button>
                                <button className="rounded-lg hover:bg-[#913636] hover:scale-105 text-[#fff] active:scale-100 duration-100 p-4 bg-[#ba3f3f]">Delete Account</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}