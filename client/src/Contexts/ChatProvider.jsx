import { createContext, useContext, useEffect, useState } from "react";
import { fetchAllChats, fetchAllUsers } from "../constants/apiCalls";
import { getCookie } from "../constants/cookiesApis";
import { useRecoilState } from "recoil";
import { userData } from "../atoms/state";
import { fetchAllNotifications } from "../constants/chatNotificationsApis";
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [allChats, setAllChats] = useState([]);
    const [notifications, setNotifications] = useState([]);
    // const [allNotifications, setAllNotifications] = useState([]);
    const [latestMessage,setLatestMessage] = useState({});
    const [messages, setMessages] = useState([]);
    const token = getCookie('authToken') ;
    const [currUser]=useRecoilState(userData);


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
            // fetchAllChats().then((allChats) => {
            //     setAllChats(allChats);
            // }).catch((error) => {
            //     console.log(error);
            // });
            
            // fetchAllNotifications().then((res) => {
            //     setNotifications(res.notifications);
            // }).catch((error) => {
            //     console.log(error);
            // });

        }

    }, [currUser]);
    


    return (
        <ChatContext.Provider value={{ allUsers, allChats,
            latestMessage,setLatestMessage, messages, setMessages,
            notifications, setNotifications,setAllUsers,setAllChats,
            handleFetchChats }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChatContext = () => useContext(ChatContext);
