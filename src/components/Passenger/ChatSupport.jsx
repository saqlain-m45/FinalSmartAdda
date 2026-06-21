import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, limit, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { FaPaperPlane, FaTimes, FaCommentDots, FaUserTie } from 'react-icons/fa';

const ChatSupport = () => {
  const { currentUser, userData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef();

  useEffect(() => {
    if (!currentUser || !isOpen) return;

    // Fetch messages for current user (Support ticket approach)
    const q = query(
      collection(db, 'chats'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsubscribe();
  }, [currentUser, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    try {
      await addDoc(collection(db, 'chats'), {
        userId: currentUser.uid,
        userName: userData?.name || 'User',
        message: newMessage,
        sender: 'user',
        createdAt: new Date().toISOString()
      });
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  if (!currentUser || userData?.role === 'admin') return null;

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 10000 }}>
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{ 
            width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(13, 124, 63, 0.4)', border: 'none' 
          }}
        >
          <FaCommentDots size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="card fade-in" style={{ width: '380px', height: '550px', padding: 0, display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', borderRadius: '24px', overflow: 'hidden' }}>
          <div style={{ background: 'var(--primary)', padding: '20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaUserTie />
               </div>
               <div>
                  <h4 style={{ margin: 0 }}>Smart Adda Support</h4>
                  <p style={{ margin: 0, fontSize: '11px', opacity: 0.8 }}>Typically replies in 5 minutes</p>
               </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', color: 'white' }}><FaTimes /></button>
          </div>

          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.length === 0 && (
               <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--grey)' }}>
                  <p>Salam! 👋 How can we help you today? Leave a message and our support team will get back to you.</p>
               </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} style={{ 
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: msg.sender === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0',
                background: msg.sender === 'user' ? 'var(--primary)' : '#F0F2F5',
                color: msg.sender === 'user' ? 'white' : 'var(--dark)',
                fontSize: '14px',
                lineHeight: '1.4',
                boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
              }}>
                {msg.message}
                <p style={{ margin: '5px 0 0', fontSize: '10px', opacity: 0.6, textAlign: 'right' }}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            ))}
            <div ref={scrollRef}></div>
          </div>

          <form onSubmit={handleSendMessage} style={{ padding: '20px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ flex: 1, padding: '12px 15px', borderRadius: '12px', border: '1px solid #E0E0E0', fontSize: '14px' }}
            />
            <button type="submit" style={{ width: '45px', height: '45px', background: 'var(--primary)', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatSupport;
