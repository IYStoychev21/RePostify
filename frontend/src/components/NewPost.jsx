import imageIcon from '/icon/image-icon.svg'
import videoIcon from '/icon/play-icon.svg'
import facebookIcon from '/icon/facebook-icon.svg'
import instagramIcon from '/icon/instagram-icon.svg'
import twitterIcon from '/icon/x-icon.svg'
import { useState } from 'react'

export default function NewPost() {
    let fileInput = null
    let [image, setImage] = useState(null)
    let [preview, setPreview] = useState(null)

    const uploadImage = (event) => {
        setImage(() => event.target.files[0]) 

        const image = new FileReader;
        image.onload = () => {
            setPreview(image.result)
        }
        image.readAsDataURL(event.target.files[0])
    }

    return (
        <>
            <div className="flex flex-col w-fit items-center gap-2 mb-12">
                <textarea className="rounded-lg p-5 resize-none text-lg bg-secondary-200" placeholder="Enter Text" name="newpost" id="newpost" cols="50" rows="6"></textarea>

                <div className="flex relative w-full">
                    <div className="flex">

                        <div className='hover:scale-105 active:scale-100 duration-75 cursor-pointer'>
                            <input type="file" onChange={uploadImage} className='hidden' ref={file => fileInput = file}/>
                            <img onClick={() => fileInput.click()} src={imageIcon} alt="" />
                        </div>

                        <div className='hover:scale-105 active:scale-100 duration-75 cursor-pointer'>
                            <img src={videoIcon} alt="" />
                        </div>
                    </div>

                    <div className="flex absolute right-2">
                        <div className='hover:scale-105 active:scale-100 duration-75 cursor-pointer'>
                            <img src={facebookIcon} alt="" />
                        </div>
                        <div className='hover:scale-105 active:scale-100 duration-75 cursor-pointer'>
                            <img src={instagramIcon} alt="" />
                        </div>
                        <div className='hover:scale-105 active:scale-100 duration-75 cursor-pointer'>
                            <img src={twitterIcon} alt="" />
                        </div>
                    </div>
                </div>
                <img src={preview} className='max-w-md rounded-2xl'/>

                <button className="p-3 w-3/4 text-xl text-text-50 hover:scale-105 active:scale-100 duration-75 hover:bg-secondary-700 bg-accent-600 rounded-xl" type="submit">PUSH FOR REVIEW</button>
            </div>
        </>
    )
}
