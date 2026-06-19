import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../app/features/slices/cartslice';
import { brandcolor } from './brandcolor';
import Rating from './Rating';

const suggestionChips = [
  { label: 'Organic products', query: 'organic products' },
  { label: 'Products under ₹500', query: 'show products under 500' },
  { label: 'Show turmeric', query: 'show turmeric' },
  { label: 'What’s in stock?', query: 'what products are in stock' },
];

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

const getMessageStyle = (sender) => ({
  alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
  backgroundColor: sender === 'user' ? brandcolor : '#ffffff',
  color: sender === 'user' ? '#fff' : '#222',
  borderRadius: sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
  padding: '10px 13px',
  marginBottom: 12,
  maxWidth: '86%',
  whiteSpace: 'pre-line',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
});

const emptyStateText = 'No matching products found.';

const getProductSummary = (message, count) => {
  const lowerMessage = message.toLowerCase();
  const priceMatch = lowerMessage.match(
    /\b(?:under|below|less than|cheaper than)\s*(?:rs\.?|\u20b9|\$)?\s*(\d+(?:\.\d+)?)/
  );

  if (/\b(in stock|available|availability)\b/i.test(message)) {
    return `All ${count} ${count === 1 ? 'product' : 'products'} currently have stock available.`;
  }

  if (priceMatch) {
    return `I found ${count} ${count === 1 ? 'product' : 'products'} under ₹${priceMatch[1]}.`;
  }

  if (/\bturmeric\b/i.test(message)) {
    return `I found ${count} turmeric ${count === 1 ? 'product' : 'products'}.`;
  }

  if (/\borganic\b/i.test(message)) {
    return `I found ${count} organic ${count === 1 ? 'product' : 'products'}.`;
  }

  return `I found ${count} matching ${count === 1 ? 'product' : 'products'}.`;
};

