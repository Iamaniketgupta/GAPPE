import { createContext, useContext, useEffect, useState } from "react";
import { fetchAllChats, fetchAllChatsMessages, fetchAllUsers } from "../constants/apiCalls";
import { getCookie } from "../constants/cookiesApis";
import { useRecoilState } from "recoil";
import { accessedChat, userData } from "../atoms/state";
import { fetchAllNotifications } from "../constants/chatNotificationsApis";
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [allChats, setAllChats] = useState([]);
    const [notifications, setNotifications] = useState([]);
    // const [allNotifications, setAllNotifications] = useState([]);
    const [latestMessage,setLatestMessage] = useState({});
    const [messages, setMessages] = useState([]);
    const [allChatsMessages, setAllChatsMessages] = useState([]);
    const token = getCookie('authToken') ;
    const [currUser]=useRecoilState(userData);
    const [currSelectedChat] = useRecoilState(accessedChat);


   const handleFetchChats = () => {

    fetchAllChats().then((allChats) => {
        setAllChats(allChats);
    }).catch((error) => {
        console.log(error);
    });
     
    }
    useEffect(() => {
        
        if (token) {
            handleFetchChats();

            fetchAllUsers().then((allUsers) => {
                setAllUsers(allUsers?.users);
            }).catch((error) => {
                console.log(error);
            });
         
            
            fetchAllChatsMessages().then((res) => {
                setAllChatsMessages(res.allChatsMessages);
            }).catch((error) => {
                // console.log(error);
            });
            
        }
        
    }, [currUser, token]);
    


    return (
        <ChatContext.Provider value={{ allUsers, allChats,
            latestMessage,setLatestMessage, messages, setMessages,
            notifications, setNotifications,setAllUsers,setAllChats,
            handleFetchChats ,allChatsMessages,setAllChatsMessages}}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChatContext = () => useContext(ChatContext);
