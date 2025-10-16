import { useState, useRef } from 'react';

const ShayariCardMaker = () => {
  const [cards, setCards] = useState([]);
  const [currentShayari, setCurrentShayari] = useState('');
  const [currentAuthor, setCurrentAuthor] = useState('');
  const [selectedBg, setSelectedBg] = useState('gradient1');
  
  const backgrounds = {
    gradient1: 'bg-gradient-to-br from-purple-600 via-pink-600 to-red-600',
    gradient2: 'bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600',
    gradient3: 'bg-gradient-to-br from-orange-600 via-red-600 to-pink-600',
    gradient4: 'bg-gradient-to-br from-green-600 via-emerald-600 to-cyan-600',
    gradient5: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600',
    gradient6: 'bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600',
  };

  const addCard = () => {
    if (currentShayari.trim()) {
      const newCard = {
        id: Date.now(),
        shayari: currentShayari,
        author: currentAuthor || 'Anonymous',
        background: selectedBg,
      };
      setCards([...cards, newCard]);
      setCurrentShayari('');
      setCurrentAuthor('');
    }
  };

  const deleteCard = (id) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const downloadCard = async (cardId) => {
    const cardElement = document.getElementById(`card-${cardId}`);
    if (!cardElement) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const scale = 2;
      
      canvas.width = cardElement.offsetWidth * scale;
      canvas.height = cardElement.offsetHeight * scale;
      ctx.scale(scale, scale);

      const computedStyle = window.getComputedStyle(cardElement);
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      
      const bgClass = cardElement.className;
      if (bgClass.includes('purple-600')) {
        gradient.addColorStop(0, '#9333ea');
        gradient.addColorStop(0.5, '#db2777');
        gradient.addColorStop(1, '#dc2626');
      } else if (bgClass.includes('blue-600')) {
        gradient.addColorStop(0, '#2563eb');
        gradient.addColorStop(0.5, '#0891b2');
        gradient.addColorStop(1, '#0d9488');
      } else if (bgClass.includes('orange-600')) {
        gradient.addColorStop(0, '#ea580c');
        gradient.addColorStop(0.5, '#dc2626');
        gradient.addColorStop(1, '#db2777');
      } else if (bgClass.includes('green-600')) {
        gradient.addColorStop(0, '#16a34a');
        gradient.addColorStop(0.5, '#059669');
        gradient.addColorStop(1, '#0891b2');
      } else if (bgClass.includes('indigo-600')) {
        gradient.addColorStop(0, '#4f46e5');
        gradient.addColorStop(0.5, '#9333ea');
        gradient.addColorStop(1, '#db2777');
      } else if (bgClass.includes('yellow-600')) {
        gradient.addColorStop(0, '#ca8a04');
        gradient.addColorStop(0.5, '#ea580c');
        gradient.addColorStop(1, '#dc2626');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 10;
      
      const card = cards.find(c => c.id === cardId);
      const lines = card.shayari.split('\n');
      const lineHeight = 45;
      const startY = (canvas.height / scale - lines.length * lineHeight) / 2;

      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / (2 * scale), startY + index * lineHeight);
      });

      ctx.font = 'italic 20px Arial';
      ctx.fillText(`- ${card.author}`, canvas.width / (2 * scale), startY + lines.length * lineHeight + 40);

      const link = document.createElement('a');
      link.download = `shayari-${cardId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading card:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-white mb-2 animate-pulse">
          ✨ Shayari Card Maker ✨
        </h1>
        <p className="text-center text-purple-200 mb-8">Create beautiful shayari cards with stunning backgrounds</p>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">Create New Shayari</h2>
          
          <textarea
            value={currentShayari}
            onChange={(e) => setCurrentShayari(e.target.value)}
            placeholder="Write the shayari here..."
            className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-purple-200 border-2 border-white/30 focus:border-purple-400 focus:outline-none mb-4 min-h-32 resize-none"
          />
          
          <input
            type="text"
            value={currentAuthor}
            onChange={(e) => setCurrentAuthor(e.target.value)}
            placeholder="Author name (optional)"
            className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-purple-200 border-2 border-white/30 focus:border-purple-400 focus:outline-none mb-4"
          />

          <div className="mb-4">
            <p className="text-white mb-3 font-semibold">Choose Background:</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {Object.keys(backgrounds).map((bg) => (
                <button
                  key={bg}
                  onClick={() => setSelectedBg(bg)}
                  className={`h-16 rounded-xl ${backgrounds[bg]} transform transition-all hover:scale-110 ${
                    selectedBg === bg ? 'ring-4 ring-white scale-110' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={addCard}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all shadow-lg"
          >
            ➕ Add Shayari Card
          </button>
        </div>

        {cards.length === 0 ? (
          <div className="text-center text-purple-200 text-xl py-12">
            <p>No cards yet. Create your first shayari card! 🎨</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div key={card.id} className="relative group animate-fade-in">
                <div
                  id={`card-${card.id}`}
                  className={`${backgrounds[card.background]} p-8 rounded-2xl shadow-2xl min-h-64 flex flex-col justify-center items-center text-center relative overflow-hidden transform transition-all hover:scale-105`}
                >
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/20 rounded-full translate-x-20 translate-y-20 animate-pulse"></div>
                  
                  <div className="relative z-10">
                    <p className="text-white text-2xl font-bold mb-4 leading-relaxed whitespace-pre-line drop-shadow-lg">
                      {card.shayari}
                    </p>
                    <p className="text-white/90 text-lg italic drop-shadow-md">
                      - {card.author}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => downloadCard(card.id)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transform hover:scale-105 transition-all shadow-lg"
                  >
                    ⬇️ Download
                  </button>
                  <button
                    onClick={() => deleteCard(card.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transform hover:scale-105 transition-all shadow-lg"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShayariCardMaker;