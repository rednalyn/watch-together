"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 
import { checkExistingRoom } from '../api/socketApi';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();  

  const randomRoom = async (input: String) => {
    if (input.length === 0) {
      return crypto.randomUUID();
    } else {
      const roomExists = await checkExistingRoom(input);
      if (roomExists) {
        alert('Room already exists');
        return '';
      } else {
        return input;
      }
    }
  };

  const handleCreateRoom = async () => {
    const roomName = await randomRoom(inputValue);
    if (roomName) {
      router.push(`/${roomName}`);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter room name"
          className="mb-4 px-4 py-2 border rounded text-black"
        />
        <button
          onClick={handleCreateRoom}
          className="px-4 py-2 bg-customPink text-white rounded"
        >
          Create room
        </button>
      </div>
    </main>
  );
}
