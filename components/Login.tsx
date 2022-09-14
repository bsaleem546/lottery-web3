import React from "react";
import {useMetamask} from "@thirdweb-dev/react";

function Login() {

    const connectWithMetaMask = useMetamask();

    return (

        <div className='bg-[#091B1B] min-h-screen flex flex-col items-center justify-center text-center'>
            <div className='flex flex-col items-center mb-10'>
                <img className='h-56 w-56 rounded-full mb-10' src="../img/logo.jpg" alt=""/>
                <h1 className='text-6xl text-white font-bold mb-5'>The Lottery DAPP !!!!</h1>
                <h2 className='text-white'>Get started by logging in</h2>
                <button onClick={connectWithMetaMask}
                    className='bg-white px-8 py-5 mt-10 rounded-lg shadow-lg font-bold'>Login with metamask</button>
            </div>
        </div>
    );
}

export default Login;