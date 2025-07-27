(function() {
  'use strict';
  
  const defaultConfig = {
    apiBaseUrl: 'http://localhost:3001',
    position: 'bottom-right',
    primaryColor: '#3B82F6',
    chatbotName: 'AI Assistant',
    initialMessage: 'Hello! How can I help you today?'
  };

  function getConfigFromScript() {
    const script = document.getElementById('chatbot-embed-script');
    
    if (!script) {
      console.error('ChatWidget: Could not find embed script. Please ensure the script has id="chatbot-embed-script"');
      return {};
    }
    
    let config = {};
    
    const chatbotId = script.getAttribute('data-chatbot-id');
    const apiBaseUrl = script.getAttribute('data-api-base-url');
    const position = script.getAttribute('data-position');
    const primaryColor = script.getAttribute('data-primary-color');
    const chatbotName = script.getAttribute('data-chatbot-name');
    const initialMessage = script.getAttribute('data-initial-message');
    
    if (chatbotId) config.chatbotId = chatbotId;
    if (apiBaseUrl) config.apiBaseUrl = apiBaseUrl;
    if (position) config.position = position;
    if (primaryColor) config.primaryColor = primaryColor;
    if (chatbotName) config.chatbotName = chatbotName;
    if (initialMessage) config.initialMessage = initialMessage;
    
    return config;
  }

  function getBaseUrl() {
    const script = document.getElementById('chatbot-embed-script');
    
    if (script) {
      const src = script.getAttribute('src');
      if (src) {
        return src.replace('/embed.js', '');
      }
    }
    
    return 'http://localhost:3000'; // fallback
  }

  function loadChatWidget(config) {
    const baseUrl = getBaseUrl();
    const script = document.createElement('script');
    
    script.src = `${baseUrl}/chat-widget.js`;
    script.onload = function() {
      if (window.initChatWidget) {
        window.initChatWidget(config);
      } else {
        console.error('ChatWidget: Failed to load chat widget script');
      }
    };
    
    script.onerror = function() {
      console.error('ChatWidget: Failed to load chat widget script from', script.src);
    };
    
    document.head.appendChild(script);
  }

  function init() {
    const scriptConfig = getConfigFromScript();
    const config = { ...defaultConfig, ...scriptConfig };
    
    if (!config.chatbotId) {
      console.error('ChatWidget: data-chatbot-id is required');
      return;
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        loadChatWidget(config);
      });
    } else {
      loadChatWidget(config);
    }
  }

  init();

})(); 