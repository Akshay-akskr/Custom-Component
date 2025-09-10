import React, { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase";
import Message from "../Message";
import RoomMessage from "./RoomMessage";

const ChatRoomBox = ({ room }) => {
  const [messages, setMessages] = useState([]);
  //const [activeusers, setActiveUsers] = useState([]);
  const scroll = useRef();

  useEffect(() => {
    const msg = query(
      collection(db, "chat-rooms", room, "messages"),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(msg, (QuerySnapshot) => {
      const fetchedMessages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setMessages(sortedMessages);

      //let users = getActiveUsers(sortedMessages);
      //setActiveUsers(users);
    });
    return () => unsubscribe;
  }, [room]);

  /*const getActiveUsers = (msgs) => {
    let users = [];
    msgs.forEach(msgObj => {
      const isUserExist = users.find(({ name }) => name === msgObj['name']);
      if(!isUserExist){
        users.push({name:msgObj['name'], avatar:msgObj['avatar']});
      }
    });
    return users;
  }*/

  return (
    <>
      <main className="chat-box">
        <div className="messages-wrapper">
          {messages?.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </div>
        {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
        <span ref={scroll}></span>
        <RoomMessage scroll={scroll} room={room} />
      </main>
    </>
  );
};

export default ChatRoomBox;
