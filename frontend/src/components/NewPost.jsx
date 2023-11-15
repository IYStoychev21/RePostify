import imageIcon from '/icon/image-icon.svg'
import videoIcon from '/icon/play-icon.svg'
import facebookIcon from '/icon/facebook-icon.svg'
import instagramIcon from '/icon/instagram-icon.svg'
import twitterIcon from '/icon/x-icon.svg'

export default function NewPost() {

    return (
        <>
            <div className="flex flex-col w-fit items-center gap-2">
                <textarea className="rounded-lg p-5 resize-none text-lg bg-secondary-200" placeholder="Enter Text" name="newpost" id="newpost" cols="50" rows="6"></textarea>

                <div className="flex relative w-full">
                    <div className="flex">
                        <div className='hover:scale-105 active:scale-100 duration-75 cursor-pointer'>
                            <img src={imageIcon} alt="" />
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

                <button className="p-3 w-3/4 text-xl text-text-50 hover:scale-105 active:scale-100 duration-75 hover:bg-secondary-700 bg-accent-600 rounded-xl" type="submit">PUSH FOR REVIEW</button>
            </div>
        </>
    )
}