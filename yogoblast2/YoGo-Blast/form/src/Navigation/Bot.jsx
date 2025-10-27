import React, { useState } from "react";
 import { ChatBubbleLeftRightIcon ,XMarkIcon} from "@heroicons/react/24/solid";

import axios from "axios";
import { Link } from "react-router-dom";

const Bot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [Isopen, setIsopen] = useState (false);
  const sendMessage = async () => {
    if (!input.trim()) return;

    var newMessages = [...messages, { sender: "user", text: input }];
    var botReply="waiting..."
    newMessages = [...newMessages, { sender: "bot", text: botReply }];
    setMessages(newMessages);

    setInput("");

    try {
      const res = await axios.post("http://localhost:3001/pages/chat", { message: input });
       botReply = res.data.reply;
  newMessages = newMessages.map((item) =>
  item.text === "waiting..." ? { ...item, text: botReply } : item
);


        setMessages(newMessages);
     console.log(botReply);

    } catch (error) {
console.error("❌ Error sending message:", error);}
  };

  return (
    <>
  <div>
     {Isopen ? (
    <XMarkIcon className="w-4 h-4 text-white xmsg" onClick={()=>{setIsopen(!Isopen)}} title="close chat"/>
  ) : (
    <ChatBubbleLeftRightIcon className="w-5 h-4 text-white msg" onClick={()=>{setIsopen(!Isopen)}} title="open chat"/>
  )}
  </div>
    {Isopen && (
    <div style={styles.container} className="bot">
      <h1 style={styles.header}>💬 ShrewdBot</h1>
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              background: msg.sender === "user" ? "#007bff" : "#e5e5ea",
              color: msg.sender === "user" ? "white" : "black"
            }}
          >
          {typeof msg.text === "object" && msg.text !== null ? (
  msg.text.category === "navigation" ? (
    <Link to={msg.text.content =='/home' ? '' :`/home${msg.text.content}`  } style={{textDecoration:"none"}}>
      You can use the link provided → home{msg.text.content}
    </Link>
  ) : (
    <span>{msg.text.content}</span>
  )
) : (
  <span>{msg.text}</span>
)}

          </div>
        ))}
      </div>
      <div style={styles.inputBox}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button style={styles.button} onClick={sendMessage}>Send</button>
      </div>
    </div>)}

</>);
};

const styles = {
  container: {
    width: "300px",
    margin: "50px auto",
    border: "1px solid #ccc",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    padding: "15px",
    background: "#fafafa",
    overflowY: "auto",
    height: "350px",
    scrollbarWidth: "none"
  },
  header: {
    textAlign: "center"
  },
  chatBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "10px",
    overflowY: "auto",
    height: "150px"
  },
  message: {
    padding: "10px",
    borderRadius: "8px",
    maxWidth: "70%"
  },
  inputBox: {
    display: "flex",
    flexDirection:"row",
    gap: "5px"
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px 15px",
    borderRadius: "5px",
    background: "#007bff",
    color: "white",
    border: "none",
   height:"2.5rem",

  }
};

export default Bot;
