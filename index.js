const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let timerSettings = {
    title: 'Default Title',
    description: 'Default Description',
    endTime: Date.now() + 60000 // 1 minute from now
};

app.use(express.json());

// Admin 페이지에서 타이머 설정을 관리
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

// 타이머가 출력되는 페이지
app.get('/timer', (req, res) => {
    res.sendFile(__dirname + '/timer.html');
});

// 타이머 설정 업데이트
app.post('/admin/update-timer', (req, res) => {
    timerSettings = {
        title: req.body.title,
        description: req.body.description,
        endTime: new Date(req.body.endTime).getTime()
    };
    io.emit('timerUpdated', timerSettings); // 모든 클라이언트에 업데이트 전송
    res.status(200).send('Timer updated');
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.emit('timerUpdated', timerSettings);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Listening on port 3000');
});
