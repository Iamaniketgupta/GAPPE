
import 'quill/dist/quill.snow.css';
import {io} from 'socket.io-client';
import Quill from 'quill';
console.dir(io)
import { useEffect, useState } from 'react';
import { QuillConfiguration } from './toolConfig';
const Tools = () => {
    const [socket,setSocket] = useState();
    const [quill,setQuill] = useState();
    useEffect(() => {
     const quillServer=  new Quill('#editor',QuillConfiguration);
        setQuill(quillServer);
    }, []);

    useEffect(() => {
        const socket = io('http://localhost:3000');
        console.log(socket)
        setSocket(socket);
        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        if (quill && socket) {  
            const handler = (delta, oldDelta, source) => {
                if (source === 'user') {
                    // send to particular event 
                    console.dir(oldDelta)
                    socket.emit('change-triggered', delta);
                }
            };
            quill.on('text-change', handler);

            // got data from backend
            socket.on('got-data-i-am-sending-now', (delta) => {  //here got-data-i-am-sending-now is an event name
                quill.updateContents(delta);
            });
            
            return () => {
                quill.off('text-change', handler);
            };
        }
    }, [quill, socket]);






    return (
   <div className='bg-gray-200 min-h-[110vh] dark:bg-gray-800  text-gray-900  dark:text-gray-100'>
        <div id='editor' className='editor md:w-[70%] w-[95%] bg-white shadow-xl z-50  dark:bg-gray-900 '>
        </div>
   </div>
    );
}

export default Tools;
