
export default function NewMember(props) {
    return (
        <>
            <div className="w-full flex gap-3">
                <input onChange={props.getEmail} placeholder="Enter users email E.g. john@gmail.com" type="email" pattern=".+@gmail\.com" className="w-full p-2 rounded-md" required/>     

                <select onChange={props.getRole} className="p-2 rounded-md" name="role" id="role">
                    <option value="user">User</option>
                    <option value="PR">PR</option>
                </select>

                <div onClick={props.removeMember} className="rounded-md w-12 hover:scale-105 active:scale-100 hover:bg-[#6e2525] bg-[#b43a3a] duration-100 cursor-pointer"></div>
            </div> 
        </>
    )
}