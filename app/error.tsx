"use client"

import { useEffect } from "react";

import Container from "@/components/ui/container";
import { BiErrorCircle } from "react-icons/bi";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.log(error)
  }, [error])

  return (
    <Container className='flex h-[calc(100vh-320px)] items-center justify-center'>
      <div className='flex flex-col items-center space-y-4'>
        <BiErrorCircle size={24} className='text-black dark:text-white' />
        <h1>Oh no, something went wrong... maybe refresh?</h1>
        <button 
          onClick={reset}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    </Container>
  )
}
