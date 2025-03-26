import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const axiosInstance = axios.create({
  withCredentials: true,
  headers: { "Access-Control-Allow-Origin": "*" },
  credentials: "include",
});

// LocalStorage helper functions
function loadChatFromLocalStorage(chatId) {
  const stored = JSON.parse(localStorage.getItem("recentChats")) || [];
  const found = stored.find((item) => item.chatId === chatId);
  return found ? found.conversation : null;
}

function saveChatToLocalStorage(chatId, conversation) {
  let stored = JSON.parse(localStorage.getItem("recentChats")) || [];
  stored = stored.filter((item) => item.chatId !== chatId);
  stored.push({ chatId, conversation, updatedAt: Date.now() });

  // Keep only the last 5
  while (stored.length > 5) {
    stored.shift();
  }
  localStorage.setItem("recentChats", JSON.stringify(stored));
}

function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { fullName, email: userEmail } = location.state || {};

  const [chats, setChats] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const conversationRef = useRef(null);
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversation]);

  // Load chat IDs for the sidebar
  useEffect(() => {
    axiosInstance
      .get("http://localhost:5001/chats")
      .then((res) => {
        setChats(res.data);
      })
      .catch((err) => console.error("Error fetching chats:", err));
  }, []);

  // Always fetch conversation from server on mount / whenever chatId changes
  useEffect(() => {
    if (!chatId) return;

    // Optional: quick load from localStorage for immediate display
    const localConversation = loadChatFromLocalStorage(chatId);
    if (localConversation) {
      setConversation(localConversation);
    }

    // Then always refetch from server to ensure it's current
    axiosInstance
      .get(`http://localhost:5001/chat/${chatId}`)
      .then((res) => {
        const data = res.data;
        const conv = [];
        if (data.chat) {
          const qs = data.chat.question || [];
          const ans = data.chat.answer || [];
          for (let i = 0; i < qs.length; i++) {
            conv.push({ role: "user", content: qs[i] });
            if (ans[i]) {
              conv.push({ role: "assistant", content: ans[i] });
            }
          }
        }
        setConversation(conv);
        saveChatToLocalStorage(chatId, conv);

        // Update the chat sidebar if the response includes a list of IDs
        if (data.chatIds) {
          setChats(data.chatIds.map((id) => ({ chatId: id })));
        }
      })
      .catch((err) => console.error("Error fetching conversation:", err));
  }, [chatId]);

  const addMessage = (role, content) => {
    setConversation((prev) => [...prev, { role, content }]);
  };

  // "New Chat" button handler
  const handleNewChat = async () => {
    try {
      const res = await axiosInstance.post(
        "http://localhost:5001/api/v1/users/newChat",
        {}
      );
      const data = res.data;

      if (data.data && data.data.chatId) {
        // Initialize empty conversation in local storage
        saveChatToLocalStorage(data.data.chatId, []);

        // Add to local chat list
        setChats((prev) => [...prev, { chatId: data.data.chatId }]);

        // Navigate to new chat, passing user info via state
        navigate(`/chat/${data.data.chatId}`, {
          state: {
            fullName,
            email: userEmail,
          },
        });
      } else {
        console.error("No chatId returned from server.");
      }
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const localHistory = loadChatFromLocalStorage(chatId) || [];
    const newHistory = [...localHistory, { role: "user", content: input }];

    addMessage("user", input);
    saveChatToLocalStorage(chatId, newHistory);
    setLoading(true);
    setInput("");

    try {
      const res = await axiosInstance.post(
        `http://localhost:5001/chat/${chatId}`,
        {
          question: input,
          history: newHistory,
        }
      );

      const data = res.data;
      addMessage("assistant", data.answer);

      const finalHistory = [
        ...newHistory,
        { role: "assistant", content: data.answer },
      ];
      saveChatToLocalStorage(chatId, finalHistory);
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage("assistant", "Error: " + error.message);

      const errorHistory = [
        ...newHistory,
        { role: "assistant", content: "Error: " + error.message },
      ];
      saveChatToLocalStorage(chatId, errorHistory);
    }

    setLoading(false);
  };

  const handleLogout = () => {
    document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    navigate("/login");
  };

  return (
    <div className="h-screen flex">
      {/* LEFT SIDEBAR */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        {/* Top: Title + New Chat button */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">My Chats</h2>
            <button
              onClick={handleNewChat}
              className="bg-[#1d8621] hover:bg-green-600 text-white px-2 py-1 rounded"
            >
              +
            </button>
          </div>
        </div>

        {/* Scrollable chat list */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4">
          {chats.map((chat) => (
            <button
              key={chat.chatId}
              type="button"
              onClick={() =>
                navigate(`/chat/${chat.chatId}`, {
                  state: {
                    fullName,
                    email: userEmail,
                  },
                })
              }
              className={`w-full text-left p-2 rounded mb-2 cursor-pointer ${
                chatId === chat.chatId
                  ? "bg-gray-700"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              Chat {chat.chatId}
            </button>
          ))}
        </div>

        {/* Profile + Logout at bottom */}
        <div className="border-t border-gray-700 p-4">
          <p className="text-sm font-medium">Welcome, {fullName}</p>
          <p className="text-xs text-gray-400">{userEmail}</p>
          <button
            onClick={handleLogout}
            className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col">
        <div
          className="flex-1 p-4 overflow-y-auto bg-gray-900"
          ref={conversationRef}
        >
          {conversation.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3069/3069041.png"
                alt="No chats"
                className="h-24 w-24 mb-4"
              />
              <p className="mt-4 text-xl text-white font-semibold">
                How can I help you today?
              </p>
            </div>
          ) : (
            conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`inline-block p-2 rounded ${
                    msg.role === "user"
                      ? "bg-[#1d8621] text-white" // Outgoing messages in custom green
                      : "bg-gray-700 text-white" // Assistant messages in dark gray
                  }`}
                >
                  <ReactMarkdown>
                    {msg.content.replace(/\n\n/g, "\n")}
                  </ReactMarkdown>
                </div>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleSend} className="p-4 bg-gray-800 flex">
          <input
            type="text"
            className="flex-1 p-2 rounded border border-gray-600 bg-gray-700 text-white"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="ml-2 bg-[#1d8621] text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;
