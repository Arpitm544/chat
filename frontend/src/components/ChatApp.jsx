import React from "react"
import { Routes, Route } from "react-router-dom"
import { MessageCircle } from "lucide-react"
import CreateGroupModal from "./CreateGroupModal"
import ChatSidebar from "./ChatSidebar"
import ChatWindow from "./ChatWindow"
import { ChatProvider, useChat } from "../context/ChatContext"

const EmptyChat = () => (
  <div className="empty-chat">
    <div className="empty-chat__icon"><MessageCircle size={30} /></div>
    <h2>Your messages, in one place</h2>
    <p>Choose a conversation from the list to start chatting.</p>
  </div>
)

const ChatLayout = () => {
  const { 
    showCreateGroupModal, 
    setShowCreateGroupModal,
    allUsers,
    handleCreateGroup
  } = useChat()

  return (
    <main className="chat-shell">
      <section className="chat-frame">
        <ChatSidebar />
        <Routes>
          <Route path="/" element={<EmptyChat />} />
          <Route path="/:type/:id" element={<ChatWindow />} />
        </Routes>
      </section>
      {showCreateGroupModal && <CreateGroupModal users={allUsers} onClose={() => setShowCreateGroupModal(false)} onCreate={handleCreateGroup} />}
    </main>
  )
}

export default function ChatApp() {
  return (
    <ChatProvider>
      <ChatLayout />
    </ChatProvider>
  )
}
