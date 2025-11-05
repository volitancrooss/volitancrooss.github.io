// Configuración del webhook
const webhookUrl = 'https://volitancrooss.app.n8n.cloud/webhook/chatbot-gemini';

// Estado global de la aplicación
let appState = {
    userName: '',
    currentConversationId: null,
    conversations: {},
    botConfig: {
        personality: 'profesional',
        tone: 'equilibrado',
        language: 'es'
    }
};

// ============================================
// INICIALIZACIÓN
// ============================================

function initApp() {
    console.log('🚀 Inicializando aplicación...');
    loadAppState();
    
    // Si no hay nombre de usuario, mostrar modal de bienvenida
    if (!appState.userName) {
        console.log('👤 No hay usuario, mostrando modal de bienvenida');
        showWelcomeModal();
    } else {
        console.log('👤 Usuario encontrado:', appState.userName);
        hideWelcomeModal();
        updateUserDisplay();
        
        // Si no hay conversaciones, crear una por defecto
        if (Object.keys(appState.conversations).length === 0) {
            console.log('📝 Creando primera conversación');
            createNewConversation();
        } else {
            // Cargar la última conversación activa
            const convIds = Object.keys(appState.conversations);
            const lastConvId = convIds[convIds.length - 1];
            console.log('📂 Cargando última conversación:', lastConvId);
            switchConversation(lastConvId);
        }
        
        renderTabs();
    }
}

function showWelcomeModal() {
    document.getElementById('welcomeModal').classList.add('active');
    setTimeout(() => {
        document.getElementById('userNameInput').focus();
    }, 100);
}

function hideWelcomeModal() {
    document.getElementById('welcomeModal').classList.remove('active');
}

// ============================================
// GESTIÓN DE ESTADO
// ============================================

function saveAppState() {
    try {
        localStorage.setItem('chatbotAppState', JSON.stringify(appState));
        console.log('💾 Estado guardado correctamente');
    } catch (error) {
        console.error('❌ Error al guardar estado:', error);
    }
}

function loadAppState() {
    try {
        const saved = localStorage.getItem('chatbotAppState');
        if (saved) {
            const parsed = JSON.parse(saved);
            appState = { ...appState, ...parsed };
            console.log('✅ Estado cargado:', appState);
        }
    } catch (error) {
        console.error('❌ Error al cargar estado:', error);
    }
}

// ============================================
// GESTIÓN DE USUARIO
// ============================================

function handleWelcomeKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        saveUserName();
    }
}

function saveUserName() {
    const nameInput = document.getElementById('userNameInput');
    const name = nameInput.value.trim();
    
    if (!name) {
        showNotification('⚠️ Por favor ingresa tu nombre', 'warning');
        nameInput.focus();
        return;
    }
    
    if (name.length < 2) {
        showNotification('⚠️ El nombre debe tener al menos 2 caracteres', 'warning');
        nameInput.focus();
        return;
    }
    
    appState.userName = name;
    saveAppState();
    
    console.log('👤 Nombre de usuario guardado:', name);
    
    hideWelcomeModal();
    updateUserDisplay();
    
    // Crear primera conversación
    createNewConversation();
    renderTabs();
    
    showNotification(`👋 ¡Hola ${name}! Bienvenido`, 'success');
    
    setTimeout(() => {
        document.getElementById('messageInput').focus();
    }, 500);
}

function updateUserDisplay() {
    document.getElementById('userName').textContent = appState.userName;
    console.log('✅ Display de usuario actualizado:', appState.userName);
}

// ============================================
// GESTIÓN DE CONVERSACIONES
// ============================================

function createNewConversation() {
    const id = 'conv_' + Date.now();
    const conversationNumber = Object.keys(appState.conversations).length + 1;
    
    appState.conversations[id] = {
        id: id,
        name: `Conversación ${conversationNumber}`,
        messages: [],
        createdAt: Date.now(),
        lastActive: Date.now()
    };
    
    appState.currentConversationId = id;
    saveAppState();
    
    console.log('✅ Nueva conversación creada:', id);
    
    renderTabs();
    loadConversation(id);
    
    showNotification('✅ Nueva conversación creada', 'success');
}

