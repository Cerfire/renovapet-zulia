import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloat = () => {
    const phoneNumber = "584124383334"; // RenovaPet Zulia
    const message = "Hola, necesito soporte técnico o tengo una duda sobre un producto.";
    const link = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300 flex items-center justify-center group"
            aria-label="Contactar por WhatsApp"
        >
            <MessageCircle className="w-8 h-8 fill-current" />
            <span className="absolute right-full mr-3 bg-white text-gray-800 text-sm font-medium py-1 px-3 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                ¿Necesitas ayuda?
            </span>
        </a>
    );
};

export default WhatsAppFloat;
