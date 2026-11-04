import React from 'react'
import Search from './Search'
import Navbar from './Navbar'
import { Users, Plus } from 'lucide-react'
import { GroupItem, UserItem } from './SidebarItems'
import { useChat } from '../context/ChatContext'
import { useNavigate, useParams } from 'react-router-dom'

const ChatSidebar = () => {
  const { 
    me, 
    chats, 
    groups, 
    onlineUsers, 
    setShowCreateGroupModal 
  } = useChat()

  const navigate = useNavigate()
  const { type, id } = useParams()

  const handleSelectUser = (userId) => {
    navigate(`/chat/user/${userId}`)
  }

  return (      
    <aside className="conversation-panel">
      <div className="conversation-panel__top">
        <div className="panel-heading"><div><p className="eyebrow">Welcome back</p><h1>Messages</h1></div><Navbar /></div>
        <Search onSelectUser={handleSelectUser} />
      </div>
      <div className="conversation-list custom-scrollbar">
        {groups.length > 0 && (
          <section className="conversation-section">
            <h3 className="section-label">
              <Users className="w-3 h-3" /> Groups
            </h3>
            <div>
              {groups.map((g) => (
                <GroupItem 
                  key={g._id}
                  group={g}
                  isActive={type === 'group' && id === g._id}
                  onClick={() => navigate(`/chat/group/${g._id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* USERS LIST */}
        <section className="conversation-section">
          <h3 className="section-label">Direct messages</h3>
          <div>
            {chats.map((chat) => {
              const otherUser = chat.users.find((u) => u._id !== me?._id);
              if (!otherUser) return null;
              return (
                <UserItem 
                  key={chat._id}
                  user={otherUser}
                  chat={chat}
                  isActive={type === 'user' && id === otherUser._id}
                  isOnline={onlineUsers.includes(otherUser._id)}
                  onClick={() => navigate(`/chat/user/${otherUser._id}`)}
                />
              )
            })}
          </div>
        </section>
      </div>
      <div className="panel-footer">
        <button
          onClick={() => setShowCreateGroupModal(true)}
          className="new-group-button"
        >
          <Plus className="w-5 h-5" /> New Group
        </button>
      </div>
    </aside>
  )
}
export default ChatSidebar
