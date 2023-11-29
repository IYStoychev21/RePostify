import Nav from '../components/Nav'
import NewPost from '../components/NewPost'
import Post from '../components/Post'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import purpleCircle from '/background/purple-circle.png'
import magentaCircle from '/background/magenta-circle.png'

export default function Home() {
    let [posts, setPosts] = useState([])
    let [queryParam] = useSearchParams()
    let navigate = useNavigate()
    
    let organizationId = null
    organizationId = queryParam.get("id")

    useEffect(() => {
        if(organizationId) {
            axios.get(`http://localhost:8000/organisation/posts/${organizationId}`, {withCredentials: true}).then((res) => {
                setPosts(res.data.reverse())
            })
        }
    }, [])

    if(organizationId == null) {
        navigate("/organizations")
    } else {
        return (
            <>
                <Nav organizationId={organizationId}/>
                
                <div className='mt-16 flex justify-center items-center'>
                    <div className='flex justify-center min-h-[90vh] flex-col items-center bg-[#0d0d0d] rounded-md w-[90%]'>
                        <div className='w-full flex justify-center items-start gap-24 relative'>
                            <div className='my-16'>
                                <NewPost organizationId={organizationId} setposts={setPosts} />
                            </div>

                            <div>
                                <h1 className='text-2xl text-white py-10 my-5 uppercase font-bold'>push for review</h1>

                                <div className='flex justify-center flex-col gap-8 mb-10'>
                                    {
                                        posts.map((post, index) => {
                                            return (
                                                <Post key={index} user={post.user} post={post.post} />
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className='w-screen h-screen overflow-hidden absolute top-0'>
                        <img src={magentaCircle} className='absolute z-[-1] top-0 w-screen right-0' alt='' />
                        <img src={purpleCircle} className='absolute z-[-1] bottom-0 w-screen left-0' alt='' />
                    </div> */}
                </div>
            </>
        )
    }
}