import Nav from '../components/Nav'
import NewPost from '../components/NewPost'

export default function Home() {
    return (
        <>
            <Nav />
            <div className='mt-16'>
                <div className='flex justify-center'>
                    <NewPost />
                </div>
            </div>
        </>
    )
}