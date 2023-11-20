export default function Post(props) {
    return (
        <>
            <div className="bg-background-300 rounded-xl p-5">
                <div className="flex items-center gap-2"> 
                    <img className="rounded-full hover:scale-105 cursor-pointer duration-150 active:scale-100 select-none bg-accent-500" src="https://api.dicebear.com/7.x/miniavs/svg?flip=true" height="32" width="32" alt="" />
                    <h2>Joe Doe</h2>
                </div>

               <p>{props.text}</p> 
            </div>
        </>
    );
}
