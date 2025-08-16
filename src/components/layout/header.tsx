'use client'

import { usePathname } from "next/navigation";

function Header() {
    const pathName = usePathname()
    // console.log(pathName);

    const isLoginPage: boolean = pathName === '/login'

    if(isLoginPage) return null

    
    return ( 
        <div>Header</div>
    );
}

export default Header;