function switchConversation(id) {
    if (!appState.conversations[id]) {
        console.error('❌ Conversación no encontrada:', id);
        return;
    }
    
    appState.currentConversationId = id;
    appState.conversations[id].lastActive = Date.now();
    saveAppState();
    
    console.log('🔄 Cambiando a conversación:', id);
    
    renderTabs();
    loadConversation(id);
}

function loadConversation(id) {
    const conv = appState.conversations[id];
    if (!conv) {
        console.error('❌ No se puede cargar conversación:', id);
        return;
    }
    
    console.log('📂 Cargando conversación:', conv.name, '(' + conv.messages.length + ' mensajes)');
    
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.innerHTML = '';
    
    if (conv.messages.length === 0) {
        messagesContainer.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">🚀</div>
                <h3>${conv.name}</h3>
                <p>Hola ${appState.userName}, escribe un mensaje para comenzar o describe una imagen para generarla con IA</p>
            </div>
        `;
    } else {
        conv.messages.forEach(msg => {
            addMessageToDOM(msg.content, msg.isUser, msg.timestamp, msg.isImage);
        });
    }
}

// ============================================
// RENDERIZADO DE PESTAÑAS
// ============================================

function renderTabs() {
    const tabsWrapper = document.getElementById('tabsWrapper');
    tabsWrapper.innerHTML = '';
    
    // Ordenar conversaciones por última actividad
    const sortedConvs = Object.values(appState.conversations)
        .sort((a, b) => b.lastActive - a.lastActive);
    
    console.log('📑 Renderizando', sortedConvs.length, 'pestañas');
    
    sortedConvs.forEach(conv => {
        const tab = document.createElement('div');
        tab.className = 'tab';
        if (conv.id === appState.currentConversationId) {
            tab.classList.add('active');
        }
        
        const messageCount = conv.messages.length;
        
        tab.innerHTML = `
            <span class="tab-name" onclick="switchConversation('${conv.id}')">
                <span class="tab-title">${escapeHtml(conv.name)}</span>
                <span class="tab-count">${messageCount}</span>
            </span>
            <button class="tab-menu" onclick="showContextMenu(event, '${conv.id}')" title="Opciones">⋮</button>
        `;
        
        tabsWrapper.appendChild(tab);
    });
}

// ============================================
// MENÚ CONTEXTUAL
// ============================================

let currentContextConvId = null;

function showContextMenu(event, convId) {
    event.stopPropagation();
    currentContextConvId = convId;
    
    const menu = document.getElementById('contextMenu');
    menu.classList.add('active');
    
    // Posicionar el menú
    const x = Math.min(event.pageX, window.innerWidth - 200);
    const y = Math.min(event.pageY, window.innerHeight - 100);
    
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
}

function hideContextMenu() {
    document.getElementById('contextMenu').classList.remove('active');
}

// Cerrar menú contextual al hacer clic fuera
document.addEventListener('click', hideContextMenu);

function renameConversation() {
    if (!currentContextConvId) return;
    
    const conv = appState.conversations[currentContextConvId];
    const newName = prompt('Nuevo nombre para la conversación:', conv.name);
    
    if (newName && newName.trim()) {
        conv.name = newName.trim();
        saveAppState();
        renderTabs();
        showNotification('✅ Conversación renombrada', 'success');
    }
    
    hideContextMenu();
}

function deleteConversation() {
    if (!currentContextConvId) return;
    
    const conv = appState.conversations[currentContextConvId];
    const convCount = Object.keys(appState.conversations).length;
    
    if (convCount === 1) {
        showNotification('⚠️ No puedes eliminar la única conversación', 'warning');
        hideContextMenu();
        return;
    }
    
    if (confirm(`¿Estás seguro de eliminar "${conv.name}"?`)) {
        delete appState.conversations[currentContextConvId];
        
        // Si era la conversación actual, cambiar a otra
        if (currentContextConvId === appState.currentConversationId) {
            const remaining = Object.keys(appState.conversations)[0];
            switchConversation(remaining);
        }
        
        saveAppState();
        renderTabs();
        showNotification('✅ Conversación eliminada', 'success');
    }
    
    hideContextMenu();
}

// ============================================
// CONFIGURACIÓN
// ============================================

function openSettings() {
    document.getElementById('editUserNameInput').value = appState.userName;
    document.getElementById('botPersonalityInput').value = appState.botConfig.personality;
    document.getElementById('botToneInput').value = appState.botConfig.tone;
    document.getElementById('botLanguageInput').value = appState.botConfig.language;
    
    document.getElementById('settingsModal').classList.add('active');
    
    setTimeout(() => {
        document.getElementById('editUserNameInput').focus();
    }, 100);
}

function closeSettings() {
    document.getElementById('settingsModal').classList.remove('active');
}

function saveSettings() {
    const newName = document.getElementById('editUserNameInput').value.trim();
    
    if (!newName) {
        showNotification('⚠️ El nombre no puede estar vacío', 'warning');
        return;
    }
    
    if (newName.length < 2) {
        showNotification('⚠️ El nombre debe tener al menos 2 caracteres', 'warning');
        return;
    }
    
    const oldName = appState.userName;
    appState.userName = newName;
    appState.botConfig.personality = document.getElementById('botPersonalityInput').value;
    appState.botConfig.tone = document.getElementById('botToneInput').value;
    appState.botConfig.language = document.getElementById('botLanguageInput').value;
    
    saveAppState();
    updateUserDisplay();
    closeSettings();
    
    if (oldName !== newName) {
        showNotification(`✅ Configuración guardada. Ahora eres ${newName}`, 'success');
    } else {
        showNotification('✅ Configuración guardada correctamente', 'success');
    }
    
    console.log('⚙️ Configuración actualizada:', appState.botConfig);
}

function deleteAllConversations() {
    const convCount = Object.keys(appState.conversations).length;
    
    if (confirm(`⚠️ ¿Estás seguro de eliminar TODAS las ${convCount} conversaciones? Esta acción no se puede deshacer.`)) {
        appState.conversations = {};
        createNewConversation();
        closeSettings();
        showNotification('✅ Todas las conversaciones han sido eliminadas', 'success');
    }
}

// ============================================
// NOTIFICACIONES Y UI
// ============================================

function showNotification(message, type = 'info') {
    const statusEl = document.getElementById('status');
    const originalHTML = statusEl.innerHTML;
    
    let icon = '';
    switch(type) {
        case 'success': icon = '✅'; break;
        case 'warning': icon = '⚠️'; break;
        case 'error': icon = '❌'; break;
        case 'info': icon = 'ℹ️'; break;
        default: icon = '💡';
    }
    
    statusEl.innerHTML = `<span>${icon} ${message}</span>`;
    statusEl.className = 'status ' + type;
    
    setTimeout(() => {
        statusEl.innerHTML = originalHTML;
        statusEl.className = 'status';
    }, 3000);
}

// ============================================
// MENSAJES
// ============================================

function addMessageToDOM(content, isUser = false, timestamp = Date.now(), isImage = false) {
    const messagesContainer = document.getElementById('chatMessages');
    
    // Eliminar mensaje de bienvenida si existe
    const welcomeMsg = messagesContainer.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const time = new Date(timestamp).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    let formattedContent = content;
    if (!isUser && !isImage) {
        formattedContent = formatBotMessage(content);
    } else if (!isImage) {
        formattedContent = escapeHtml(content);
    }

    const avatar = isUser ? '👤' : '🤖';
    const userName = isUser ? appState.userName : 'Asistente';

    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-body">
            <div class="message-header">
                <span class="message-author">${escapeHtml(userName)}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-content">${formattedContent}</div>
        </div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addMessage(content, isUser = false, isImage = false) {
    const conv = appState.conversations[appState.currentConversationId];
    if (!conv) {
        console.error('❌ No hay conversación activa');
        return;
    }
    
    const message = {
        content: content,
        isUser: isUser,
        timestamp: Date.now(),
        isImage: isImage
    };
    
    conv.messages.push(message);
    conv.lastActive = Date.now();
    saveAppState();
    
    console.log('💬 Mensaje agregado:', isUser ? 'Usuario' : 'Bot');
    
    addMessageToDOM(content, isUser, message.timestamp, isImage);
}

function formatBotMessage(text) {
    text = escapeHtml(text);
    
    // Párrafos
    text = text.split('\n\n').map(para => {
        if (para.trim()) {
            return `<p>${para.trim()}</p>`;
        }
        return '';
    }).join('');

    if (!text.includes('<p>')) {
        text = '<p>' + text.replace(/\n/g, '<br>') + '</p>';
    }

    // Formato
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    text = text.replace(/<p>([•\-\*])\s+(.+?)<\/p>/g, '<li>$2</li>');
    
    if (text.includes('<li>')) {
        text = text.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
    }

    text = text.replace(/<p>(\d+)\.\s+(.+?)<\/p>/g, '<li>$2</li>');
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    return text;
}

// ============================================
// INDICADORES
// ============================================

function showTyping() {
    const messagesContainer = document.getElementById('chatMessages');
    
    const welcomeMsg = messagesContainer.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-body">
            <div class="message-header">
                <span class="message-author">Asistente</span>
            </div>
            <div class="typing-indicator">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) {
        typing.remove();
    }
}

function showError(message) {
    const messagesContainer = document.getElementById('chatMessages');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <span class="error-icon">⚠️</span>
        <span>${message}</span>
    `;
    messagesContainer.appendChild(errorDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    setTimeout(() => {
        errorDiv.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

// ============================================
// UTILIDADES
// ============================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// GENERACIÓN DE IMÁGENES
// ============================================

async function generateImage() {
    const input = document.getElementById('messageInput');
    const imageButton = document.getElementById('imageButton');
    const sendButton = document.getElementById('sendButton');
    const prompt = input.value.trim();

    if (!prompt) {
        showNotification('⚠️ Escribe una descripción para la imagen', 'warning');
        return;
    }

    input.disabled = true;
    imageButton.disabled = true;
    sendButton.disabled = true;

    addMessage(`🎨 Generar imagen: ${prompt}`, true);
    input.value = '';

    showTyping();
    showNotification('🎨 Generando imagen...', 'info');

    try {
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&enhance=true`;
        
        hideTyping();
        
        const imageContent = `
            <p><strong>✨ Imagen generada con IA</strong></p>
            <img src="${imageUrl}" alt="${escapeHtml(prompt)}" class="message-image" loading="lazy">
            <div class="image-prompt-container">
                <span class="prompt-label">Prompt:</span> ${escapeHtml(prompt)}
            </div>
        `;
        
        addMessage(imageContent, false, true);
        showNotification('✅ Imagen generada correctamente', 'success');

    } catch (error) {
        hideTyping();
        console.error('❌ Error al generar imagen:', error);
        showError('Error al generar la imagen. Inténtalo de nuevo.');
        showNotification('❌ Error al generar imagen', 'error');
    } finally {
        input.disabled = false;
        imageButton.disabled = false;
        sendButton.disabled = false;
        input.focus();
    }
}

// ============================================
// CONFIGURACIÓN DEL BOT
// ============================================

function getPersonalityPrompt() {
    const personalities = {
        'profesional': 'Actúa de manera profesional, formal y estructurada. Usa un lenguaje técnico apropiado y sé preciso en tus respuestas.',
        'amigable': `Sé amigable, cercano y empático. Usa un tono cálido y acogedor. Puedes usar emojis ocasionalmente para expresar emociones.`,
        'tecnico': 'Proporciona respuestas técnicas detalladas con terminología especializada. Sé específico y preciso en explicaciones técnicas.',
        'creativo': 'Sé creativo, innovador y piensa fuera de la caja. Usa metáforas, analogías y ejemplos originales para explicar conceptos.',
        'casual': 'Usa un tono casual, relajado y conversacional. Sé natural, directo y cercano como si hablaras con un amigo.'
    };
    return personalities[appState.botConfig.personality] || personalities['profesional'];
}

function getTonePrompt() {
    const tones = {
        'conciso': 'Responde de forma breve y directa, en 2-3 oraciones máximo. Ve al grano sin rodeos.',
        'equilibrado': 'Proporciona respuestas moderadamente detalladas, balanceando claridad y brevedad. Explica lo necesario sin excederte.',
        'detallado': 'Da respuestas completas y exhaustivas con ejemplos, explicaciones detalladas y contexto adicional cuando sea relevante.'
    };
    return tones[appState.botConfig.tone] || tones['equilibrado'];
}

function getLanguagePrompt() {
    const languages = {
        'es': 'Responde SIEMPRE en español',
        'en': 'ALWAYS respond in English',
        'fr': 'Réponds TOUJOURS en français',
        'de': 'Antworte IMMER auf Deutsch',
        'it': 'Rispondi SEMPRE in italiano'
    };
    return languages[appState.botConfig.language] || languages['es'];
}

// ============================================
// ENVIAR MENSAJE
// ============================================

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const imageButton = document.getElementById('imageButton');
    const message = input.value.trim();

    if (!message) return;

    input.disabled = true;
    sendButton.disabled = true;
    imageButton.disabled = true;

    addMessage(message, true);
    input.value = '';

    showTyping();
    showNotification('🤖 Pensando...', 'info');

    try {
        // Construir el prompt del sistema con el nombre del usuario
        const systemPrompt = `Eres un asistente de IA llamado VOLITANCROOSS. ${getPersonalityPrompt()} ${getTonePrompt()} ${getLanguagePrompt()}. 

IMPORTANTE: Estás hablando con ${appState.userName}. Dirígete a esta persona por su nombre cuando sea apropiado y natural en la conversación. Recuerda su nombre y úsalo para personalizar tus respuestas.`;
        
        console.log('📤 Enviando mensaje:', {
            userName: appState.userName,
            conversationId: appState.currentConversationId,
            messageLength: message.length
        });
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                userName: appState.userName,
                conversationId: appState.currentConversationId,
                systemPrompt: systemPrompt,
                botConfig: appState.botConfig
            })
        });

        hideTyping();

        if (!response.ok) {
            throw new Error(`Error del servidor (${response.status})`);
        }

        const data = await response.json();
        
        console.log('📥 Respuesta recibida del servidor');
        
        if (data.response) {
            addMessage(data.response);
            showNotification('✅ Respuesta recibida', 'success');
        } else {
            throw new Error('Respuesta vacía del servidor');
        }

    } catch (error) {
        hideTyping();
        console.error('❌ Error en sendMessage:', error);
        
        let errorMsg = 'Error de conexión con el servidor';
        if (error.message.includes('Failed to fetch')) {
            errorMsg = 'No se pudo conectar con el servidor. Verifica que el workflow esté activo en n8n.';
        } else if (error.message.includes('Error del servidor')) {
            errorMsg = error.message;
        }
        
        showError(errorMsg);
        showNotification('❌ Error al enviar mensaje', 'error');
    } finally {
        input.disabled = false;
        sendButton.disabled = false;
        imageButton.disabled = false;
        input.focus();
    }
}

// ============================================
// EVENT HANDLERS
// ============================================

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Cerrar modales al hacer clic en el overlay
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('settingsModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeSettings();
        }
    });
    
    document.getElementById('welcomeModal').addEventListener('click', function(e) {
        if (e.target === this) {
            // No permitir cerrar el modal de bienvenida sin nombre
            if (!appState.userName) {
                showNotification('⚠️ Por favor ingresa tu nombre para continuar', 'warning');
            }
        }
    });
});

// ============================================
// INICIALIZAR AL CARGAR
// ============================================

window.onload = function() {
    console.log('🎉 Aplicación cargada');
    initApp();
};

// Debug en consola
console.log('%c🤖 VOLITANCROOSS CHATBOT', 'font-size: 20px; color: #00ffff; font-weight: bold;');
console.log('%cSistema de conversaciones con IA', 'font-size: 14px; color: #8a2be2;');
