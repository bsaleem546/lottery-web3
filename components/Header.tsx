import React from "react";
import NavButton from "./NavButton";
import { Bars3BottomRightIcon } from '@heroicons/react/24/solid';
import {useAddress, useDisconnect} from "@thirdweb-dev/react";


function Header() {
    const address = useAddress()
    const disconnect = useDisconnect()

    return (
    <header className='grid grid-cols-2 md:grid-cols-5 justify-center items-center p-5'>
        <div className='flex items-center space-x-10'>
            <img src="../img/logo.jpg" alt="" className='rounded-full h-20 w-20'/>
            <div>
                <h1 className='text-lg font-bold text-white'>Lottery DAPP</h1>
                <p className='text-xs text-emerald-500 truncate'>
                    User: {address?.substring(0,5)}.....{address?.substring(address.length, address.length-5)}
                </p>
            </div>
        </div>

        <div className='hidden md:flex justify-center items-center rounded md:col-span-3'>
            <div className='bg-[#0A1F1C] p-4 space-x-2'>
                <NavButton title='Buy Tickets' isActive />
                <NavButton onClick={disconnect} title='Logout' />
            </div>
        </div>

        <div className='flex flex-col ml-auto text-right'>
            <Bars3BottomRightIcon className='h-8 w-8 mx-auto text-white cursor-pointer'/>
            <span className='md:hidden'>
                <NavButton onClick={disconnect} title='Logout' />
            </span>
        </div>
    </header>
);

}

export default Header;