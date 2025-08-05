import { useState, useRef, useEffect } from 'react';
import { 
  XMarkIcon, 
  PaperAirplaneIcon, 
  ArrowPathIcon,
  ChatBubbleOvalLeftIcon,
  MicrophoneIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'system', text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Presets de ayuda rápida
  const quickPresets = [
    "Ver tipos de tamales",
    "¿Cuál es el combo más vendido?",
    "Saber qué bebidas llevan canela",
    "¿Qué tamales son picantes?",
    "¿Cuál es la bebida más popular?",
    "¿Tienen opciones vegetarianas?"
  ];

  // Inicializar reconocimiento de voz
  useEffect(() => {
    if (!recognitionRef.current && window.webkitSpeechRecognition) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.lang = 'es-ES';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const speechText = event.results[0][0].transcript;
        setInput(speechText);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Error en reconocimiento de voz:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error al iniciar reconocimiento de voz:', error);
        setIsListening(false);
      }
    } else {
      setMessages(prev => [...prev, { 
        role: 'system', 
        text: 'Lo siento, tu navegador no soporta reconocimiento de voz. Prueba con Chrome.' 
      }]);
    }
  };

  const sendMessage = async (e) => {
    e && e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    const content = input;
    setInput('');
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5151/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content })
      });
      if (!res.ok) throw new Error('Network response was not ok');
      
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'system', text: data?.response || 'Sin respuesta' }
      ]);
      
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'system', text: 'Error al obtener respuesta. Por favor, intenta de nuevo.' }
      ]);
    } finally {
      setLoading(false); 
    }
  };

  const sendQuickPreset = (preset) => {
    setInput(preset);
    // Simulamos un envío automático después de un breve retraso
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        const event = new Event('submit', { cancelable: true });
        form.dispatchEvent(event);
      }
    }, 300);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="bg-white w-80 h-[28rem] rounded-xl shadow-xl flex flex-col border border-gray-200 transform transition-all duration-300">
          {/* Cabecera */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white/20 p-1.5 rounded-lg mr-3">
                <ChatBubbleOvalLeftIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Asistente Virtual</h3>
                <p className="text-xs text-blue-100">Estamos aquí para ayudarte</p>
              </div>
            </div>
            <button 
              onClick={() => setOpen(false)}
              className="text-blue-100 hover:text-white focus:outline-none"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-none px-4 py-2 text-sm">
                  <div className="flex items-center">
                    <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                    Pensando...
                  </div>
                </div>
              </div>
            )}
            
            {/* Presets de ayuda rápida */}
            {messages.length <= 1 && !loading && (
              <div className="mt-4">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <LightBulbIcon className="w-4 h-4 mr-1" />
                  <span>Puedes preguntarme sobre:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickPresets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => sendQuickPreset(preset)}
                      className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full px-3 py-1.5 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Formulario de Entrada */}
          <form onSubmit={sendMessage} className="p-3 border-t border-gray-200 flex items-center bg-white">
            <button
              type="button"
              onClick={startSpeechRecognition}
              disabled={loading || isListening}
              className={`p-2 rounded-full mr-1 ${
                isListening 
                  ? 'animate-pulse bg-red-500 text-white' 
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <MicrophoneIcon className="w-5 h-5" />
            </button>
            
            <input
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              disabled={loading || isListening}
            />
            
            <button
              type="submit"
              disabled={loading || !input.trim() || isListening}
              className="ml-2 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
            >
              <PaperAirplaneIcon className="w-5 h-5 transform rotate-90" />
            </button>
          </form>
        </div>
      )}

      {/* Botón Flotante */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
      >
        {open ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <div className="relative">
            <ChatBubbleOvalLeftIcon className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs animate-pulse">
              !
            </span>
          </div>
        )}
      </button>
    </div>
  );
};

export default Chatbot;