const AIChatWidget = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: '👋 Hi! I’m your AI Shopping Assistant.',
      showSuggestions: true,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [addedProductId, setAddedProductId] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const scrollTimer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    return () => clearTimeout(scrollTimer);
  }, [messages, isLoading]);

  const submitMessage = async (messageText) => {
    const message = messageText.trim();

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
        {
          sender: 'assistant',
          text:
            Array.isArray(data.products) && data.products.length > 0
              ? getProductSummary(message, data.products.length)
              : Array.isArray(data.products)
              ? emptyStateText
              : data.reply,
          products: Array.isArray(data.products) ? data.products : undefined,
          showSuggestions: Array.isArray(data.products) && data.products.length === 0,
        },
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

  const sendMessage = (event) => {
    event.preventDefault();
    submitMessage(inputValue);
  };

  const handleProductClick = (productId) => {
    setIsOpen(false);
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (event, product) => {
    event.stopPropagation();

    dispatch(
      addToCart({
        qty: 1,
        name: product.name,
        product: product._id,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock || 1,
        itemsmultiliedbyqty: null,
      })
    );

    setAddedProductId(product._id);
    setTimeout(() => setAddedProductId(''), 1800);
  };

  const renderSuggestions = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '4px 0 14px' }}>
      {suggestionChips.map((chip) => (
        <Button
          key={chip.query}
          type='button'
          variant='light'
          size='sm'
          disabled={isLoading}
          onClick={() => submitMessage(chip.query)}
          style={{
            border: '1px solid #eadfd3',
            borderRadius: 999,
            color: '#333',
            backgroundColor: '#fff',
            fontSize: 12,
          }}
        >
          {chip.label}
        </Button>
      ))}
    </div>
  );

  const renderProductCards = (products) => {
    if (!products || !products.length) {
      return null;
    }

    return (
      <div style={{ display: 'grid', gap: 12, marginBottom: 12 }}>
        {products.map((product) => (
          <Card
            key={product._id}
            className='ai-chat-product-card'
            role='button'
            tabIndex={0}
            onClick={() => handleProductClick(product._id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleProductClick(product._id);
              }
            }}
          >
            <div className='ai-chat-product-content'>
              <Card.Img
                src={product.image}
                alt={product.name}
                className='ai-chat-product-image'
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className='ai-chat-product-name'>{product.name}</div>
                <div className='ai-chat-product-price'>
                  ₹{product.price}
                </div>
                <div className='ai-chat-product-category'>
                  {product.category || 'Product'}
                </div>
                <div className='ai-chat-product-rating'>
                  <Rating
                    value={Number(product.rating) || 0}
                    text={`${product.numReviews || 0} reviews`}
                  />
                </div>
              </div>
            </div>
            <div className='ai-chat-product-actions'>
              <Button
                type='button'
                variant='outline-dark'
                size='sm'
                onClick={(event) => {
                  event.stopPropagation();
                  handleProductClick(product._id);
                }}
                className='ai-chat-product-action'
              >
                View Product
              </Button>
              <Button
                type='button'
                size='sm'
                disabled={product.countInStock === 0}
                onClick={(event) => handleAddToCart(event, product)}
                className='ai-chat-product-action'
                style={{ backgroundColor: brandcolor, borderColor: brandcolor }}
              >
                {addedProductId === product._id ? 'Added to cart' : 'Add To Cart'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderTypingIndicator = () => (
    <div style={getMessageStyle('assistant')} className='ai-chat-typing'>
      <span>AI is typing</span>
      <span className='ai-chat-dot'></span>
      <span className='ai-chat-dot'></span>
      <span className='ai-chat-dot'></span>
    </div>
  );

  return (
    <>
      <style>
        {`
          .ai-chat-panel {
            position: fixed;
            right: 24px;
            bottom: 92px;
            width: 390px;
            max-width: calc(100vw - 32px);
            height: 560px;
            max-height: calc(100vh - 120px);
            background: #ffffff;
            border-radius: 18px;
            box-shadow: 0 16px 45px rgba(0, 0, 0, 0.2);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            z-index: 1050;
          }

          .ai-chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            background: linear-gradient(180deg, #fcfaf8 0%, #f8f2eb 100%);
          }

          .ai-chat-product-card {
            border: 1px solid #e8ddd1;
            border-radius: 16px;
            cursor: pointer;
            overflow: hidden;
            transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
          }

          .ai-chat-product-card:hover,
          .ai-chat-product-card:focus {
            border-color: ${brandcolor};
            box-shadow: 0 10px 26px rgba(0, 0, 0, 0.13);
            transform: translateY(-1px);
            outline: none;
          }

          .ai-chat-product-content {
            display: flex;
            gap: 12px;
            padding: 12px;
          }

          .ai-chat-product-image {
            width: 82px;
            height: 82px;
            object-fit: cover;
            border-radius: 14px;
            background-color: #f7f2ed;
            flex-shrink: 0;
          }

          .ai-chat-product-name {
            color: #222;
            font-size: 14px;
            font-weight: 700;
            line-height: 1.25;
          }

          .ai-chat-product-price {
            color: ${brandcolor};
            font-size: 15px;
            font-weight: 800;
            margin-top: 4px;
          }

          .ai-chat-product-category {
            color: #777;
            font-size: 11px;
            margin-top: 3px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          .ai-chat-product-rating {
            font-size: 11px;
            margin-top: 4px;
          }

          .ai-chat-product-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 0 12px 12px;
          }

          .ai-chat-product-action {
            border-radius: 999px;
            flex: 1 1 120px;
            white-space: nowrap;
          }

          .ai-chat-input-form {
            display: flex;
            gap: 8px;
            padding: 12px;
            border-top: 1px solid #f0e6dc;
            background: #fff;
            flex-shrink: 0;
          }

          .ai-chat-typing {
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }

          .ai-chat-dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #777;
            animation: ai-chat-bounce 1s infinite ease-in-out;
          }

          .ai-chat-dot:nth-child(3) {
            animation-delay: 0.15s;
          }

          .ai-chat-dot:nth-child(4) {
            animation-delay: 0.3s;
          }

          @keyframes ai-chat-bounce {
            0%, 80%, 100% {
              opacity: 0.35;
              transform: translateY(0);
            }
            40% {
              opacity: 1;
              transform: translateY(-3px);
            }
          }

          @media (max-width: 576px) {
            .ai-chat-panel {
              left: 0;
              right: 0;
              bottom: 88px;
              width: 100%;
              max-width: 100%;
              height: 70vh;
              max-height: 70vh;
              border-radius: 18px 18px 0 0;
            }

            .ai-chat-messages {
              padding: 12px;
            }

            .ai-chat-product-content {
              gap: 10px;
              padding: 10px;
            }

            .ai-chat-product-image {
              width: 72px;
              height: 72px;
            }

            .ai-chat-product-actions {
              padding: 0 10px 10px;
            }

            .ai-chat-input-form {
              flex-wrap: wrap;
            }

            .ai-chat-input-form .form-control {
              min-width: 0;
              flex: 1 1 180px;
            }
          }
        `}
      </style>

      {isOpen && (
        <section className='ai-chat-panel' aria-label='AI Shopping Assistant'>
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

          <div className='ai-chat-messages'>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {messages.map((message, index) => (
                <React.Fragment key={`${message.sender}-${index}`}>
                  <div style={getMessageStyle(message.sender)}>{message.text}</div>
                  {message.showSuggestions && renderSuggestions()}
                  {renderProductCards(message.products)}
                </React.Fragment>
              ))}

              {isLoading && renderTypingIndicator()}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <Form onSubmit={sendMessage} className='ai-chat-input-form'>
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
