import { playerMessage } from '@/src/interfaces/playerMessages'
import { Server } from 'socket.io'

const SocketHandler = (req:any, res:any) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {
      socket.on('playerState-change', (msg:playerMessage) => {
        socket.broadcast.emit('update-playerState', msg)
      })
      socket.on('playerProgress-change', (msg:playerMessage) => {
        socket.broadcast.emit('update-playerProgress', msg)
      })
    })
  }
  res.end()
}

export default SocketHandler