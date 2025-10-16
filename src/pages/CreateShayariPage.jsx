import { useState } from 'react';
import { useCards } from '../context/CardsContext';
import Navbar from '../components/Navbar';
import ShayariCard from '../components/ShayariCard';

const CreateShayariPage = () => {
  const { cards, backgrounds, addCard, deleteCard, downloadCard } = useCards();
  const [currentShayari, setCurrentShayari] = useState('');
  const [currentAuthor, setCurrentAuthor] = useState('');
  const [selectedBg, setSelectedBg] = useState('gradient1');

  const handleAddCard = () => {
    if (currentShayari.trim()) {
      addCard(currentShayari, currentAuthor, selectedBg);
      setCurrentShayari('');
      setCurrentAuthor('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center animate-pulse">
            ✨ Create Shayari Cards
          </h1>

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
              onClick={handleAddCard}
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
                <ShayariCard
                  key={card.id}
                  card={card}
                  backgrounds={backgrounds}
                  onDownload={downloadCard}
                  onDelete={deleteCard}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateShayariPage;