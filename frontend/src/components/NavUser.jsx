
export default function NavUser(props) {
    return (
        <>
            <div className="flex gap-3">
                <div className="flex justify-center items-center flex-col">
                    <h2 className="font-bold text-2xl"> {props.name} </h2>
                    <h2 className="font-thin rounded-md bg-secondary-300 px-3"> {props.role} </h2>
                </div>     
                <img onClick={() => {window.location.href = "/profile"}} className="rounded-full hover:scale-105 cursor-pointer duration-150 active:scale-100 select-none bg-accent-500" src={props.image} height="62" width="62" alt="" />
            </div> 
        </>
    )
}