import Nav from '../components/Nav'
import NewPost from '../components/NewPost'
import Post from '../components/Post'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function Home() {
    let [posts, setPosts] = useState([])
    let [queryParam] = useSearchParams()
    
    let organizationId = 1
    organizationId = queryParam.get("id")

    return (
        <>
            <Nav />
            <div className='mt-16'>
                <div className='flex justify-center flex-col items-center'>
                    <div className='w-fit'>
                        <NewPost setpost={setPosts} />

                        <h1 className='text-2xl font-light my-5'>POST FOR REVIEW</h1>

                        <div className='flex justify-center flex-col w-full gap-8 mb-10'>
                            {
                                posts.map((post, index) => {
                                    return (
                                        <Post key={index} text={post.text} image={post.image} />
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