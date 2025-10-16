import Navbar from '../components/Navbar';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
            About Shayari Card Maker
          </h1>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-6">
            <h2 className="text-3xl font-bold text-white mb-6">✨ What is this?</h2>
            <div className="text-purple-100 space-y-4 text-lg">
              <p>
                Shayari Card Maker is a beautiful web application that allows you to create stunning, 
                shareable shayari cards with gorgeous gradient backgrounds and smooth animations.
              </p>
              <p>
                Perfect for expressing your emotions, sharing poetry, creating memorable quotes, 
                or simply spreading beautiful words with your friends and family.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-6">
            <h3 className="text-2xl font-bold text-white mb-4">🎨 Features:</h3>
            <ul className="text-purple-100 space-y-3 text-lg">
              <li className="flex items-start">
                <span className="mr-3">✨</span>
                <span>6 beautiful gradient backgrounds to choose from</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">📝</span>
                <span>Write custom shayari with author credits</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">💾</span>
                <span>Download cards as high-quality PNG images</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">🎨</span>
                <span>Create multiple cards in one session</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">📱</span>
                <span>Fully responsive design - works on all devices</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">💫</span>
                <span>Smooth animations and hover effects</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">🗑️</span>
                <span>Easy card management - delete unwanted cards</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">🚀 How to use:</h3>
            <ol className="text-purple-100 space-y-3 text-lg list-decimal list-inside">
              <li>Navigate to the Create page</li>
              <li>Write your shayari in the text area</li>
              <li>Add an author name (optional)</li>
              <li>Choose your favorite background gradient</li>
              <li>Click "Add Shayari Card" to create the card</li>
              <li>Download or delete cards as needed</li>
              <li>Create as many cards as you want!</li>
            </ol>
          </div>

          <div className="mt-8 text-center">
            <p className="text-purple-200 text-lg">
              Made with ❤️ using React, Vite, and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;