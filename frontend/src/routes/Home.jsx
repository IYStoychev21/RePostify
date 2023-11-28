import Nav from '../components/Nav'
import NewPost from '../components/NewPost'
import Post from '../components/Post'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

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
                
                <div className='mt-16'>
                    <div className='flex justify-center flex-col items-center'>
                        <div className='w-min'>
                            <NewPost organizationId={organizationId} setposts={setPosts} />

                            <h1 className='text-2xl font-light my-5 uppercase'>push for review</h1>

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
            </>
        )
    }
}