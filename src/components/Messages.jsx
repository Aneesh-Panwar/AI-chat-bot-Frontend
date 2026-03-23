import React from "react";

export default function Messages({ msg }) {
  const isUser = msg.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-4`}>
      <div
        className={`p-3 rounded-xl break-words max-w-[70%] md:max-w-[40%] ${
          isUser
            ? "bg-blue-500 text-white"
            : "bg-gray-700 text-white"
        }`}
        style={{ whiteSpace: "pre-wrap" }}
      >
        {msg.text}
      </div>
    </div>
  );
}