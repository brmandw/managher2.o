'use client'
import React, { useState } from 'react';
import Link from "next/link";
import { Home, Telescope, Search, Settings, Menu, X, ChevronRight, User, FileText, BarChart3, Bell, Shield } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

// import {
//     Sidebar,
//     SidebarContent,
//     SidebarFooter,
//     SidebarGroup,
//     SidebarHeader,
// } from "@/components/ui/sidebar"
interface ProjectSidebarProps extends React.HTMLAttributes<HTMLElement> {
  projectId: string;
}

export function AppSidebar({ projectId }: ProjectSidebarProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [activeItem, setActiveItem] = useState("Dashboard");


    const menuItems = [
        { id: 1, title: "Dashboard", icon: Home, url: "./dashboard" },
        { id: 2, title: "Calendar", icon: Telescope, url: `/projects/${projectId}/marketablity` },
        { id: 3, title: "Analytics", icon: BarChart3, url: "#" },
        { id: 5, title: "Documents", icon: FileText, url: "#" },
        { id: 6, title: "Settings", icon: Settings, url: "#" },
    ];
    return (
        <>
            {/* Sidebar */}
            <div
                className={`fixed bg-white shadow-xl transition-all duration-300 ease-in-out ${isOpen ? "w-72" : "w-20"
                    } h-screen`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className={`flex items-center gap-3 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'hidden'}`}>
                        <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        {isOpen && (
                            <div>
                                <h1 className="font-bold text-slate-800">Acme Inc</h1>
                                <p className="text-xs text-slate-500">Premium Plan</p>
                            </div>
                        )}
                    </div>
                </div>
                {/* Navigation */}
                <nav className="p-4 space-y-3">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeItem === item.title;

                        return (
                            <Tooltip delayDuration={300} key={item.id}>
                                <TooltipTrigger>
                                    <Link
                                        onClick={() => setActiveItem(item.title)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                                            ? 'bg-purple-600 text-white shadow-lg shadow-blue-500/30'
                                            : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                        href={item.url}
                                    >
                                        <Icon size={20} className={`${isActive ? 'text-white' : 'text-slate-500'} group-hover:scale-110 transition-transform`} />
                                        {isOpen && (
                                            <>
                                                <span className={`flex-1 text-left font-medium text-sm ${isActive ? 'text-white' : ''}`}>
                                                    {item.title}
                                                </span>
                                                {/* {item.badge && (
                                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${isActive
                                                        ? 'bg-white/20 text-white'
                                                        : 'bg-blue-100 text-blue-600'
                                                        }`}>
                                                        {item.badge}
                                                    </span>
                                                )} */}
                                            </>
                                        )}
                                        {/* {!isOpen && item.badge && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                                {item.badge}
                                            </span>
                                        )} */}
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="bg-black/70 shadow-lg">
                                    <p>{item.title}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </nav>

                {/* Footer - User Profile */}
                <div className="absolute bottom-0 w-full p-4 border-t border-slate-200">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-md">
                            <User size={18} className="text-white" />
                        </div>
                        {isOpen && (
                            <>
                                <div className="flex-1 text-left">
                                    <p className="font-medium text-slate-800 text-sm">John Doe</p>
                                    <p className="text-xs text-slate-500">john@example.com</p>
                                </div>
                                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}

