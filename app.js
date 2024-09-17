const express=require('express')
const socketio=require('socket.io')
const app=express()
const path=require('path')
app.use(express.static(path.join(__dirname,'public')))
app.get('/',(req,res)=>{
res.send('Testing api')
})
const server=app.listen(4000,()=>{console.log('server is running port 4000');
})
const io=socketio(server)
io.on('connection',socket=>{
    console.log('New connection made-',socket.id);
    socket.on('joinRoom',({ room, userName }) =>{
        socket.join(room);
        socket.room = room;
        socket.userName = userName;
        console.log(`${userName} joined room ${room}`);
        // console.log(`socket ${socket.id} joinRoom ${room}`);
    }) 
    // socket.on('message',({room,message})=>{
    //     console.log(room,message)
    //     socket.to(room).emit('message',{id:socket.id,message:message})
    // })
    socket.on('message', (data, callback) => {
        io.to(data.room).emit('message', {
            userName: data.userName,
            message: data.message
        });
        callback('Message delivered');
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
})
