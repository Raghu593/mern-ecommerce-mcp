import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { brandcolor } from './brandcolor';

const panelStyle = {
  position: 'fixed',
  right: 24,
  bottom: 92,
  width: 360,
  maxWidth: 'calc(100vw - 32px)',
  height: 500,
  maxHeight: 'calc(100vh - 120px)',
  backgroundColor: '#fff',
  borderRadius: 16,
  boxShadow: '0 12px 35px rgba(0, 0, 0, 0.18)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  zIndex: 1050,
};

const buttonStyle = {
  position: 'fixed',
  right: 24,
  bottom: 24,
  width: 58,
  height: 58,
  borderRadius: '50%',
  border: 'none',
  backgroundColor: brandcolor,
  boxShadow: '0 8px 22px rgba(0, 0, 0, 0.22)',
  zIndex: 1050,
};

const messageListStyle = {
  flex: 1,
  overflowY: 'auto',
  padding: 16,
  backgroundColor: '#fcfaf8',
};

const getMessageStyle = (sender) => ({
  alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
  backgroundColor: sender === 'user' ? brandcolor : '#fff',
  color: sender === 'user' ? '#fff' : '#222',
  borderRadius: 14,
  padding: '10px 12px',
  marginBottom: 10,
  maxWidth: '82%',
  whiteSpace: 'pre-line',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
});

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hi! Ask me to find products by price, name, category, or stock availability.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const message = inputValue.trim();

    if (!message || isLoading) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      { sender: 'user', text: message },
    ]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to get assistant reply');
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        { sender: 'assistant', text: data.reply },
      ]);
    } catch {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          sender: 'assistant',
          text: 'Sorry, I could not reach the shopping assistant. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <section style={panelStyle} aria-label='AI Shopping Assistant'>
          <div
            style={{
              backgroundColor: brandcolor,
              color: '#fff',
              padding: '14px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 600,
            }}
          >
            <span>AI Shopping Assistant</span>
            <Button
              variant='link'
              onClick={() => setIsOpen(false)}
              style={{ color: '#fff', padding: 0, textDecoration: 'none' }}
              aria-label='Close AI Shopping Assistant'
            >
              x
            </Button>
          </div>

          <div style={messageListStyle}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {messages.map((message, index) => (
                <div key={`${message.sender}-${index}`} style={getMessageStyle(message.sender)}>
                  {message.text}
                </div>
              ))}

              {isLoading && (
                <div style={getMessageStyle('assistant')}>
                  <Spinner animation='border' size='sm' style={{ marginRight: 8 }} />
                  Thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <Form onSubmit={sendMessage} style={{ display: 'flex', gap: 8, padding: 12 }}>
            <Form.Control
              type='text'
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder='Ask about products...'
              disabled={isLoading}
              aria-label='Message AI Shopping Assistant'
            />
            <Button type='submit' disabled={isLoading || !inputValue.trim()}>
              Send
            </Button>
          </Form>
        </section>
      )}

      <Button
        type='button'
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        style={buttonStyle}
        aria-label='Open AI Shopping Assistant'
      >
        <i className='fas fa-comments' aria-hidden='true'></i>
      </Button>
    </>
  );
};

export default AIChatWidget;
