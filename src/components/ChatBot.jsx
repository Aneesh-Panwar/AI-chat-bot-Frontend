import { useEffect, useRef, useState } from "react";
import InputBox from "./InputBox";
import Messages from "./Messages";
import { sendChat, streamChat } from "../api/chatApi";

export default function ChatBot() {
  const chatEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const bufferRef = useRef("");
  const isUpdatingRef = useRef(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const sendMessage = async (text) => {
  if (loading) return;

  const userMsg = { text, sender: "user" };
  setMessages((prev) => [...prev, userMsg]);
  setLoading(true);

  try {
    const USE_STREAM = true;

    if (USE_STREAM) {
      // Initialize the empty bot message in the UI
      let botMsg = { text: "", sender: "bot" };
      setMessages(prev => [...prev, botMsg]);

      // Start the streaming process
      await streamChat(text, (chunk) => {
        // Add incoming text to the buffer (useRef)
        bufferRef.current += chunk;

        // Start the typewriter engine if it isn't already running
        if (!isUpdatingRef.current) {
          isUpdatingRef.current = true;

          intervalRef.current = setInterval(() => {
            // Check if the buffer actually has content
            if (!bufferRef.current || bufferRef.current.length === 0) {
              clearInterval(intervalRef.current);
              isUpdatingRef.current = false;
              return;
            }

            // Get the first character
            const char = bufferRef.current[0];
            
            // Ensure the character itself isn't undefined
            if (char === undefined) return;

            setMessages(prev => {
              if (prev.length === 0) return prev; // Safety for empty arrays

              const updated = [...prev];
              const lastIdx = updated.length - 1;
              
              // Ensure the last message exists and has a text property
              const lastMsg = updated[lastIdx];
              if (lastMsg && lastMsg.sender === "bot") {
                updated[lastIdx] = { 
                  ...lastMsg, 
                  text: (lastMsg.text || "") + char 
                };
              }
              return updated;
            });

            // Remove the character from the buffer
            bufferRef.current = bufferRef.current.slice(1);
          }, 20);

           
        }
      });

    } else {
      const result = await sendChat(text);
      const botMsg = { text: result.text, sender: "bot" };
      setMessages((prev) => [...prev, botMsg]);
    }
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
          <div className="text-red-500">Something went wrong. Try again.</div>
        )}

        <div ref={chatEndRef} />
      </div>

      <InputBox sendMessage={sendMessage} loading={loading} />
    </div>
  );
}