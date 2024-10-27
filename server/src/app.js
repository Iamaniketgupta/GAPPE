import express from 'express';
const app = express();
app.use(express.json());
import cors from 'cors'
import UserRouter from './routes/user.routes.js';
import FetchUsers from './routes/fetchUsers.routes.js';
import ChatRoutes from './routes/chat.routes.js';
import MessageRoutes from './routes/message.routes.js';
import NotificationRoutes from './routes/notifications.routes.js';
import { PeerServer } from 'peer';

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials:true
}))

// const peerServer = PeerServer({ 
//     port: process.env.PORT || 9000,
//     path: '/peerjs', 
//     allow_discovery: true,
// });

// app.use('/peerjs', peerServer);


app.use('/api/user',UserRouter);
app.use('/api/users',FetchUsers);
app.use('/api/chat',ChatRoutes);
app.use('/api/message',MessageRoutes);
app.use('/api/notification',NotificationRoutes);
export default app;