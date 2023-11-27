import { useState } from "react";

export default function Post(props) {
    let [image, setImage] = useState(null)

    if(props.image != null)
    {
        const imageReader = new FileReader;
        imageReader.onload = () => {
            setImage(imageReader.result)
        }
        imageReader.readAsDataURL(props.image)
    }

    return (
        <>
            <div className="rounded-xl w-full p-5 bg-primary-200">
                <div className="flex items-center gap-2"> 
                    <img className="rounded-full hover:scale-105 cursor-pointer duration-150 active:scale-100 select-none bg-accent-500" src="https://api.dicebear.com/7.x/miniavs/svg?flip=true" height="32" width="32" alt="" />
                    <h2>Joe Doe</h2>
                </div>

                <p className="mt-2">{props.text}</p> 
                {image != null && <div className="flex justify-center mt-4">
                    <img src={image} className='max-w-md rounded-xl text-center'/>
                </div>}
            </div>
        </>
    );
}
