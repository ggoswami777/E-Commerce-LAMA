import React from 'react'
import Link from "next/link"
import Image from 'next/image'
import SearchBar from './SearchBar'
import { Bell, Home, ShoppingCart } from 'lucide-react'
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

import ShoppingCartIcon from './ShoppingCartIcon'
import ProfileButton from './ProfileButton'

const Navbar = () => {
  return (
    <div className='w-full flex items-center justify-between'>
        {/* left */}
        <Link href="/" className='flex items-center border-b border-gray-200 pb-4'>
            <Image src="/logo.png" alt="TrendLama" width={36} height={36} className="w-6 h-6 md:w-9 md:h-9"/>
            <p className=' hidden md:block text-md font-medium tracking-wider'>TRENDLAMA</p>
        </Link>
        {/* right */}
        <div className='flex items-center gap-6'>
            <SearchBar/>
            <Link href="/" >
            <Home className='w-4 h-4 text-gray-500 '/></Link>
            <Bell className='w-4 h-4 text-gray-500 '/>
            <ShoppingCartIcon/>
            <Show when="signed-out">
              <SignInButton />
              <SignUpButton>
                <button className="bg-purple-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <ProfileButton/>
            </Show>
        </div>
    </div>
  )
}

export default Navbar