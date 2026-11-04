import React, { memo } from 'react'
import { Check, CheckCheck, Edit2, Trash2, X } from 'lucide-react'

const MessageItem = ({ 
    msg, 
    loggedInUserId, 
    selectedGroup, 
    users, 
    editingMessageId, 
    editText, 
    setEditText, 
    cancelEditing, 
    submitEdit, 
    startEditing, 
    handleDeleteMessage 
}) => {

    const getMessageContainerClass = (msg) => {
        return msg.senderId === loggedInUserId ? 'message-row message-row--mine' : 'message-row'
    }
    
    const getMessageBubbleClass = (msg) => {
        return msg.senderId === loggedInUserId ? 'message-bubble message-bubble--mine' : 'message-bubble'
    }

    return (
        <div className={getMessageContainerClass(msg)}>
            <div className={`${getMessageBubbleClass(msg)} relative group`}>
                {/* Show sender name in group chat if not me */}
                {selectedGroup && msg.senderId !== loggedInUserId && (
                    <p className="group-sender">
                        {users.find((u) => u._id === msg.senderId)?.name}
                    </p>
                )}
                {msg.image && (
                    <img
                        src={msg.image}
                        alt="sent-img"
                        className="message-image"
                    />
                )}
                
                {editingMessageId === msg._id ? (
                    <div className="flex flex-col gap-2">
                        <input 
                            value={editText} 
                            onChange={(e) => setEditText(e.target.value)}
                            className="message-edit-input"
                        />
                        <div className="flex gap-2 justify-end">
                            <button onClick={cancelEditing} className="text-xs text-red-400"><X size={14}/></button>
                            <button onClick={() => submitEdit(msg._id)} className="text-xs text-green-400"><Check size={14}/></button>
                        </div>
                    </div>
                ) : (
                    <>
                        {msg.text && <p className="message-text">{msg.text}</p>}
                        {msg.isEdited && <span className="message-edited">edited</span>}
                    </>
                )}

                <div className="message-meta">
                    <p className="message-time">
                        {msg.createdAt && new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                    {msg.senderId === loggedInUserId && (
                        <span className="message-delivery">
                            {msg.status === 'read' ? <CheckCheck size={14} /> : 
                             msg.status === 'delivered' ? <CheckCheck size={14} /> :
                             <Check size={14} />}
                        </span>
                    )}
                </div>

                {/* Message Actions (Edit/Delete) - Only for own messages */}
                {msg.senderId === loggedInUserId && !editingMessageId && (
                    <div className="message-actions">
                        <button onClick={() => startEditing(msg)}>
                            <Edit2 size={12} />
                        </button>
                        <button onClick={() => handleDeleteMessage(msg._id)} className="is-delete">
                            <Trash2 size={12} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default memo(MessageItem)
