import imageIcon from '/icon/image-icon.svg'
import videoIcon from '/icon/play-icon.svg'
import facebookIcon from '/icon/facebook-icon.svg'
import instagramIcon from '/icon/instagram-icon.svg'
import twitterIcon from '/icon/x-icon.svg'

import imageIconComplete from '/icon/image-complete.png'
import videoIconComplete from '/icon/play-complete.png'
import facebookIconComplete from '/icon/facebook-complete.png'
import instagramIconComplete from '/icon/instagram-complete.png'
import twitterIconComplete from '/icon/x-complete.png'

import closeIcon from '/icon/close-icon.svg'

import { useState } from 'react'
import axios from 'axios'

export default function NewPost(props) {
    let fileInput = null
    let [image, setImage] = useState(null)
    let [preview, setPreview] = useState(null)
    
    let [inputText, setInputText] = useState("")

    let [xIsUploaded, setXIsUploaded] = useState(false)
    let [facebookIsUploaded, setFacebookIsUploaded] = useState(false)
    let [instagramIsUploaded, setInstagramIsUploaded] = useState(false)

    const uploadImage = (event) => {
        setImage(() => event.target.files[0]) 

        const image = new FileReader;

        image.onload = () => {
            setPreview(image.result)
        }

        image.readAsDataURL(event.target.files[0])
    }

    const captureInput = (event) => {
       setInputText(event.target.value)
    }

    const submitPost = () => {
        const formData = new FormData()
        formData.append('body', inputText)
        formData.append('image', image)

        if(inputText.length != 0)
        {
            axios.post(`http://localhost:8000/post/create/${props.organizationId}`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(() => {
                window.location.reload()
            })
        }

        fileInput = null
        setImage(null)
        setPreview(null)
        setInputText("")

        setFacebookIsUploaded(false)
        setInstagramIsUploaded(false)
        setXIsUploaded(false)
    }

    const removeImage = () => {
        setImage(null)
        setPreview(null)
    }

    return (
        <>
            <div className="flex flex-col w-fit items-center gap-2 mb-12">
                <textarea onChange={captureInput} value={inputText} className="rounded-lg text-black p-5 resize-none text-lg bg-secondary-200" placeholder="Въведи текст" name="newpost" id="newpost" cols="50" rows="6"></textarea>

                <div className="flex relative w-full">
                    <div className="flex">

                        <div className='hover:scale-105 active:scale-100 duration-75 cursor-pointer'>
                            <input type="file" onChange={uploadImage} className='hidden' ref={file => fileInput = file}/>
                            <img onClick={() => fileInput.click()} src={image ? imageIconComplete : imageIcon} alt="" /> 
                        </div>

                        {/* <div className='hover:scale-105 active:scale-100 duration-75 cursor-pointer'>
                            <img src={videoIcon} alt="" />
                        </div> */}
                    </div>

                    <div className="flex absolute right-2">
                        <div className='hover:scale-105 active:scale-100 duration-75 cursor-pointer'>
                            <img onClick={() => setFacebookIsUploaded((prev) => !prev)} src={facebookIsUploaded ? facebookIconComplete : facebookIcon} alt="" />
                        </div>

                        {/* <div className='hover:scale-105 active:scale-100 duration-75 cursor-pointer'>
                            <img onClick={() => setInstagramIsUploaded((prev) => !prev)} src={instagramIsUploaded ? instagramIconComplete : instagramIcon} alt="" />
                        </div>

                        <div className='hover:scale-105 active:scale-100 duration-75 cursor-pointer'>
                            <img onClick={() => setXIsUploaded((prev) => !prev)} src={xIsUploaded ? twitterIconComplete : twitterIcon} alt="" />
                        </div> */}
                    </div>
                </div>

                { preview && <div className='relative'>
                        <img onClick={removeImage} src={closeIcon} className='left-2 top-2 hover:scale-105 cursor-pointer duration-100 active:scale-100 absolute' alt="" />
                        <img src={preview} className='max-w-md rounded-xl'/>
                    </div> }

                <button onClick={submitPost} className="p-3 w-3/4 text-xl text-text-50 hover:scale-105 active:scale-100 duration-75 bg-gradient-to-r from-[#7700A0] to-[#E40045] rounded-xl uppercase" type="submit">предай за ревю</button>
            </div>
        </>
    )
}
