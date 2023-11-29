
export default function Nav(props) {
    return (
        <>
            <div onClick={props.handleClick} className="flex h-20 text-white items-center justify-end hover:scale-105 cursor-pointer duration-150 active:scale-100 select-none">
                <h1> {props.text} </h1>
            </div>
        </>
    )
}