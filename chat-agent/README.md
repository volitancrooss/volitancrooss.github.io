# 🤖 VOLITANCROOSS CHATBOT - Sistema Avanzado de Conversaciones

## ✨ Características Implementadas

### 1. **Sistema de Usuario Personalizado** 👤
- Al entrar por primera vez, modal de bienvenida para ingresar nombre
- El nombre se guarda en localStorage y persiste entre sesiones
- Nombre visible en el header con avatar
- Posibilidad de cambiar el nombre desde configuración

### 2. **Sistema de Pestañas de Conversaciones** 📑
- **Crear nuevas conversaciones**: Botón "+" para iniciar nuevas conversaciones
- **Múltiples conversaciones simultáneas**: Guarda todas las conversaciones
- **Cambiar entre conversaciones**: Click en la pestaña para cambiar
- **Historial completo**: Cada conversación mantiene su propio historial de mensajes
- **Última actividad**: Las pestañas se ordenan por última actividad
- **Pestaña activa resaltada**: Visual claro de cuál está seleccionada

### 3. **Menú Contextual para Pestañas** ⋮
- **Renombrar conversación**: Personaliza el nombre de cada conversación
- **Eliminar conversación**: Borra conversaciones individuales
- **Protección**: No permite eliminar la última conversación
- **Confirmación**: Pide confirmación antes de eliminar

### 4. **Configuración Avanzada** ⚙️

#### Sección de Usuario:
- Cambiar nombre de usuario en cualquier momento

#### Sección de Personalidad del Bot:
- **Profesional y Formal**: Respuestas técnicas y estructuradas
- **Amigable y Cercano**: Tono cálido y empático
- **Técnico y Detallado**: Terminología especializada
- **Creativo e Innovador**: Respuestas originales con metáforas
- **Casual y Relajado**: Conversacional y natural

#### Sección de Tono:
- **Conciso**: Respuestas cortas (2-3 oraciones)
- **Equilibrado**: Balance entre brevedad y detalle
- **Detallado**: Respuestas completas y exhaustivas

#### Sección de Idioma:
- Español
- English
- Français
- Deutsch
- Italiano

#### Zona de Peligro:
- Eliminar todas las conversaciones (con doble confirmación)

### 5. **Persistencia de Datos** 💾
- Todo se guarda en `localStorage`
- Estado completo de la aplicación:
  - Nombre de usuario
  - Todas las conversaciones con mensajes
  - Configuración del bot
  - Última conversación activa
- Los datos persisten entre sesiones

### 6. **Generación de Imágenes** 🎨
- Botón dedicado para generar imágenes con IA
- Integración con Pollinations AI
- Las imágenes se guardan en el historial de conversación

### 7. **Interfaz Mejorada** 🎯
- Header dividido en dos secciones
- Info de usuario siempre visible
- Sistema de pestañas scrolleable
- Animaciones suaves
- Responsive completo
- Tema cyber/tech consistente

## 📊 Estructura de Datos

```javascript
appState = {
    userName: "Elena",
    currentConversationId: "conv_1234567890",
    conversations: {
        "conv_1234567890": {
            id: "conv_1234567890",
            name: "Conversación 1",
            messages: [
                {
                    content: "Hola",
                    isUser: true,
                    timestamp: 1234567890,
                    isImage: false
                }
            ],
            createdAt: 1234567890,
            lastActive: 1234567890
        }
    },
    botConfig: {
        personality: "profesional",
        tone: "equilibrado",
        language: "es"
    }
}
```

## 🎮 Funcionalidades Interactivas

### Crear Nueva Conversación
1. Click en el botón "+"
2. Se crea automáticamente con nombre "Conversación N"
3. Se activa automáticamente la nueva conversación

### Cambiar de Conversación
1. Click en cualquier pestaña
2. Se carga el historial completo de esa conversación
3. La pestaña se marca como activa

### Renombrar Conversación
1. Click en "⋮" de la pestaña
2. Seleccionar "Renombrar"
3. Ingresar nuevo nombre
4. Se actualiza inmediatamente

### Eliminar Conversación
1. Click en "⋮" de la pestaña
2. Seleccionar "Eliminar"
3. Confirmar en el diálogo
4. Se elimina y cambia a otra conversación

### Cambiar Nombre de Usuario
1. Click en "⚙" (configuración)
2. Modificar el campo "Tu Nombre"
3. Click en "Guardar Cambios"
4. Se actualiza en el header

## 🔧 Integración con n8n

El sistema envía al webhook:
```javascript
{
    message: "texto del mensaje",
    userName: "Elena",
    conversationId: "conv_1234567890",
    systemPrompt: "prompt personalizado según configuración",
    botConfig: {
        personality: "profesional",
        tone: "equilibrado",
        language: "es"
    }
}
```

## 🎨 Estilos Destacados

- **Glassmorphism**: Efectos de vidrio esmerilado
- **Gradientes animados**: Fondo con animaciones sutiles
- **Tema cyber**: Colores cyan y púrpura con neones
- **Sombras y brillos**: Efectos de profundidad
- **Transiciones suaves**: Animaciones en todos los elementos

## 📱 Responsive Design

- **Desktop**: Layout completo con todas las funciones
- **Tablet**: Header adaptado, pestañas scrolleables
- **Mobile**: Diseño optimizado, controles táctiles mejorados

## 🚀 Mejoras Futuras Sugeridas

1. Exportar conversaciones a PDF/TXT
2. Buscar en conversaciones
3. Archivar conversaciones
4. Temas de color personalizables
5. Compartir conversaciones
6. Atajos de teclado
7. Notificaciones de sonido
8. Modo oscuro/claro
9. Estadísticas de uso
10. Sincronización en la nube

## 💡 Tips de Uso

- **Ctrl/Cmd + Enter**: Enviar mensaje rápido
- **Scroll horizontal**: En pestañas si hay muchas
- **Click derecho**: No disponible, usar botón "⋮"
- **Auto-guardado**: Todo se guarda automáticamente
- **Primera vez**: Completa el modal de bienvenida

¡Disfruta tu chatbot personalizado! 🎉
