import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCards } from '../context/CardsContext';

const CardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCard, updateCard, deleteCard, backgrounds, bgColorMap } = useCards();
  
  const card = getCard(parseInt(id));
  const cardPreviewRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedShayari, setEditedShayari] = useState('');
  const [editedAuthor, setEditedAuthor] = useState('');
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (card) {
      setEditedShayari(card.shayari);
      setEditedAuthor(card.author);
    }
  }, [card]);

  if (!card) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-2xl mb-4">Card not found</p>
          <button
            onClick={() => navigate('/create')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (editedShayari.trim()) {
      updateCard(card.id, {
        shayari: editedShayari,
        author: editedAuthor || 'Anonymous',
      });
      setIsEditing(false);
    }
  };

  const handleBackgroundChange = (bg) => {
    updateCard(card.id, { background: bg });
    setShowBgPicker(false);
  };

  const handleDelete = () => {
    deleteCard(card.id);
    navigate('/create');
  };

  const handleDownload = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const canvasWidth = 1080;
      const canvasHeight = 1080;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
      const colors = bgColorMap[card.background] || bgColorMap.gradient1;
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(0.5, colors[1]);
      gradient.addColorStop(1, colors[2]);

      // Fill background
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Add overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Add decorative circles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(150, 150, 150, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(canvasWidth - 150, canvasHeight - 150, 200, 0, Math.PI * 2);
      ctx.fill();

      // Configure text
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 15;

      // Get current shayari text (edited or original)
      const currentShayari = isEditing ? editedShayari : card.shayari;
      const currentAuthor = isEditing ? editedAuthor : card.author;

      const lines = currentShayari.split('\n').filter(line => line.trim());
      const totalChars = currentShayari.length;
      
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

      // Add author
      startY += 40;
      ctx.font = `italic ${fontSize * 0.6}px Arial, sans-serif`;
      ctx.fillText(`- ${currentAuthor || 'Anonymous'}`, canvasWidth / 2, startY);

      // Download
      const link = document.createElement('a');
      link.download = `shayari-${card.id}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

      // Show success feedback
      const button = document.getElementById('download-btn');
      if (button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '✓ Downloaded';
        setTimeout(() => {
          button.innerHTML = originalHTML;
        }, 2000);
      }
    } catch (error) {
      console.error('Error downloading card:', error);
      alert('Error downloading card. Please try again.');
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <button
          onClick={() => navigate('/create')}
          className="flex items-center text-yellow-500 text-lg"
        >
          <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Cards
        </button>

        <div className="flex items-center space-x-4">
          {/* Download */}
          <button 
            id="download-btn"
            onClick={handleDownload}
            className="text-yellow-500 text-2xl hover:scale-110 transition-transform"
            title="Download Card"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>

          {/* Share */}
          <button 
            onClick={handleDownload}
            className="text-yellow-500 text-2xl hover:scale-110 transition-transform"
            title="Share"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>

          {/* More Options */}
          <button className="text-yellow-500 text-2xl hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {/* Done/Edit */}
          {isEditing ? (
            <button
              onClick={handleSave}
              className="text-yellow-500 text-lg font-semibold hover:scale-110 transition-transform"
            >
              Done
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-yellow-500 text-lg font-semibold hover:scale-110 transition-transform"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="px-4 py-6 max-w-4xl mx-auto pb-32">
        {isEditing ? (
          <>
            <textarea
              value={editedShayari}
              onChange={(e) => setEditedShayari(e.target.value)}
              className="w-full bg-transparent text-white text-lg leading-relaxed focus:outline-none resize-none min-h-[300px] font-normal"
              placeholder="Write your shayari here..."
              autoFocus
            />
            <input
              type="text"
              value={editedAuthor}
              onChange={(e) => setEditedAuthor(e.target.value)}
              className="w-full bg-transparent text-gray-400 text-base italic focus:outline-none mt-4 border-t border-gray-800 pt-4"
              placeholder="Author name"
            />
          </>
        ) : (
          <>
            <p className="text-white text-lg leading-relaxed whitespace-pre-line">
              {card.shayari}
            </p>
            <p className="text-gray-400 text-base italic mt-6 pt-4 border-t border-gray-800">
              - {card.author}
            </p>
          </>
        )}
      </div>

      {/* Bottom Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-4 py-4">
        <div className="flex justify-around items-center max-w-2xl mx-auto">
          {/* Background Picker */}
          <button
            onClick={() => setShowBgPicker(!showBgPicker)}
            className="flex flex-col items-center text-yellow-500 hover:scale-110 transition-transform"
          >
            <svg className="w-7 h-7 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <span className="text-xs">Style</span>
          </button>

          {/* Preview */}
          <button 
            onClick={togglePreview}
            className="flex flex-col items-center text-yellow-500 hover:scale-110 transition-transform"
          >
            <svg className="w-7 h-7 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-xs">Preview</span>
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="flex flex-col items-center text-yellow-500 hover:scale-110 transition-transform"
          >
            <svg className="w-7 h-7 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="text-xs">Download</span>
          </button>

          {/* Edit */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex flex-col items-center text-yellow-500 hover:scale-110 transition-transform"
          >
            <svg className="w-7 h-7 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-xs">Edit</span>
          </button>

          {/* Delete */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex flex-col items-center text-yellow-500 hover:scale-110 transition-transform"
          >
            <svg className="w-7 h-7 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="text-xs">Delete</span>
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <button
              onClick={togglePreview}
              className="text-yellow-500 text-lg"
            >
              Close
            </button>
            <h3 className="text-white text-lg font-semibold">Preview</h3>
            <button
              onClick={handleDownload}
              className="text-yellow-500 text-lg"
            >
              Download
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <div
              ref={cardPreviewRef}
              className={`${backgrounds[card.background]} p-8 rounded-2xl shadow-2xl w-full max-w-md aspect-square flex flex-col justify-center items-center text-center relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/20 rounded-full translate-x-20 translate-y-20 animate-pulse"></div>
              
              <div className="relative z-10">
                <p className="text-white text-2xl font-bold mb-4 leading-relaxed whitespace-pre-line drop-shadow-lg">
                  {isEditing ? editedShayari : card.shayari}
                </p>
                <p className="text-white/90 text-lg italic drop-shadow-md">
                  - {isEditing ? editedAuthor || 'Anonymous' : card.author}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background Picker Modal */}
      {showBgPicker && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end">
          <div className="w-full bg-gray-900 rounded-t-3xl p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-xl font-bold">Choose Background</h3>
              <button
                onClick={() => setShowBgPicker(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
              {Object.keys(backgrounds).map((bg) => (
                <button
                  key={bg}
                  onClick={() => handleBackgroundChange(bg)}
                  className={`h-24 rounded-xl ${backgrounds[bg]} transform transition-all hover:scale-105 ${
                    card.background === bg ? 'ring-4 ring-yellow-500 scale-105' : ''
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white text-xl font-bold mb-2">Delete Card?</h3>
            <p className="text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardDetailPage;