'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '../icons/Logo';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';

export function NewProjectHeader() {
  const router = useRouter();

  return (
<nav className="z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 fixed top-0 left-0 right-0 md:pr-24 md:pl-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#493D9E] to-[#B2A5FF] rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="text-xl sm:text-2xl font-bold text-[#493D9E]">ManagHer</span>
        </div>

        {/* Desktop Logout Button */}
        <Link
          href="./"
          onClick={(e) => {
            e.preventDefault();
            router.push('/dashboard');
          }}
          className="hidden sm:block bg-[#493D9E] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium hover:bg-[#3d3182] transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm sm:text-base"
        >
          Kembali
        </Link>

        {/* Mobile Logout Button */}
        <Link
          href="./"
          onClick={(e) => {
            e.preventDefault();
            router.push('/dashboard');
          }}
          className="sm:hidden bg-[#493D9E] text-white px-4 py-2 rounded-full font-medium hover:bg-[#3d3182] transition-all duration-300 text-sm"
        >
          Logout
        </Link>

        {/* Commented Avatar Menu - Made Responsive */}
        {/* <nav className="flex items-center space-x-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="@user" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Rina</p>
                  <p className="text-xs leading-none text-muted-foreground">rina@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push('./dashboard')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/')}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav> */}
      </div>
    </nav>
  );
}
