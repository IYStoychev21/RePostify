import { useState } from "react";

export default function Post(props) {
    let [image, setImage] = useState(null)

    if(props.post.image != null)
    {
        const imageReader = new FileReader;
        imageReader.onload = () => {
            setImage(imageReader.result)
        }
        imageReader.readAsDataURL(props.post.image)
    }

    return (
        <>
        <div>
            <div className="rounded-xl w-full p-5 bg-white">
                <div className="flex items-center gap-2"> 
                    <img className="rounded-full hover:scale-105 cursor-pointer duration-150 active:scale-100 select-none bg-accent-500" src={props.user.pfp} height="32" width="32" alt="" />
                    <h2 className="text-black">{props.user.name}</h2>
                </div>

                <p className="mt-2 text-black">{props.post.body}</p> 
                {image != null && <div className="flex justify-center mt-4">
                    <img src={image} className='max-w-md rounded-xl text-center'/>
                </div>}
            </div>
            {props.role == 'owner' && <div className="flex gap-5">
                <button className="bg-[#3dc144] hover:bg-[#329037] hover:scale-105 active:scale-100 duration-100 text-white rounded-xl px-4 py-2 mt-2">Приеми</button>
                <button className="bg-[#c64141] hover:bg-[#a33434] hover:scale-105 active:scale-100 duration-100 text-white rounded-xl px-4 py-2 mt-2">Откажи</button>
            </div>}

            {props.role == 'PR' && <div className="flex gap-5">
                <button className="bg-[#3dc144] hover:bg-[#329037] hover:scale-105 active:scale-100 duration-100 text-white rounded-xl px-4 py-2 mt-2">Приеми</button>
                <button className="bg-[#c64141] hover:bg-[#a33434] hover:scale-105 active:scale-100 duration-100 text-white rounded-xl px-4 py-2 mt-2">Откажи</button>
            </div>}
        </div>
        </>
    );
}
