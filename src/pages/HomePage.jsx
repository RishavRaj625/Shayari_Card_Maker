import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 animate-pulse">
            Shayari
          </h1>
          <p className="text-2xl md:text-3xl text-purple-200 mb-8">Card Maker</p>
          <p className="text-lg text-purple-300 mb-12 max-w-2xl mx-auto">
            Create beautiful shayari cards with stunning backgrounds and download them as images
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/create')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-12 rounded-xl text-xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-110 transition-all shadow-2xl"
            >
               Start Creating
            </button>
            <button
              onClick={() => navigate('/about')}
              className="bg-white/20 hover:bg-white/30 text-white font-bold py-4 px-12 rounded-xl text-xl transform hover:scale-110 transition-all shadow-2xl backdrop-blur-lg"
            >
              📖 Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;