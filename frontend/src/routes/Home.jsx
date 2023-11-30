import Nav from '../components/Nav'
import NewPost from '../components/NewPost'
import Post from '../components/Post'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import purpleCircle from '/background/purple-circle.png'
import magentaCircle from '/background/magenta-circle.png'
import useFetch from '../hooks/useFetch'

export default function Home() {
    let [posts, setPosts] = useState([])
    let [queryParam] = useSearchParams()
    let navigate = useNavigate()
    let [role, setRole] = useState()
    let organizationId = null
    organizationId = queryParam.get("id")
    let user = useFetch("http://localhost:8000/user")

    useEffect(() => {
        if(organizationId) {
            axios.get(`http://localhost:8000/organisation/posts/${organizationId}`, {withCredentials: true}).then((res) => {
                setPosts(res.data.reverse())
            }).catch((err) => {})
        }
    }, [])

    useEffect(() => {
        if(user && user.data) {
            axios.get(`http://localhost:8000/user/organisations/${user.data.id}`, {withCredentials: true}).then((res) => {
                if(res.data){
                    res.data.map(org => {
                        if(org.oid == organizationId) {
                            setRole(org.role)
                        }
                    })
                }
            })
        }
    }, [user])

    if(organizationId == null) {
        navigate("/organizations")
    } else {
        return (
            <>
                <Nav organizationId={organizationId}/>
                
                <div className='mt-16 mb-28 flex justify-center items-center relative z-20'>
                    <div className='flex justify-center min-h-[90vh] flex-col items-center bg-[#ffffff20] border-gray border rounded-md w-[90%]'>
                        <div className='w-full flex justify-center items-start gap-24 relative max-[1000px]:flex-col max-[1000px]:items-center'>
                            <div className='my-16'>
                                <NewPost organizationId={organizationId} setposts={setPosts} />
                            </div>

                            <div className='w-[50%]'>
                                <h1 className='text-2xl text-white py-10 my-5 uppercase font-bold'>Чакащи за ревю</h1>

                                <div className='flex justify-center flex-col gap-8 mb-10'>
                                    {
                                        posts.map((post, index) => {
                                            return (
                                                <Post key={index} role={role} user={post.user} post={post.post} />
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-screen h-screen overflow-hidden absolute top-0'>
                    <img src={magentaCircle} className='absolute z-[-1] top-0 select-none right-0' alt='' />
                    <img src={purpleCircle} className='fixed z-[-1] bottom-0 select-none left-0' alt='' />
                </div>
            </>
        )
    }
}