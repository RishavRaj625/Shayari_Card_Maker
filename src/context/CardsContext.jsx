import { createContext, useContext, useState } from 'react';

const CardsContext = createContext();

export const useCards = () => {
  const context = useContext(CardsContext);
  if (!context) {
    throw new Error('useCards must be used within CardsProvider');
  }
  return context;
};

export const CardsProvider = ({ children }) => {
  const [cards, setCards] = useState([]);

  const backgrounds = {
    gradient1: 'bg-gradient-to-br from-purple-600 via-pink-600 to-red-600',
    gradient2: 'bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600',
    gradient3: 'bg-gradient-to-br from-orange-600 via-red-600 to-pink-600',
    gradient4: 'bg-gradient-to-br from-green-600 via-emerald-600 to-cyan-600',
    gradient5: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600',
    gradient6: 'bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600',
  };

  const bgColorMap = {
    gradient1: ['#9333ea', '#db2777', '#dc2626'],
    gradient2: ['#2563eb', '#0891b2', '#0d9488'],
    gradient3: ['#ea580c', '#dc2626', '#db2777'],
    gradient4: ['#16a34a', '#059669', '#0891b2'],
    gradient5: ['#4f46e5', '#9333ea', '#db2777'],
    gradient6: ['#ca8a04', '#ea580c', '#dc2626'],
  };

  const addCard = (shayari, author, background) => {
    const newCard = {
      id: Date.now(),
      shayari,
      author: author || 'Anonymous',
      background,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCards([newCard, ...cards]);
    return newCard;
  };

  const updateCard = (id, updates) => {
    setCards(cards.map(card => 
      card.id === id 
        ? { ...card, ...updates, updatedAt: new Date().toISOString() }
        : card
    ));
  };

  const deleteCard = (id) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const getCard = (id) => {
    return cards.find(card => card.id === parseInt(id));
  };

  const downloadCard = async (cardId) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const canvasWidth = 1080;
      const canvasHeight = 1080;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
      const colors = bgColorMap[card.background] || bgColorMap.gradient1;
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(0.5, colors[1]);
      gradient.addColorStop(1, colors[2]);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(150, 150, 150, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(canvasWidth - 150, canvasHeight - 150, 200, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 15;

      const lines = card.shayari.split('\n').filter(line => line.trim());
      const totalChars = card.shayari.length;
      let fontSize = 48;
      if (totalChars > 200) fontSize = 36;
      if (totalChars > 300) fontSize = 32;
      if (totalChars > 400) fontSize = 28;

      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      
      const lineHeight = fontSize * 1.5;
      const totalHeight = lines.length * lineHeight;
      let startY = (canvasHeight - totalHeight) / 2;
      const padding = 100;
      if (startY < padding) startY = padding;

      const maxWidth = canvasWidth - 200;
      
      lines.forEach((line) => {
        const words = line.split(' ');
        let currentLine = '';
        const wrappedLines = [];

        words.forEach(word => {
          const testLine = currentLine + word + ' ';
          const metrics = ctx.measureText(testLine);
          
          if (metrics.width > maxWidth && currentLine !== '') {
            wrappedLines.push(currentLine.trim());
            currentLine = word + ' ';
          } else {
            currentLine = testLine;
          }
        });
        wrappedLines.push(currentLine.trim());

        wrappedLines.forEach(wrappedLine => {
          ctx.fillText(wrappedLine, canvasWidth / 2, startY);
          startY += lineHeight;
        });
      });

      startY += 40;
      ctx.font = `italic ${fontSize * 0.6}px Arial, sans-serif`;
      ctx.fillText(`- ${card.author}`, canvasWidth / 2, startY);

      const link = document.createElement('a');
      link.download = `shayari-${cardId}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Error downloading card:', error);
    }
  };

  return (
    <CardsContext.Provider value={{
      cards,
      backgrounds,
      bgColorMap,
      addCard,
      updateCard,
      deleteCard,
      getCard,
      downloadCard,
    }}>
      {children}
    </CardsContext.Provider>
  );
};