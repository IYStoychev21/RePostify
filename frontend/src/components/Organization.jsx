import { Link } from "react-router-dom"

export default function Organization(props) {
    return (
        <>
            <Link to={{pathname: `/home`, search: `?id=${props.id}`}} className="flex bg-[#ffffff20] relative z-10 gap-5 flex-col items-center justify-center p-5 w-[160px] h-[260px] rounded-xl cursor-pointer hover:scale-105 active:scale-100 duration-100 border-black border">
                <img className="rounded-xl" src={`https://ui-avatars.com/api/?name=${props.name}&size=128`} alt="" />
                <h1 className="text-center select-none text-lg text-white">{props.name}</h1>
            </Link>
        </>
    )
}