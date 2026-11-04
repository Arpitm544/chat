import React, { memo } from 'react'
import { Users } from 'lucide-react'

export const GroupItem = memo(({ group, isActive, onClick }) => (
  <button onClick={onClick} className={`conversation-row ${isActive ? 'is-active' : ''}`}>
    {group.profilePic ? <img src={group.profilePic} alt={group.name} className="contact-avatar" /> : <span className="group-avatar"><Users size={18} /></span>}
    <span className="conversation-copy"><strong>{group.name}</strong><small>{group.members?.length || 0} members</small></span>
  </button>
))

export const UserItem = memo(({ user, chat, isActive, isOnline, onClick }) => {
  const stamp = chat?.latestMessage?.createdAt || chat?.updatedAt
  const time = stamp ? new Intl.DateTimeFormat([], { hour: 'numeric', minute: '2-digit' }).format(new Date(stamp)) : ''
  return <button onClick={onClick} className={`conversation-row ${isActive ? 'is-active' : ''}`}>
    <span className="avatar-wrap">
      {user.profilePic ? <img src={user.profilePic} alt={user.name} className="contact-avatar" /> : <span className="contact-avatar avatar-fallback">{user.name?.[0]?.toUpperCase()}</span>}
      <span className={`presence-dot ${isOnline ? 'is-online' : ''}`} />
    </span>
    <span className="conversation-copy"><strong>{user.name}</strong><small>{chat?.latestMessage?.text || (isOnline ? 'Online' : 'Start a conversation')}</small></span>
    <time>{time}</time>
  </button>
})
