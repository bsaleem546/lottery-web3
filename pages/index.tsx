import type {NextPage} from 'next'
import Head from 'next/head'
import Header from "../components/Header";
import {
    useAddress,
    useDisconnect,
    useMetamask,
    useContract,
    useContractData,
    useContractCall,
} from "@thirdweb-dev/react";
import Login from "../components/Login";
import Loader from "../components/Loader";
import {useEffect, useState} from "react";
import {ethers} from 'ethers';
import {currency} from "../contants";
import CountdownTImer from "../components/CountdownTImer";
import toast from "react-hot-toast";
import Marquee from "react-fast-marquee/dist";
import AdminController from "../components/AdminController";

const Home: NextPage = () => {

    const [quantity, setQuantity] = useState<number>(1)
    const [userTickets, setUserTickets] = useState<number>(0)

    const address = useAddress()

    const {contract, isLoading} = useContract(process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS)

    const { data: remainingTickets } = useContractData(contract, "RemainingTickets")
    const { data: currentWinningReward } = useContractData(contract, "CurrentWinningReward")
    const { data: ticketPrice } = useContractData(contract, "ticketPrice")
    const { data: ticketCommission } = useContractData(contract, "ticketCommission")
    const { data: expiration } = useContractData(contract, "expiration")
    const { data: tickets } = useContractData(contract, "getTickets")

    const { mutateAsync: BuyTickets } = useContractCall(contract, "BuyTickets")
    const handleClick = async () => {
        if (!ticketPrice) return;

        const notification = toast.loading('Buying your tickets ......');
        
        try {
            const data = await BuyTickets([
                {
                    value: ethers.utils.parseEther(
                        ( Number( ethers.utils.formatEther(ticketPrice) ) * quantity ).toString()
                    )
                }
            ])

            toast.success(`${quantity} tickets purchased successfully ......`, { id: notification })

        } catch (e) {
            toast.error('Whoops something went wrong check your console.....', { id: notification })
            console.log(e)
        }

    }

    const { data: winnings } = useContractData(contract, "getWinningsForAddress", address)

    const { mutateAsync: WithdrawWinnings } = useContractCall(contract, "WithdrawWinnings")
    const onWithdrawWinnings = async () => {
        const notification = toast.loading('Withdrawing you winnings ......');

        try {
            const data = await WithdrawWinnings([ {} ]);
            toast.success(`Withdrawn winning successfully ......`, { id: notification })
        }
        catch (e) {
            toast.error('Whoops something went wrong check your console.....', { id: notification })
            console.log(e)
        }
    }

    const { data: lastWinner } = useContractData(contract, "lastWinner")
    const { data: lastWinnerAmount } = useContractData(contract, "lastWinnerAmount")

    const { data: lotteryOperator } = useContractData(contract, "lotteryOperator")


    useEffect(() =>{
        if (!tickets) return;

        const totalTickets: string[] = tickets;

        const noOfUserTickets = totalTickets.reduce((total, ticketAddress) => (ticketAddress === address ? total + 1 : total), 0);

        setUserTickets(noOfUserTickets);

    }, [tickets, address])

    if (!address) return <Login/>;

    if (isLoading) return <Loader/>;


    return (
        <div className="bg-[#091B1B] min-h-screen flex flex-col">
            <Head>
                <title>Lottery DAPP !!!!!!!!</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <div className='flex-1'>
                <Header/>

                <Marquee className='bg-[#0A1F1C]' gradient={false} speed={100}>
                    <div className='flex text-white space-x-2 mx-10 font-bold mb-5'>
                        <h4 className=''>Last Winnings: {lastWinner?.toString()}</h4>
                        <h4>Previous Winnings: {lastWinnerAmount && ethers.utils.formatEther(lastWinnerAmount?.toString())}{" "}{currency}</h4>
                    </div>
                </Marquee>

                {lotteryOperator && (
                    <div className='flex justify-center'>
                        <AdminController />
                    </div>
                )}

                {winnings > 0 && (
                    <div className='max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5'>
                        <button onClick={onWithdrawWinnings}
                            className='p-5 bg-gradient-to-b from-orange-500 to-emerald-600 animate-pulse text-center rounded-xl w-full'>
                            <p className='font-bold'>You are Winner</p>
                            <p>Total winnings: {ethers.utils.formatEther(winnings.toString())}{" "}{currency}</p>
                            <br/>
                            <p className='font-semibold'>Click here to withdraw</p>
                        </button>
                    </div>
                )}

                {/*  next draw box  */}
                <div className='space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5'>
                    <div className='stats-container'>
                        <h1 className='text-5xl text-white font-semibold text-center'>The Next Draw</h1>

                        <div className='flex justify-between space-x-2 p-2'>
                            <div className='stats'>
                                <h2 className='text-sm text-white'>Total Pool</h2>
                                <p className='text-xl'>{currentWinningReward && ethers.utils.formatEther(currentWinningReward?.toString())} { currency }</p>
                            </div>

                            <div className='stats'>
                                <h2 className='text-sm '>Tickets Remaining</h2>
                                <p className='text-xl'>{remainingTickets?.toNumber()}</p>
                            </div>
                        </div>

                        <div className='mt-5 mb-3'>
                            <CountdownTImer/>
                        </div>
                    </div>

                    <div className='stats-container space-y-2'>
                        <div className='stats-container'>
                            <div className='flex justify-between items-center text-white'>
                                <h2>Price Per Ticket</h2>
                                <p>{ticketPrice && ethers.utils.formatEther(ticketPrice?.toString())} { currency }</p>
                            </div>

                            <div className='flex text-white items-center space-x-2 bg-[#091B1B] border-[#004337] border p-4'>
                                <p>TICKETS</p>
                                <input className='flex w-full bg-transparent text-right outline-none'
                                       min={1} max={10} value={quantity} type="number"
                                       onChange={(e) => setQuantity(Number(e.target.value))} />
                            </div>

                            <div className='space-y-2 mt-5'>
                                <div className='flex items-center justify-between text-emerald-300 text-sm font-extrabold italic'>
                                    <p>Total Cost Of Ticket</p>
                                    <p>{ticketPrice && Number(ethers.utils.formatEther(ticketPrice?.toString())) * quantity} { currency }</p>
                                </div>

                                <div className='flex items-center justify-between text-emerald-300 text-xs italic'>
                                    <p>Service Fees</p>
                                    <p>{ticketCommission && ethers.utils.formatEther(ticketCommission?.toString())} { currency }</p>
                                </div>

                                <div className='flex items-center justify-between text-emerald-300 text-xs italic'>
                                    <p>+ Network Fees</p>
                                    <p>TBC</p>
                                </div>
                            </div>

                            <button onClick={handleClick}
                                disabled={expiration?.toString() < Date.now().toString() || remainingTickets?.toNumber() === 0}
                                className='mt-5 w-full bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5 font-semibold rounded-md text-white shadow-xl
                            disabled:from-gray-600 disabled:to-gray-600 disabled:text-gray-100 disabled:cursor-not-allowed'>
                                Buy {quantity} Tickets For {ticketPrice && Number( ethers.utils.formatEther(ticketPrice.toString()) )* quantity }{"  "}{currency}
                            </button>
                        </div>

                        {userTickets > 0 && (
                            <div className='stats'>
                                <p className='text-lg mb-2'>You have {userTickets} Tickets in this draw</p>
                                <div className='flex flex-wrap mx-w-sm gap-x-2 gap-y-2'>
                                    {Array(userTickets).fill("").map( (_, index) => (
                                        <p key={index} className='text-emerald-300 h-20 w-12 bg-emerald-500/30
                                                rounded-lg flex flex-shrink-0 items-center justify-center text-xl italic'>{index + 1}</p>
                                    ) )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/*  price per ticket box  */}
            </div>
        </div>
    )
}

export default Home
