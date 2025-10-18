import { useNavigate } from 'react-router-dom';

const ShayariCard = ({ card, backgrounds, onDownload, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="relative group animate-fade-in">
      <div
        onClick={() => navigate(`/card/${card.id}`)}
        className={`${backgrounds[card.background]} p-8 rounded-2xl shadow-2xl min-h-64 flex flex-col justify-center items-center text-center relative overflow-hidden transform transition-all hover:scale-105 cursor-pointer`}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/20 rounded-full translate-x-20 translate-y-20 animate-pulse"></div>
        
        <div className="relative z-10">
          <p className="text-white text-2xl font-bold mb-4 leading-relaxed whitespace-pre-line drop-shadow-lg line-clamp-6">
            {card.shayari}
          </p>
          <p className="text-white/90 text-lg italic drop-shadow-md">
            - {card.author}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload(card.id);
          }}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transform hover:scale-105 transition-all shadow-lg"
        >
           Download
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(card.id);
          }}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transform hover:scale-105 transition-all shadow-lg"
        >
          Delete
        </button>
      </div>
    </div>
  );
};


export default ShayariCard;

