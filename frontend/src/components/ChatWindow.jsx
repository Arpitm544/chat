import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../lib/axios'
import imageCompression from 'browser-image-compression'
import GroupInfoModal from './GroupInfoModal'
import MessageItem from './MessageItem'
import { Send, Image as ImageIcon, X } from 'lucide-react'
import { useChat } from '../context/ChatContext'

const ChatWindow = () => {
  const { type, id } = useParams()
  const { 
    allUsers, 
    groups, 
    loggedInUserId, 
    handleDeleteGroup, 
    handleUpdateGroup,
    socket,
    onlineUsers
  } = useChat()
  
  // Local State
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [typingUsers, setTypingUsers] = useState({})
  const [showGroupInfo, setShowGroupInfo] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState(null)
  const [editText, setEditText] = useState("")
  
  const typingTimeoutRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Derived State
  const selectedUser = type === 'user' ? allUsers.find(u => u._id === id) : null
  const selectedGroup = type === 'group' ? groups.find(g => g._id === id) : null

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch Messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!id) return
      setMessages([]) // Clear previous messages
      try {
        let res
        if (type === 'user') {
          res = await axios.get(`/messages/${id}`)
        } else if (type === 'group') {
          res = await axios.get(`/groups/${id}`)
        }
        if (res) setMessages(res.data)
      } catch (error) {
        console.log("Error fetching messages:", error)
      }
    }
    fetchMessages()
  }, [type, id])

  // Socket Listeners
  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (msg) => {
      if (type !== 'user') return
      
      const isMyChat =
        (msg.senderId === loggedInUserId && msg.receiverId === id) ||
        (msg.senderId === id && msg.receiverId === loggedInUserId)

      if (isMyChat) {
        setMessages((prev) => {
          if (prev.some(m => m._id === msg._id)) return prev
          return [...prev, msg]
        })
        // Mark as read if window is open
        if (msg.senderId === id) {
            socket.emit("markMessagesAsRead", { chatId: null, userToChatId: id })
        }
      }
    }

    const handleNewGroupMessage = (msg) => {
      if (type !== 'group') return
      
      if (msg.senderId == loggedInUserId || msg.senderId?.toString() === loggedInUserId) return

      if (msg.groupId === id) {
        setMessages((prev) => {
          if (prev.some(m => m._id === msg._id)) return prev
          return [...prev, msg]
        })
      }
    }

    const handleTyping = ({ chatId, senderId }) => {
        if (type === 'user' && senderId === id) {
            setTypingUsers(prev => ({ ...prev, [senderId]: true }))
        } else if (type === 'group' && chatId === id && senderId !== loggedInUserId) {
            setTypingUsers(prev => ({ ...prev, [senderId]: true }))
        }
    }

    const handleStopTyping = ({ chatId, senderId }) => {
        if ((type === 'user' && senderId === id) || (type === 'group' && chatId === id)) {
            setTypingUsers(prev => {
                const newState = { ...prev }
                delete newState[senderId]
                return newState
            })
        }
    }

    const handleMessagesRead = ({ chatId, readerId }) => {
        setMessages(prev => prev.map(msg => {
            if (msg.senderId === loggedInUserId && (msg.receiverId === readerId || msg.groupId === chatId)) {
                return { ...msg, status: 'read' }
            }
            return msg
        }))
    }

    const handleMessageUpdated = (updatedMessage) => {
        setMessages(prev => prev.map(msg => msg._id === updatedMessage._id ? updatedMessage : msg))
    }

    const handleMessageDeleted = (messageId) => {
        setMessages(prev => prev.filter(msg => msg._id !== messageId))
    }

    socket.on("newmessage", handleNewMessage)
    socket.on("newGroupMessage", handleNewGroupMessage)
    socket.on("typing", handleTyping)
    socket.on("stopTyping", handleStopTyping)
    socket.on("messagesRead", handleMessagesRead)
    socket.on("messageUpdated", handleMessageUpdated)
    socket.on("messageDeleted", handleMessageDeleted)

    return () => {
      socket.off("newmessage", handleNewMessage)
      socket.off("newGroupMessage", handleNewGroupMessage)
      socket.off("typing", handleTyping)
      socket.off("stopTyping", handleStopTyping)
      socket.off("messagesRead", handleMessagesRead)
      socket.off("messageUpdated", handleMessageUpdated)
      socket.off("messageDeleted", handleMessageDeleted)
    }
  }, [socket, type, id, loggedInUserId])

  // Mark messages as read on mount/update
  useEffect(() => {
      if (type === 'user' && id && messages.length > 0) {
          const unreadMessages = messages.some(m => m.senderId === id && m.status !== 'read')
          if (unreadMessages) {
              socket.emit("markMessagesAsRead", { chatId: null, userToChatId: id })
          }
      }
  }, [type, id, messages, socket])


  // Actions
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const compressed=await imageCompression(file,{
      maxSizeMB:0.5,
      maxWidthOrHeight:880,
    })

    const reader = new FileReader()
    reader.readAsDataURL(compressed)
    reader.onloadend = () => {
      setImageFile(reader.result) 
    } 
  }

  const sendMessage = async () => {
    if (!text.trim() && !imageFile) return

    try {
      let res
      if (type === 'user') {
        res = await axios.post(
          `/messages/${id}`,
          { text, image: imageFile }
        )
      } else if (type === 'group') {
        res = await axios.post(
          "/groups/send",
          { 
            groupId: id,
            senderId: loggedInUserId,
            text, 
            image: imageFile 
          }
        )
      }

      if (res && res.data) {
        setText("")
        setImageFile(null)
        setMessages((prev) => {
          if (prev.some(m => m._id === res.data._id)) return prev
          return [...prev, res.data]
        })
      }
    } catch (error) {
      console.log("Error sending message:", error)
    }
  }

  const handleTypingAction = (isTyping) => {
      if (type === 'user') {
          socket.emit(isTyping ? "typing" : "stopTyping", { chatId: null, receiverId: id })
      } else if (type === 'group') {
          socket.emit(isTyping ? "typing" : "stopTyping", { chatId: id, receiverId: null })
      }
  }

  const handleInputChange = (e) => {
      setText(e.target.value)
      
      if (!typingTimeoutRef.current) {
          handleTypingAction(true)
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

      typingTimeoutRef.current = setTimeout(() => {
          handleTypingAction(false)
          typingTimeoutRef.current = null
      }, 2000)
  }

  const startEditing = (msg) => {
      setEditingMessageId(msg._id)
      setEditText(msg.text)
  }

  const cancelEditing = () => {
      setEditingMessageId(null)
      setEditText("")
  }

  const submitEdit = (msgId) => {
      if (editText.trim()) {
          socket.emit("editMessage", { messageId: msgId, newText: editText })
          setEditingMessageId(null)
          setEditText("")
      }
  }

  const handleDeleteMessage = (messageId) => {
      if(!window.confirm("Delete this message?")) return
      socket.emit("deleteMessage", { messageId })
  }

  // If ID is present but user/group not found yet (loading), show loading or nothing
  // But usually users/groups are loaded.
  
  if (!selectedUser && !selectedGroup) {
      return <div className="empty-chat"><div className="empty-chat__icon">…</div><p>Loading conversation…</p></div>
  }

  const chatName = selectedUser ? selectedUser.name : selectedGroup?.name
  const chatImage = selectedUser ? selectedUser.profilePic : selectedGroup?.profilePic
  const chatPlaceholder = selectedUser ? selectedUser.name?.[0] : selectedGroup?.name?.[0]

  return (
    <div className="chat-window">
      {showGroupInfo && selectedGroup && (
        <GroupInfoModal
          group={selectedGroup}
          onClose={() => setShowGroupInfo(false)}
          onDeleteGroup={handleDeleteGroup}
          currentUserId={loggedInUserId}
          onUpdateGroup={handleUpdateGroup}
          users={allUsers}
        />
      )}

      {/* HEADER */}
      <header className="chat-header">
        <div 
            className={`chat-person ${selectedGroup ? 'is-clickable' : ''}`}
            onClick={() => selectedGroup && setShowGroupInfo(true)}
        >
            {/* Back button for mobile could go here */}
            {chatImage ? (
              <img src={chatImage} alt={chatName} className="chat-avatar" />
            ) : (
              <div className="chat-avatar chat-avatar--fallback">
                {chatPlaceholder || '?'}
              </div>
            )}
            <div>
              <span className="chat-name">{chatName}</span>
              {selectedGroup && <span className="chat-status">{selectedGroup.members.length} members</span>}
              {selectedUser && typingUsers[id] && <span className="chat-status is-typing">Typing...</span>}
              {selectedUser && !typingUsers[id] && <span className="chat-status"><i className={onlineUsers.includes(id) ? 'status-dot' : ''} />{onlineUsers.includes(id) ? 'Online' : 'Offline'}</span>}
              {selectedGroup && Object.keys(typingUsers).length > 0 && <span className="chat-status is-typing">Someone is typing...</span>}
            </div>
        </div>

      </header>

      {/* MESSAGES */}
      <div className="message-area custom-scrollbar">
        {messages.map((m, i) => (
          <MessageItem 
            key={i} 
            msg={m}
            loggedInUserId={loggedInUserId}
            selectedGroup={selectedGroup}
            users={allUsers}
            editingMessageId={editingMessageId}
            editText={editText}
            setEditText={setEditText}
            cancelEditing={cancelEditing}
            submitEdit={submitEdit}
            startEditing={startEditing}
            handleDeleteMessage={handleDeleteMessage}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR */}
      <div className="composer-wrap">
        {imageFile && <div className="image-ready"><span>Image ready to send</span><button onClick={() => setImageFile(null)} aria-label="Remove selected image"><X size={14} /></button></div>}
        <div className="composer">
        <label className="attach-button" title="Attach image">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <ImageIcon className="w-5 h-5" />
        </label>

        <div className="flex-1 relative">
          <input
            value={text}
            onChange={handleInputChange}
            placeholder="Write a message"
            className="message-input"
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
        </div>

        <button
          onClick={sendMessage}
          className="send-button"
          disabled={!text.trim() && !imageFile} 
        >
          <Send className="w-5 h-5" />
        </button>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow
