import axios from 'axios';
import whiteCircle from "/background/background-element-home.png"
import smoke from "/background/background-smoke-home.png"

export default function Root() {
    const handleLogIn = () => {
        axios.get('http://localhost:8000/login/google')
        .then((res) => {
           window.location.href = res.data.url
        })
    }
    
    return (
        <>
            <div className='w-full  pb-[420px] overflow-y-clip bg-gradient-to-b overflow-x-hidden from-primary to-black relative'>
                <div className='flex justify-end z-10 relative'>
                    <button onClick={handleLogIn} className="p-3 hover:scale-105 active:scale-100 duration-100 border-white border my-8 mx-24 text-white">Log in with Google</button>
                </div>

                <div className='ml-36 mt-44 z-10 relative'>
                    <div className='flex flex-col w-fit items-start'>
                        <h1 className='text-white text-7xl font-bold'>RePostify</h1>
                        <button onClick={handleLogIn} className="p-3 px-12 hover:scale-105 active:scale-100 duration-100 border-white border mt-16 text-white">Log in with Google</button>
                    </div>
                </div>
                <img src={whiteCircle} className='absolute z-0 right-0 w-full top-0' />
            </div>

            <div className='bg-black flex flex-col justify-center items-center overflow-hidden'>
                <div className='text-white flex flex-col justify-center items-center gap-8'>
                    <h1 className='text-6xl'>We make <span className='text-primary'>managing</span> <span className='text-accent-one'>business</span> <span className='text-accent-two'>easier</span></h1>
                    <p className='w-8/12 text-center text-gray'>Inovative approach for effective management of social networks through a centralized platform.</p>
                </div>
            </div>

            <div className='bg-black text-white pt-[400px] relative pb-40'>

                <div className='flex items-start w-full justify-start'>
                    <div className='ml-40 w-[400px] flex flex-col gap-4'>
                        <h1 className='text-4xl text-[#fff0] font-bold bg-clip-text bg-gradient-to-r from-[#1F1FFF] to-[#AD00FF]'>Security</h1>
                        <p>Efficient approach ensuring increased security through pre-approval of content</p>
                    </div>
                </div>

                <div className='flex items-end w-full justify-end'>
                    <div className='mr-40 w-[400px] flex flex-col gap-4 mt-48'>
                        <h1 className='text-4xl text-[#fff0] font-bold bg-clip-text bg-gradient-to-r from-[#1F1FFF] to-[#AD00FF]'>Posts</h1>
                        <p>Users have the ability to create  posts. After preparation, the posts are submitted for approval to responsible persons such as PR or the owners of the organization.</p>
                    </div>
                </div>

                <div className='flex items-start w-full justify-start'>
                    <div className='ml-40 w-[400px] flex flex-col gap-4'>
                        <h1 className='text-4xl text-[#fff0] font-bold bg-clip-text bg-gradient-to-r from-[#1F1FFF] to-[#AD00FF]'>Approving</h1>
                        <p>Approved posts are automatically distributed and published on the relevant social networks, facilitating the content management process.</p>
                    </div>
                </div>

                <div className='flex items-end w-full justify-end'>
                    <div className='mr-40 w-[400px] flex flex-col gap-4 mt-48'>
                        <h1 className='text-4xl text-[#fff0] font-bold bg-clip-text bg-gradient-to-r from-[#1F1FFF] to-[#AD00FF]'>Posts</h1>
                        <p>Users have the ability to create  posts. After preparation, the posts are submitted for approval to responsible persons such as PR or the owners of the organization.</p>
                    </div>
                </div>

                {/* <img src={smoke} className='absolute z-0 top-0 right-0 w-full' /> */}
            </div>
        </>
    )
}