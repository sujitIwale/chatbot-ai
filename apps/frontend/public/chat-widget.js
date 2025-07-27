(function() {
  'use strict';

  const DEFAULT_CONFIG = {
    apiBaseUrl: 'https://chatbot-ai-1n7x.onrender.com',
    primaryColor: '#3B82F6',
    chatbotName: 'AI Assistant',
    initialMessage: 'Hello! How can I help you today?'
  };

  class ChatWidget {
    constructor(config) {
      console.log('ChatWidget: Constructor called with config:', config);
      this.config = { ...DEFAULT_CONFIG, ...config };
      this.chatbotId = config.chatbotId;
      this.sessionId = this.getOrCreateSessionId();
      this.isOpen = false;
      this.messages = [];
      this.isLoading = false;
      
      console.log('ChatWidget: Starting initialization');
      this.init();
    }

    init() {
      console.log('ChatWidget: Injecting styles');
      this.injectStyles();
      console.log('ChatWidget: Creating widget DOM');
      this.createWidget();
      console.log('ChatWidget: Loading chat history');
      this.loadChatHistory();
    }

    getOrCreateSessionId() {
      const storageKey = `chatbot_session_${this.chatbotId}`;
      let sessionId = localStorage.getItem(storageKey);
      
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(storageKey, sessionId);
      }
      
      return sessionId;
    }

    injectStyles() {
      if (document.getElementById('chat-widget-styles')) return;

      const styles = `
        .chat-widget-container {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 1000000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .chat-widget-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${this.config.primaryColor}, #8B5CF6);
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          transition: all 0.3s ease;
        }

        .chat-widget-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }

        .chat-widget-button.open {
          background: #6B7280;
        }

        .chat-widget-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          height: 500px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          visibility: hidden;
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .chat-widget-window.open {
          visibility: visible;
          transform: translateY(0);
          opacity: 1;
        }

        .chat-widget-header {
          background: linear-gradient(to right, #2563EB, #8B5CF6);
          color: white;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chat-widget-header-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .chat-widget-header-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }

        .chat-widget-avatar {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 18px;
          backdrop-filter: blur(4px);
        }

        .chat-widget-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          opacity: 0.9;
        }

        .chat-widget-status-dot {
          width: 8px;
          height: 8px;
          background: #34D399;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .chat-widget-close {
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          opacity: 0.8;
        }

        .chat-widget-close:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.1);
        }

        .chat-widget-messages {
          height: 384px;
          padding: 24px;
          overflow-y: auto;
          background: rgba(249, 250, 251, 0.5);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chat-message {
          display: flex;
          gap: 8px;
        }

        .chat-message.user {
          justify-content: flex-end;
        }
        
        .chat-message.agent {
          justify-content: flex-start;
        }

        .chat-message-content {
          background: white;
          padding: 12px 16px;
          border-radius: 16px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          border: 1px solid #E5E7EB;
          color: #1F2937;
          max-width: 288px;
        }

        .chat-message.user .chat-message-content {
          background: linear-gradient(to right, #2563EB, #8B5CF6);
          color: white;
          border: none;
          margin-left: 48px;
        }
        
        .chat-message.agent .chat-message-content {
          margin-right: 48px;
        }

        .chat-message-time {
          font-size: 12px;
          color: #9CA3AF;
          margin-top: 8px;
        }

        .chat-message.user .chat-message-time {
          color: rgba(191, 219, 254, 1);
        }

        .chat-widget-input-container {
          padding: 24px;
          background: white;
        }

        .chat-widget-input-form {
          display: flex;
          gap: 12px;
        }

        .chat-widget-input {
          flex: 1;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
          background: white;
        }

        .chat-widget-input:focus {
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .chat-widget-send {
          background: linear-gradient(to right, #2563EB, #8B5CF6);
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          font-weight: 500;
        }

        .chat-widget-send:hover {
          background: linear-gradient(to right, #1D4ED8, #7C3AED);
          transform: scale(1.05);
        }

        .chat-widget-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .chat-widget-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          flex-direction: column;
          gap: 8px;
        }

        .chat-widget-loading-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid #E5E7EB;
          border-top: 2px solid #9CA3AF;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .chat-widget-loading-text {
          font-size: 14px;
          color: #6B7280;
        }

        .chat-widget-loading-dots {
          display: flex;
          gap: 2px;
        }

        .chat-widget-loading-dot {
          width: 8px;
          height: 8px;
          background: #9CA3AF;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .chat-widget-loading-dot:nth-child(1) { animation-delay: -0.32s; }
        .chat-widget-loading-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .chat-widget-error {
          color: #EF4444;
          font-size: 12px;
          margin-top: 4px;
        }

        /* Mobile responsiveness */
        @media (max-width: 480px) {
          .chat-widget-window {
            width: calc(100vw - 20px);
            height: calc(100vh - 100px);
            bottom: 80px;
            right: 10px;
          }
        }
      `;

      const styleSheet = document.createElement('style');
      styleSheet.id = 'chat-widget-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    createWidget() {
      const container = document.createElement('div');
      container.className = 'chat-widget-container';
      container.innerHTML = `
        <div class="chat-widget-window" id="chat-widget-window">
          <div class="chat-widget-header">
            <div class="chat-widget-header-info">
              <div class="chat-widget-avatar">
                ${this.config.chatbotName.charAt(0)}
              </div>
                             <div>
                 <h2 class="chat-widget-header-title">${this.config.chatbotName}</h2>
                 <div class="chat-widget-status">
                   <div class="chat-widget-status-dot"></div>
                   Online • AI Assistant
                 </div>
               </div>
            </div>
            <button class="chat-widget-close" id="chat-widget-close">×</button>
          </div>
                     <div class="chat-widget-messages" id="chat-widget-messages">
             <div class="chat-widget-loading" id="chat-widget-loading">
               <div class="chat-widget-loading-spinner"></div>
               <p class="chat-widget-loading-text">Loading conversation...</p>
             </div>
           </div>
          <div class="chat-widget-input-container">
            <form class="chat-widget-input-form" id="chat-widget-form">
              <input type="text" class="chat-widget-input" id="chat-widget-input" placeholder="Ask me anything..." />
              <button type="submit" class="chat-widget-send" id="chat-widget-send">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </form>
            <div class="chat-widget-error" id="chat-widget-error" style="display: none;"></div>
            <p style="font-size: 12px; color: #9CA3AF; margin-top: 8px; text-align: center;">
              Press Enter to send • Powered by AI
              <span id="session-indicator" style="margin-left: 8px;">• 💾 Session saved</span>
            </p>
          </div>
        </div>
        <button class="chat-widget-button" id="chat-widget-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        </button>
      `;

      console.log('ChatWidget: Appending widget to document body');
      document.body.appendChild(container);
      console.log('ChatWidget: Widget appended, attaching event listeners');
      this.attachEventListeners();
    }

    attachEventListeners() {
      console.log('ChatWidget: Attaching event listeners');
      const button = document.getElementById('chat-widget-button');
      const closeBtn = document.getElementById('chat-widget-close');
      const form = document.getElementById('chat-widget-form');
      const input = document.getElementById('chat-widget-input');

      if (!button) {
        console.error('ChatWidget: Could not find chat-widget-button');
        return;
      }
      if (!closeBtn) {
        console.error('ChatWidget: Could not find chat-widget-close');
        return;
      }
      if (!form) {
        console.error('ChatWidget: Could not find chat-widget-form');
        return;
      }

      console.log('ChatWidget: Adding click listener to button');
      button.addEventListener('click', (e) => {
        console.log('ChatWidget: Button clicked - event triggered');
        e.preventDefault();
        e.stopPropagation();
        this.toggleWidget();
      });
      
      closeBtn.addEventListener('click', () => this.closeWidget());
      form.addEventListener('submit', (e) => this.handleSubmit(e));
      
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.chat-widget-container') && this.isOpen) {
          this.closeWidget();
        }
      });
      
      console.log('ChatWidget: Event listeners attached successfully');
    }

    toggleWidget() {
      console.log('ChatWidget: Toggle clicked, current state:', this.isOpen);
      this.isOpen = !this.isOpen;
      const window = document.getElementById('chat-widget-window');
      const button = document.getElementById('chat-widget-button');
      
      
      if (!window || !button) {
        console.error('ChatWidget: Could not find widget elements');
        return;
      }
      
      if (this.isOpen) {
        console.log('ChatWidget: Opening widget');
        window.classList.add('open');
        button.classList.add('open');
        button.innerHTML = '×';
        console.log('ChatWidget: Added open class to window and button');
        setTimeout(() => {
          const input = document.getElementById('chat-widget-input');
          if (input) {
            console.log('ChatWidget: Focusing input');
            input.focus();
          }
        }, 100);
      } else {
        console.log('ChatWidget: Closing widget');
        this.closeWidget();
      }
    }

    closeWidget() {
      this.isOpen = false;
      const window = document.getElementById('chat-widget-window');
      const button = document.getElementById('chat-widget-button');
      
      window.classList.remove('open');
      button.classList.remove('open');
      button.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      `;
    }

    async loadChatHistory() {
      try {
        const response = await fetch(`${this.config.apiBaseUrl}/api/chat/session/${this.sessionId}/history`);
        const messages = await response.json();
        
        this.hideLoading();
        
        if (messages.length > 0) {
          this.messages = messages;
          this.renderMessages();
        } else {
          this.addMessage({
            content: this.config.initialMessage,
            sender: 'AGENT',
            createdAt: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        this.hideLoading();
        this.addMessage({
          content: this.config.initialMessage,
          sender: 'AGENT',
          createdAt: new Date().toISOString()
        });
      }
    }

    hideLoading() {
      const loading = document.getElementById('chat-widget-loading');
      if (loading) {
        loading.style.display = 'none';
      }
    }

    async handleSubmit(e) {
      e.preventDefault();
      const input = document.getElementById('chat-widget-input');
      const message = input.value.trim();
      
      if (!message || this.isLoading) return;
      
      input.value = '';
      this.isLoading = true;
      this.updateSendButton();
      this.hideError();
      
      // Add user message
      this.addMessage({
        content: message,
        sender: 'USER',
        createdAt: new Date().toISOString()
      });
      
      // Show typing indicator
      this.showTyping();
      
      try {
        const response = await fetch(`${this.config.apiBaseUrl}/api/chat/${this.chatbotId}/send-message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            sessionId: this.sessionId,
            userId: 'anonymous'
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to send message');
        }
        
        this.hideTyping();
        
        const agentMessages = data.response || [];
        agentMessages.forEach(message => {
          this.addMessage({
            id: message.id,
            content: message.content,
            sender: message.sender,
            createdAt: message.createdAt
          });
        });
        
      } catch (error) {
        console.error('Error sending message:', error);
        this.hideTyping();
        this.showError(error.message || 'Failed to send message. Please try again.');
      } finally {
        this.isLoading = false;
        this.updateSendButton();
      }
    }

    addMessage(message) {
      this.messages.push(message);
      this.renderMessage(message);
      this.scrollToBottom();
    }

    renderMessages() {
      const messagesContainer = document.getElementById('chat-widget-messages');
      messagesContainer.innerHTML = '';
      
      this.messages.forEach(message => {
        this.renderMessage(message, false);
      });
      
      this.scrollToBottom();
    }

    renderMessage(message, animate = true) {
      const messagesContainer = document.getElementById('chat-widget-messages');
      const messageEl = document.createElement('div');
      messageEl.className = `chat-message ${message.sender.toLowerCase()}`;
      
      const time = new Date(message.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      messageEl.innerHTML = `
        <div class="chat-message-content">
          <div>${this.escapeHtml(message.content)}</div>
          <div class="chat-message-time">${time}</div>
        </div>
      `;
      
      if (animate) {
        messageEl.style.opacity = '0';
        messageEl.style.transform = 'translateY(10px)';
      }
      
      messagesContainer.appendChild(messageEl);
      
      if (animate) {
        requestAnimationFrame(() => {
          messageEl.style.transition = 'all 0.3s ease';
          messageEl.style.opacity = '1';
          messageEl.style.transform = 'translateY(0)';
        });
      }
    }

    showTyping() {
      const messagesContainer = document.getElementById('chat-widget-messages');
      const typingEl = document.createElement('div');
      typingEl.id = 'typing-indicator';
      typingEl.className = 'chat-message agent';
      typingEl.innerHTML = `
        <div class="chat-message-content">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="chat-widget-loading-dots">
              <div class="chat-widget-loading-dot"></div>
              <div class="chat-widget-loading-dot"></div>
              <div class="chat-widget-loading-dot"></div>
            </div>
            <span style="font-size: 14px; color: #6B7280;">AI is thinking...</span>
          </div>
        </div>
      `;
      
      messagesContainer.appendChild(typingEl);
      this.scrollToBottom();
    }

    hideTyping() {
      const typingEl = document.getElementById('typing-indicator');
      if (typingEl) {
        typingEl.remove();
      }
    }

    updateSendButton() {
      const sendBtn = document.getElementById('chat-widget-send');
      sendBtn.disabled = this.isLoading;
      
      if (this.isLoading) {
        sendBtn.innerHTML = `
          <div class="chat-widget-loading-dots">
            <div class="chat-widget-loading-dot"></div>
            <div class="chat-widget-loading-dot"></div>
            <div class="chat-widget-loading-dot"></div>
          </div>
        `;
      } else {
        sendBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        `;
      }
    }



    showError(message) {
      const errorEl = document.getElementById('chat-widget-error');
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }

    hideError() {
      const errorEl = document.getElementById('chat-widget-error');
      errorEl.style.display = 'none';
    }

    scrollToBottom() {
      const messagesContainer = document.getElementById('chat-widget-messages');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  // Global function to initialize the widget
  window.initChatWidget = function(config) {
    console.log('ChatWidget: initChatWidget called');
    console.log('ChatWidget: Config received:', config);
    
    if (!config.chatbotId) {
      console.error('ChatWidget: chatbotId is required');
      return;
    }
    
    // Check if widget already exists
    const existingWidget = document.querySelector('.chat-widget-container');
    if (existingWidget) {
      console.log('ChatWidget: Widget already exists, removing old one');
      existingWidget.remove();
    }
    
    try {
      if (document.readyState === 'loading') {
        console.log('ChatWidget: DOM not ready, waiting for DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', () => {
          console.log('ChatWidget: DOM ready, creating widget');
          new ChatWidget(config);
        });
      } else {
        console.log('ChatWidget: DOM ready, creating widget immediately');
        new ChatWidget(config);
      }
    } catch (error) {
      console.error('ChatWidget: Error during initialization:', error);
    }
  };

})(); 