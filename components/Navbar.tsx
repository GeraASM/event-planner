"use client";

import { useState } from "react";
import Link from "next/link";
import { Session } from "next-auth";
import { logout } from "@/lib/auth-actions";
import Image from "next/image";

export default function Navbar({session}: {session?: Session | null}) {
    const [btnActive, setBtnActive] = useState<boolean>(false);

    return (
        <nav className="bg-slate-800 border-b border-slate-700 shadow-lg">
            <div className="max-w-7xl mx-auto p-4">
                <div className="md:h-16 md:flex justify-between items-center">
                    <div className="flex justify-between">
                            <Link className="text-primary text-xl font-bold" href={"/"}>Event Planner</Link>
                        <button onClick={() => setBtnActive(prev => !prev)}  className="cursor-pointer md:hidden p-2 rounded bg-foreground hover:bg-primary focus:outline-none focus:text-primary" >
                            <Image className="h-5 w-5" width={100} height={100} src="/assets/hamburger.svg" alt="Hamburger" />
                        </button>
                    </div>
                    {
                        btnActive &&
                        <div className="mt-3">
                            <ul className="flex flex-col gap-2 md:hidden items-start">
                                {
                                    session ?
                                    (
                                        <>
                                            <li>
                                                <Link className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors" href={"/events"}>Events</Link>
                                            </li>
                                            <li>
                                                <Link className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors" href={"/events/create"}>Create Event</Link>
                                            </li>
                                            <li>
                                                <Link className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors" href={"/dashboard"}>Dashboard</Link>
                                            </li>
                                        
                                            <li>
                                    <button onClick={logout}  className="
                                                hover:bg-gray-950 cursor-pointer text-[14px]
                                            w-full flex items-center justify-center gap-2 font-medium px-4 py-3 rounded-xl bg-gray-900 text-foreground 
                                            transition-colors
                                            ">
                                                <p>Log out</p>
                                            </button>
                                </li>
                                        
                                        </>

                                    ) :
                                    (
                                        <>
                                             <li>
                                                <Link className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors" href={"/events"}>Events</Link>
                                            </li>
                                            <li>
                                                <Link className="text-foreground text-sm hover:text-primary bg-primary  px-3 py-2 rounded-md font-medium transition-colors duration-300 hover:bg-primary/10" href={"/login"}>Sign in with GitHub</Link>
                                            </li>
                                        </>
                                    )
                                }

                            </ul>
                        </div>
                    }
                    <ul className=" hidden md:flex space-x-4 md:items-center">
                        {session ?
                            <>
                            
                                <li>
                                    <Link className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors" href={"/events"}>Events</Link>
                                </li>
                                <li>
                                    <Link className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors" href={"/events/create"}>Create Event</Link>
                                </li>
                                <li>
                                    <Link className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors" href={"/dashboard"}>Dashboard</Link>
                                </li>
                                <li>
                                    <button onClick={logout}  className="
                                                hover:bg-gray-950 cursor-pointer text-[14px]
                                            w-full flex items-center justify-center gap-2 font-medium px-4 py-3 rounded-xl bg-gray-900 text-foreground 
                                            transition-colors
                                            ">
                                                <p>Log out</p>
                                            </button>
                                </li>
                            </>
                            :
                            <>
                                 <li>
                                    <Link className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors" href={"/events"}>Events</Link>
                                </li>
                                <li>
                                    <Link className="text-foreground text-sm hover:text-primary bg-primary  px-3 py-2 rounded-md font-medium transition-colors duration-300 hover:bg-primary/10" href={"/login"}>Sign in with GitHub</Link>
                                </li>
                            
                            </>

                        
                        }
                    </ul>
                    
                </div>
            </div>
        </nav>
    )
}