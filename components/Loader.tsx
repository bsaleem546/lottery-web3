import React from "react";
import PropagateLoader from "react-spinners/PropagateLoader";

function Loader() {
    return <div className='bg-[#091B1B] h-screen flex flex-col items-center justify-center'>
        <div className='flex items-center space-x-2 mb-10'>
            <img src="../img/logo.jpg" alt="" className='rounded-full h-20 w-20'/>
            <h1 className='text-lg text-white font-bold'>Loading LOTTERY DAPP .....</h1>
        </div>
        <PropagateLoader color='white' size={30} />
    </div>;
}

export default Loader;