(function() {
  'use strict';
  
  const defaultConfig = {
    apiBaseUrl: 'http://localhost:3001',
    position: 'bottom-right',
    primaryColor: '#3B82F6',
    chatbotName: 'AI Assistant',
    initialMessage: 'Hello! How can I help you today?'
  };

  // Get configuration from script tag data attributes
  function getConfigFromScript() {
    const scripts = document.getElementsByTagName('script');
    let config = {};
    
    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i];
      const src = script.getAttribute('src');
      
      if (src && src.includes('embed.js')) {
        // Extract config from data attributes
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
        
        break;
      }
    }
    
    return config;
  }

  // Get base URL for widget assets
  function getBaseUrl() {
    const scripts = document.getElementsByTagName('script');
    
    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i];
      const src = script.getAttribute('src');
      
      if (src && src.includes('embed.js')) {
        return src.replace('/embed.js', '');
      }
    }
    
    return 'http://localhost:3000'; // fallback
  }

  // Load the main chat widget script
  function loadChatWidget(config) {
    const baseUrl = getBaseUrl();
    const script = document.createElement('script');
    
    script.src = `${baseUrl}/chat-widget.js`;
    script.onload = function() {
      // Initialize the widget once loaded
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

  // Initialize the widget
  function init() {
    const scriptConfig = getConfigFromScript();
    const config = { ...defaultConfig, ...scriptConfig };
    
    if (!config.chatbotId) {
      console.error('ChatWidget: data-chatbot-id is required');
      return;
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        loadChatWidget(config);
      });
    } else {
      loadChatWidget(config);
    }
  }

  // Start initialization
  init();

})(); 