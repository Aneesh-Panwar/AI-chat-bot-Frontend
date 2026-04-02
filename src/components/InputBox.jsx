import React, { useRef, useState } from 'react'
import sendArrow from '../assets/k.svg'

export default function InputBox({ sendMessage, loading, onStop }) {
  const [msg, setMsg] = useState("");
  const inputRef = useRef(null);

  function handleChange(e) {
    setMsg(e.target.value);
    adjustHeight();
  }

  function adjustHeight() {
    const el = inputRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  function handleKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (loading) {
        onStop();
      } else {
        handleSend();
      }
    }
  }

  function handleSend() {
    if (!msg.trim() || loading) return;

    sendMessage(msg.trim());
    setMsg("");

    setTimeout(() => adjustHeight(), 0);
  }

  function handleClick() {
    if (loading) {
      onStop();
    } else {
      handleSend();
    }
  }

  return (
    <div className='md:px-[18%] px-6 w-full'>
      <div className='relative box-border'>
        <textarea
          ref={inputRef}
          value={msg}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          placeholder="Ask about college, admissions, hostel, fees..."
          className="w-full ps-5 pt-4 pb-1 pr-16 rounded-4xl bg-gray-800 text-white resize-none overflow-hidden h-17 max-h-40 shadow-md shadow-slate-800 outline-none border-2"
        />

      
        <button
          onClick={handleClick}
          className="absolute right-3 bottom-5 h-10 w-10 rounded-full flex items-center justify-center bg-white text-black"
        >
          {loading ? (
            // STOP ICON
            <div className="w-4 h-4 bg-black rounded-sm"></div>
          ) : (
            // SEND ICON
            <img src={sendArrow} alt="send" className='p-2' />
          )}
        </button>

      </div>
    </div>
  );
}