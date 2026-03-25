
export default function Messages({ msg }) {
  const isUser = msg.sender === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} my-4`}>
      <div
        className={`p-3 rounded-xl wrap-words ${
          isUser
            ? "bg-blue-500 text-white max-w-[70%] md:max-w-[50%]"
            : "text-white max-w-[90%]"
        } break-words`}
        style={{ whiteSpace: "pre-wrap" }}
      >
        {msg.text}
      </div>
    </div>
  );
}