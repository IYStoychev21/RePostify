import { Link } from "react-router-dom"

export default function Organization(props) {
    return (
        <>
            <Link to={{pathname: `/home`, search: `?id=${props.id}`}} className="flex gap-5 flex-col items-center justify-center bg-text-400 p-5 w-2/3 h-2/3 rounded-xl cursor-pointer hover:scale-105 active:scale-100 duration-100">
                <img className="rounded-xl" src={`https://ui-avatars.com/api/?name=${props.name}&size=128`} alt="" />
                <h1 className="text-center select-none text-lg">{props.name}</h1>
            </Link>
        </>
    )
}