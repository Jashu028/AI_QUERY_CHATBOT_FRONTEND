import { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, IconButton, Typography, TextField, 
  CircularProgress} from '@mui/material';
import { MessageCircle, Minimize2, Maximize2, X, Send } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Login from '../../pages/Auth/Login';
import { api } from '../../util/axios';
import ReactMarkdown from "react-markdown";

export const Chatbot = () => {
  const { isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState('');
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([
    { text: "Hi! How can I help you today?", isBot: true },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  type Message = {
    content: string;
    sender: string;
  };
  
  useEffect(() => {
    if (isAuthenticated && isOpen && isFirstOpen) {
      api.get('/chat/history')
        .then((res) => {
          console.log("Chat history response:", res.data);
          if (Array.isArray(res.data)) {
            if(res.data.length != 0){
              setMessages(res.data.map((msg: Message) => ({
                text: msg.content,
                isBot: msg.sender === "bot"
              })));
            }
          } else {
            console.error("Unexpected response format:", res.data);
          }
          setIsFirstOpen(false);
        })
        .catch((err) => console.error("Error fetching chat history", err));
    }
  }, [isAuthenticated, isOpen]);
  



  const handleSend = async () => {
    if (!message.trim()) return;

    
    const newUserMessage = { text: message, isBot: false };
    setMessages((prev) => [...prev, newUserMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      
      const response = await api.post("/chat/sendMessage", { content: message });
      
      
      const botResponse = { text: response.data.content, isBot: true };
      setMessages((prev) => [...prev, botResponse]);
      
    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };
  
  const toggleMaximize = () => {
    setIsMaximized((prev) => !prev);
  };
  

  if (!isOpen) {
    return (
      <IconButton
        onClick={toggleChat}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
          animation: 'bounce 2s infinite',
          '@keyframes bounce': {
            '0%, 100%': {
              transform: 'translateY(0)',
            },
            '50%': {
              transform: 'translateY(-10px)',
            },
          },
        }}
      >
        <MessageCircle />
      </IconButton>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: {
          xs: '90%',
          sm: isMaximized ? '80%' : 400,
          md: isMaximized ? '60%' : 400,
          lg: isMaximized ? '50%' : 400,
        },
        height: {
          xs: isMaximized ? '80%' : 400,
          sm: isMaximized ? '80%' : 500,
        },
        display: 'flex',
        borderRadius: 5,
        flexDirection: 'column',
        zIndex: 1300,
      }}
    >


      <Box
        sx={{
          p: 2,
          backgroundColor: 'primary.main',
          color: 'white',
          display: 'flex',
          borderStartStartRadius: 20,
          borderStartEndRadius: 20,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">AI Assistant</Typography>
        <Box>
          <IconButton size="small" onClick={toggleMaximize} sx={{ color: 'white' }}>
            {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </IconButton>
          <IconButton size="small" onClick={toggleChat} sx={{ color: 'white' }}>
            <X size={20} />
          </IconButton>
        </Box>
      </Box>


      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxHeight: { xs: '55vh', sm: 'none' },
        }}
      >

        {isAuthenticated ? messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
              backgroundColor: msg.isBot ? 'grey.100' : 'primary.main',
              color: msg.isBot ? 'text.primary' : 'white',
              p: 1,
              px: 2,
              borderRadius: 2,
              maxWidth: '80%',
            }}
          >
        <Box>
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a style={{ color: "blue", textDecoration: "underline" }} {...props} />
              ),
            }}
          >
            {msg.text}
          </ReactMarkdown>
        </Box>
        <div ref={chatEndRef} />
          </Box>
        )) : <Login />}

        {isTyping && isAuthenticated && (
            <Box
              sx={{
                alignSelf: 'flex-start',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: 'grey.100',
                color: 'text.primary',
                p: 1,
                px: 2,
                borderRadius: 2,
                maxWidth: '80%',
              }}
            >
              <CircularProgress size={16} />
              <Typography variant="body2">Typing...</Typography>
            </Box>
          )}
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <IconButton onClick={handleSend} color="primary">
            <Send size={20} />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};