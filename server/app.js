const cors = require('cors')
const express = require('express')
const http = require('http')
const path = require('path')
const socketIo = require('socket.io')

const port = process.env.PORT || 4001
// const index = require('./routes/index')

const app = express()
// app.use(index)
app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use('/', express.static(path.join(__dirname, 'public')))

// Handles any requests that don't match the ones above
app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: '*'
    }
});


const sockets = [];

io.on('connection', (socket) => {
    
    console.log(sockets)
    console.log('New client connected', socket.id);
    sockets.push(socket.id)
    console.log(socket.handshake.query.role)

    socket.join('karaoke');
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    socket.on('show-intro', () => {
        socket.to('karaoke').emit('to-intro');
    });

    socket.on('show-categories', (args) => {
        console.log('show-categories', args);
        socket.to('karaoke').emit('to-categories', args);
    });

    socket.on('show-song-list', (args) => {
        console.log('show-song-list', args);
        socket.to('karaoke').emit('to-song-list', args);
    });

    socket.on('goto-song', (args) => {
        socket.to('karaoke').emit('to-song', args);
    });

    socket.on('play-song', () => {
        socket.to('karaoke').emit('play');
    });

    socket.on('propose-lyrics', (args) => {
        socket.to('karaoke').emit('show-suggested-lyrics', args);
    });

    socket.on('validate-lyrics', () => {
        socket.to('karaoke').emit('validate-lyrics');
    });

    socket.on('freeze-lyrics', () => {
        socket.to('karaoke').emit('freeze-lyrics');
    });

    socket.on('reveal-lyrics', () => {
        socket.to('karaoke').emit('reveal-lyrics');
    });

    socket.on('set-perf-mode', (args) => {
        socket.to('karaoke').emit('set-perf-mode', args);
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`))
