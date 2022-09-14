import React from "react";
import { StarIcon, CurrencyDollarIcon, ArrowPathIcon, ArrowUturnDownIcon } from "@heroicons/react/24/solid";
import {useContract, useContractData, useContractCall} from "@thirdweb-dev/react";
import {ethers} from "ethers";
import {currency} from "../contants";
import toast from "react-hot-toast";

function AdminController() {

    const {contract, isLoading} = useContract(process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS)

    const { data: ticketCommission } = useContractData(contract, "ticketCommission")

    const { mutateAsync: DrawWinnerTicket } = useContractCall(contract, "DrawWinnerTicket")
    const { mutateAsync: RefundAll } = useContractCall(contract, "RefundAll")
    const { mutateAsync: restartDraw } = useContractCall(contract, "restartDraw")
    const { mutateAsync: WithdrawCommission } = useContractCall(contract, "WithdrawCommission")

    const drawWinner = async () => {
        const notification = toast.loading('Drawing winner ......');
        try {
            const data = await DrawWinnerTicket([{}]);
            toast.success(`Drawing winner successfully ......`, { id: notification })
        }
        catch (e) {
            toast.error('Whoops something went wrong check your console.....', { id: notification })
            console.log(e)
        }
    }
    const onWithdrawCommission = async () => {
        const notification = toast.loading('Withdrawing commission ......');
        try {
            const data = await WithdrawCommission([{}]);
            toast.success(`Withdrawing commission successfully ......`, { id: notification })
        }
        catch (e) {
            toast.error('Whoops something went wrong check your console.....', { id: notification })
            console.log(e)
        }
    }
    const onRestartDraw = async () => {
        const notification = toast.loading('Restarting Draw ......');
        try {
            const data = await restartDraw([{}]);
            toast.success(`Restarted Draw successfully ......`, { id: notification })
        }
        catch (e) {
            toast.error('Whoops something went wrong check your console.....', { id: notification })
            console.log(e)
        }
    }
    const onRefundAll = async () => {
        const notification = toast.loading('Refunding Started ......');
        try {
            const data = await RefundAll([{}]);
            toast.success(`Refunding completed successfully ......`, { id: notification })
        }
        catch (e) {
            toast.error('Whoops something went wrong check your console.....', { id: notification })
            console.log(e)
        }
    }

    return (
        <div className='text-white text-center px-5 py-3 rounded-md border-emerald-300/20 border mt-5'>
            <h2 className='font-bold'>Admin Controller</h2>
            <p className='mb-5'>Total Commission to be withdrawn: {ticketCommission && ethers.utils.formatEther(ticketCommission?.toString())}{" "}{currency}</p>

            <div className='flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2'>
                <button onClick={drawWinner} className='admin-button'>
                    <StarIcon className='h-6 mx-auto mb-2' />
                    Draw Winner</button>

                <button onClick={onWithdrawCommission} className='admin-button'>
                    <CurrencyDollarIcon className='h-6 mx-auto mb-2' />
                    Withdraw Commission</button>

                <button onClick={onRestartDraw} className='admin-button'>
                    <ArrowPathIcon className='h-6 mx-auto mb-2' />
                    Restart Draw</button>

                <button onClick={onRefundAll} className='admin-button'>
                    <ArrowUturnDownIcon className='h-6 mx-auto mb-2' />
                    Refund All</button>
            </div>
        </div>
    );
}

export default AdminController;