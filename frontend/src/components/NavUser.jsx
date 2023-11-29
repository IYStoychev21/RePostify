
export default function NavUser(props) {
    return (
        <>
            <div className="text-white flex flex-col items-center justify-center select-none relative z-10 bg-[#ffffff20] p-5 w-[160px] h-[260px] rounded-xl text-xl border-black border">
                <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center">
                    <img src={props.image} className="w-[100px] rounded-full" />
                </div>
                <div className="text-center">
                    <p className="text-2xl font-semibold">{props.name}</p>
                    <p className="text-xl uppercase mt-4 border-white border-2 rounded-sm">{props.role}</p>
                </div>
            </div>
        </>
    )
}