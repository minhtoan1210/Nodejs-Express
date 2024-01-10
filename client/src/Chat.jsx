import { useEffect, useState } from "react";
import socket from "./socket";
import axios from "axios";

const profile = JSON.parse(localStorage.getItem("profile"));
const usernames = [
  {
    name: "user1",
    value: "user656fc57b92108a6958a30802",
  },
  {
    name: "user2",
    value: "user656acc4f762247ddf2d303af",
  },
];
export default function Chat() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState("");
  const getProfile = (username) => {
    axios
      .get(`/users/${username}`, {
        baseURL: import.meta.env.VITE_API_URL,
      })
      .then((res) => {
        setReceiver(res.data.result._id);
        alert(`Now you can chat with ${res.data.result.name}`);
      });
  };
  useEffect(() => {
    socket.auth = {
      _id: profile._id,
    };

    socket.connect();
    socket.on("private receiver message", (data) => {
      console.log(data);
      setMessages((messages) => [
        ...messages,
        {
          content: data.content,
          isSender: false,
        },
      ]);
    });

    // socket.on("connect", () => {
    //   console.log(socket.id); // x8WIv7-mJelg7on_ALbxs
    //   socket.emit("hello", "Minh Toan");
    // });

    // socket.on("disconnect", () => {
    //   console.log(socket.id); // undefined
    // });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("asd");
    setValue("");
    socket.emit("private message", {
      content: value,
      to: receiver,
      from: profile._id,
    });
    setMessages((messages) => [
      ...messages,
      {
        content: value,
        isSender: true,
      },
    ]);
  };

  console.log("messages", messages);
  return (
    <div>
      <h1>Chat</h1>
      <div>
        {usernames.map((username) => (
          <div key={username.name}>
            <button onClick={() => getProfile(username.value)}>
              {username.name}
            </button>
          </div>
        ))}
      </div>
      {messages.map((message, index) => {
        return (
          <div key={index}>
            <p>{messages.isSender}</p>
            <div className={message.isSender ? "aqua" : "black"}>
              {message.content}
            </div>
          </div>
        );
      })}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        ></input>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
