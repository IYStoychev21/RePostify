import axios from "axios";
import { useState } from "react";

export default function Post(props) {
    const accept = () => {
        axios.get(`http://localhost:8000/login/facebook/${props.post.id}`, { withCredentials: true}).then((res) => {
            window.location.href = res.data.url
        })
    }

    const reject = () => {
        axios.delete(`http://localhost:8000/post/delete/${props.post.id}`, {withCredentials: true}).then((res) => {
            window.location.reload()
        })
    }

    let imgExtensions = ["jpg", "jpeg", "png", "gif", "svg"]
    let videoExtensions = ["mp4", "mov", "avi", "mkv", "wmv", "flv", "webm"]

    return (
        <>
        <div>
            <div className="rounded-xl w-full p-5 bg-white">
                <div className="flex items-center gap-2"> 
                    <img className="rounded-full hover:scale-105 cursor-pointer duration-150 active:scale-100 select-none bg-accent-500" src={props.user.pfp} height="32" width="32" alt="" />
                    <h2 className="text-black">{props.user.name}</h2>
                </div>

                <p className="mt-2 text-black">{props.post.body}</p> 

                {props.post.attachment && <div className="flex justify-center mt-4">
                    {imgExtensions.includes(props.post.attachment.split(".")[props.post.attachment.split(".").length - 1].toLowerCase()) && <img src={props.post.attachment} className='max-w-md rounded-xl text-center'/>}
                    {videoExtensions.includes(props.post.attachment.split(".")[props.post.attachment.split(".").length - 1].toLowerCase()) && <video src={props.post.attachment} controls className='max-w-md rounded-xl text-center'/>}
                </div>}
 
            </div>
            {props.role == 'owner' && <div className="flex gap-5">
                <button onClick={accept} className="bg-[#3dc144] hover:bg-[#329037] hover:scale-105 active:scale-100 duration-100 text-white rounded-xl px-4 py-2 mt-2">Приеми</button>
                <button onClick={reject} className="bg-[#c64141] hover:bg-[#a33434] hover:scale-105 active:scale-100 duration-100 text-white rounded-xl px-4 py-2 mt-2">Откажи</button>
            </div>}

            {props.role == 'PR' && <div className="flex gap-5">
                <button onClick={accept} className="bg-[#3dc144] hover:bg-[#329037] hover:scale-105 active:scale-100 duration-100 text-white rounded-xl px-4 py-2 mt-2">Приеми</button>
                <button onClick={reject} className="bg-[#c64141] hover:bg-[#a33434] hover:scale-105 active:scale-100 duration-100 text-white rounded-xl px-4 py-2 mt-2">Откажи</button>
            </div>}
        </div>
        </>
    );
}
