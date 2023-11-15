
export default function Nav(props) {
    return (
        <>
            <div className="flex h-20 items-center justify-center hover:scale-105 cursor-pointer duration-150 active:scale-100 select-none">
                <h1> {props.text} </h1>
            </div>
        </>
    )
}