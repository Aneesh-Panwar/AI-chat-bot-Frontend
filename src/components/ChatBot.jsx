import React, { useEffect, useRef, useState } from "react";
import InputBox from "./InputBox";
import Messages from "./Messages";
import { sendChat } from "../api/chatApi";

export default function ChatBot() {
  const chatEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    if (loading) return;

    const userMsg = { text, sender: "user" };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const result = await sendChat(text);

      const botMsg = {
        text: result.text,
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMsg]);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen flex flex-col justify-between bg-gray-900 text-white">

     
      {!messages.length && (
        <h1 className="font-bold text-4xl text-center text-gray-500 flex justify-center items-center h-full">
          Hey there...!! <br /> How can I help you?
        </h1>
      )}

     
      <div className="flex-1 overflow-y-auto px-6 md:px-[18%] space-y-2">
        {messages.map((msg, i) => (
          <Messages key={i} msg={msg} />
        ))}

        {loading && (
          <div className="text-gray-400">Typing...</div>
        )}

        {(error && !loading) && (
          <div className="text-red-500">Error occurred</div>
        )}

        <div ref={chatEndRef} />
      </div>

      <InputBox sendMessage={sendMessage} loading={loading} />
    </div>
  );
}