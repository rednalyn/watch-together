"use client"
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
let socket:any;

const Home = () => {
  const [input, setInput] = useState('')

  useEffect(() => {socketInitializer()}, [])

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('update-input', msg => {
      setInput(msg)
    })
  }

  const onChangeHandler = (e:any) => {
    setInput(e.target.value)
    socket.emit('input-change', e.target.value)
  }

  return (
    <input
      placeholder="Type something"
      value={input}
      className='text-black'
      onChange={onChangeHandler}
    />
  )
}

export default Home;
// "use client"
// import Player from "@/src/components/player";
// export default function room({ params }: { params: { room: string } }) {
//   let videoCode = "DLXwnPMbivE"
//   return (
//     <main>
//       <h1>room: {params.room}</h1>
//       <button onClick={() => {videoCode = "EpxrDorr1i8"}} >annnanna videeeo</button>
//       <Player videoCode={videoCode} />
//       <div id="player"></div>
//     </main>
//   );
// }
