import NavElement from "./NavElement";
import NavUser from "./NavUser"

export default function Nav() {
    return (
        <>
            <div className="flex h-20 shadow-md">
                <div className="flex gap-5 ml-6 h-full items-center">
                    <NavElement text="HOME" />
                    <div className="w-0.5 h-2/5 bg-text-300"></div>

                    <NavElement text="ORGANIZATION" />
                </div>
                <div className="absolute right-[20px] py-2">
                    <NavUser name="Joe Doe" role="USER" />
                </div>
            </div>
        </>
    )
}