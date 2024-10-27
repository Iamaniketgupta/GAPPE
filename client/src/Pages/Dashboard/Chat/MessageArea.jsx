import React, { useEffect, useState } from 'react';
import { FaRegSmile, FaMicrophone, FaPaperPlane } from "react-icons/fa";
import { IoAdd } from 'react-icons/io5';
import { RiSendPlane2Fill } from 'react-icons/ri';
import { sendMessage } from '../../../constants/apiCalls';
import EmojiPicker from 'emoji-picker-react';
import { useRecoilState } from 'recoil';
import { userData } from '../../../atoms/state';
import { useSocket } from '../../../Contexts/SocketProvider';

const MessageArea = ({
  currSelectedChat,
  setMessages,
  setLatestMessage,
  setIsTyping
}) => {
  const socket = useSocket()
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [currentUser] = useRecoilState(userData);
  const [typing, setTyping] = useState(false);


  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage({ chatId: currSelectedChat._id, content: message })
        .then((res) => {
          socket?.emit('new message', res.message);
          setMessages((prev) => [...prev, res.message]);
        });
      setMessage('');
    }
  };

  // HANDLE TYPING STATE REAL TIME
  const handleChange = (e) => {
    setMessage(e.target.value);
    if (!socket) return;


    if (!typing) {
      setTyping(true);
      socket?.emit("typing", { roomId: currSelectedChat?._id, user: currentUser });
    }
    clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        setTyping(false);
        socket?.emit("stop typing", currSelectedChat?._id);
      }, 1000)
    );

    // if (e.target.value.trim().length > 0) {
    //   setIsTyping(true);
    // } else {
    //   setIsTyping(false);
    // }

  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const onEmojiClick = (event) => {
    setMessage((prev) => prev + event.emoji);
  };
  return (
    <div className='w-full relative bg-gray-200 border-t dark:border-stone-800 dark:bg-stone-900 dark:text-gray-300 px-6 
          py-4 h-16 flex items-center'>

      {/* Left icons (smile, add icon) */}
      <div className='flex items-center text-2xl text-gray-600 dark:text-gray-300 gap-3'>
        <FaRegSmile className='cursor-pointer' onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
        <label htmlFor="file">
          <IoAdd className='cursor-pointer' />
        </label>
        <input type="file" name="file" id="file" hidden />
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className='absolute bottom-16 left-6 z-10'>
          <EmojiPicker
            height={350}
            emojiStyle="facebook"
            width="20rem"
            lazyLoadEmojis={true}
            onEmojiClick={onEmojiClick} />
        </div>
      )}
      {/* Input area */}
      <textarea
        value={message}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        placeholder="Type a message"
        className='flex-grow bg-white dark:bg-stone-700 text-gray-800 dark:text-gray-300 resize-none 
          h-10 p-2 px-4 rounded-lg mx-4 border-0 outline-none'
      />

      <div className='text-2xl text-gray-600 dark:text-gray-300'>
        {message.trim() ? (
          <RiSendPlane2Fill onClick={handleSendMessage} className='cursor-pointer' />
        ) : (
          <FaMicrophone className='cursor-pointer' />
        )}
      </div>
    </div>
  );
}

export default MessageArea;
