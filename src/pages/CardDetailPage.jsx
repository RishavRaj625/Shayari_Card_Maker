import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCards } from "../context/CardsContext";

const CardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCard, updateCard, deleteCard, backgrounds, bgColorMap } =
    useCards();

  const card = getCard(parseInt(id));
  const cardPreviewRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedShayari, setEditedShayari] = useState("");
  const [editedAuthor, setEditedAuthor] = useState("");
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  useEffect(() => {
    if (card) {
      setEditedShayari(card.shayari);
      setEditedAuthor(card.author);
    }
  }, [card]);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMoreMenu && !event.target.closest(".more-menu-container")) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMoreMenu]);

  if (!card) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-2xl mb-4">Card not found</p>
          <button
            onClick={() => navigate("/create")}
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
        author: editedAuthor || "Anonymous",
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
    navigate("/create");
  };

  const handleDownload = async () => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const canvasWidth = 1080;
      const canvasHeight = 1080;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvasWidth,
        canvasHeight
      );
      const colors = bgColorMap[card.background] || bgColorMap.gradient1;
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(0.5, colors[1]);
      gradient.addColorStop(1, colors[2]);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.beginPath();
      ctx.arc(150, 150, 150, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(canvasWidth - 150, canvasHeight - 150, 200, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 15;

      const currentShayari = isEditing ? editedShayari : card.shayari;
      const currentAuthor = isEditing ? editedAuthor : card.author;

      const lines = currentShayari.split("\n").filter((line) => line.trim());
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
        const words = line.split(" ");
        let currentLine = "";
        const wrappedLines = [];

        words.forEach((word) => {
          const testLine = currentLine + word + " ";
          const metrics = ctx.measureText(testLine);

          if (metrics.width > maxWidth && currentLine !== "") {
            wrappedLines.push(currentLine.trim());
            currentLine = word + " ";
          } else {
            currentLine = testLine;
          }
        });
        wrappedLines.push(currentLine.trim());

        wrappedLines.forEach((wrappedLine) => {
          ctx.fillText(wrappedLine, canvasWidth / 2, startY);
          startY += lineHeight;
        });
      });

      startY += 40;
      ctx.font = `italic ${fontSize * 0.6}px Arial, sans-serif`;
      ctx.fillText(
        `- ${currentAuthor || "Anonymous"}`,
        canvasWidth / 2,
        startY
      );

      const link = document.createElement("a");
      link.download = `shayari-card-${card.id}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();

      const button = document.getElementById("download-btn");
      if (button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = "✓";
        setTimeout(() => {
          button.innerHTML = originalHTML;
        }, 2000);
      }
    } catch (error) {
      console.error("Error downloading card:", error);
      alert("Error downloading card. Please try again.");
    }
  };

  const handleDownloadNotes = async () => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const canvasWidth = 1080;
      // const canvasHeight = 2340;
      const canvasHeight = 1725;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Black background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Helper function to draw SVG icon
      const drawSVGIcon = async (svgElement, x, y, size, color) => {
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const img = new Image();
        const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
        const url = URL.createObjectURL(svgBlob);

        return new Promise((resolve) => {
          img.onload = () => {
            ctx.drawImage(img, x, y, size, size);
            URL.revokeObjectURL(url);
            resolve();
          };
          img.src = url;
        });
      };

      // ========== TOP BAR ==========
      const topBarHeight = 120;

      // Top bar border
      ctx.strokeStyle = "#1F2937";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, topBarHeight);
      ctx.lineTo(canvasWidth, topBarHeight);
      ctx.stroke();

      // Back arrow (< symbol)
      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("<", 50, topBarHeight / 2);

      // "Cards -> Notes" text
      ctx.font = "bold 40px Arial";
      ctx.fillText("Notes", 110, topBarHeight / 2);

      // Top right section
      const topIconY = topBarHeight / 2 - 20;
      const topIconSize = 40;

      // Create temporary SVG elements to render
      const createSVG = (pathD, x, y) => {
        ctx.strokeStyle = "#F59E0B";
        ctx.fillStyle = "none";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Download icon - arrow pointing down
        if (pathD === "download") {
          const baseX = x;
          const baseY = y + 20;
          ctx.beginPath();
          ctx.moveTo(baseX, baseY - 15);
          ctx.lineTo(baseX, baseY + 5);
          ctx.moveTo(baseX - 10, baseY - 5);
          ctx.lineTo(baseX, baseY + 5);
          ctx.lineTo(baseX + 10, baseY - 5);
          ctx.stroke();
          // Box at bottom
          ctx.strokeRect(baseX - 15, baseY + 8, 30, 10);
        }
        // Share icon - connected circles
        else if (pathD === "share") {
          const baseX = x;
          const baseY = y + 20;
          ctx.beginPath();
          ctx.arc(baseX - 15, baseY, 6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(baseX + 15, baseY - 8, 6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(baseX + 15, baseY + 8, 6, 0, Math.PI * 2);
          ctx.stroke();
          // Lines
          ctx.beginPath();
          ctx.moveTo(baseX - 9, baseY);
          ctx.lineTo(baseX + 9, baseY - 8);
          ctx.moveTo(baseX - 9, baseY);
          ctx.lineTo(baseX + 9, baseY + 8);
          ctx.stroke();
        }
        // Three dots vertical
        else if (pathD === "dots") {
          ctx.fillStyle = "#F59E0B";
          ctx.beginPath();
          ctx.arc(x, y + 10, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x, y + 20, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x, y + 30, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      // Draw top bar icons
      createSVG("download", canvasWidth - 450, topIconY);
      createSVG("share", canvasWidth - 350, topIconY);
      createSVG("dots", canvasWidth - 250, topIconY);

      // Edit text
      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 38px Arial";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText("Edit", canvasWidth - 60, topBarHeight / 2);

      // ========== MAIN CONTENT ==========
      let currentY = 200;
      const contentPadding = 80;
      const maxWidth = canvasWidth - contentPadding * 2;

      const currentShayari = isEditing ? editedShayari : card.shayari;
      const currentAuthor = isEditing ? editedAuthor : card.author;

      // Shayari text
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "42px Arial";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      const lines = currentShayari.split("\n");
      const lineHeight = 65;

      lines.forEach((line) => {
        if (line.trim() === "") {
          currentY += lineHeight;
          return;
        }

        const words = line.split(" ");
        let currentLine = "";

        words.forEach((word) => {
          const testLine = currentLine + word + " ";
          const metrics = ctx.measureText(testLine);

          if (metrics.width > maxWidth && currentLine !== "") {
            ctx.fillText(currentLine.trim(), contentPadding, currentY);
            currentY += lineHeight;
            currentLine = word + " ";
          } else {
            currentLine = testLine;
          }
        });

        if (currentLine.trim()) {
          ctx.fillText(currentLine.trim(), contentPadding, currentY);
          currentY += lineHeight;
        }
      });

      // Separator line
      currentY += 40;
      ctx.strokeStyle = "#1F2937";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(contentPadding, currentY);
      ctx.lineTo(canvasWidth - contentPadding, currentY);
      ctx.stroke();
      currentY += 50;

      // Author naming
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "italic 36px Arial";
      ctx.fillText(
        `- ${currentAuthor || "Anonymous"}`,
        contentPadding,
        currentY
      );

      // ========== BOTTOM TOOLBAR section:==========
      const bottomBarY = canvasHeight - 200;

      // Bottom border
      ctx.strokeStyle = "#1F2937";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, bottomBarY);
      ctx.lineTo(canvasWidth, bottomBarY);
      ctx.stroke();

      const spacing = canvasWidth / 5;
      const iconY = bottomBarY + 40;
      const labelY = bottomBarY + 130;

      ctx.strokeStyle = "#F59E0B";
      ctx.fillStyle = "#F59E0B";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Helper to draw bottom icons
      const drawBottomIcon = (type, x) => {
        const centerX = x;
        const centerY = iconY;

        ctx.strokeStyle = "#F59E0B";
        ctx.fillStyle = "none";

        switch (type) {
          case "style": // Brush/palette icon
            ctx.beginPath();
            ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(centerX - 8, centerY - 8);
            ctx.lineTo(centerX + 8, centerY + 8);
            ctx.moveTo(centerX - 8, centerY + 8);
            ctx.lineTo(centerX + 8, centerY - 8);
            ctx.stroke();
            break;

          case "preview": // Eye icon
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, 25, 15, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
            ctx.stroke();
            break;

          case "download": // Download arrow
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - 15);
            ctx.lineTo(centerX, centerY + 10);
            ctx.moveTo(centerX - 10, centerY);
            ctx.lineTo(centerX, centerY + 10);
            ctx.lineTo(centerX + 10, centerY);
            ctx.stroke();
            ctx.strokeRect(centerX - 15, centerY + 12, 30, 8);
            break;

          case "edit": // Pencil icon
            ctx.beginPath();
            ctx.moveTo(centerX - 12, centerY + 12);
            ctx.lineTo(centerX - 8, centerY + 12);
            ctx.lineTo(centerX + 12, centerY - 12);
            ctx.lineTo(centerX + 8, centerY - 16);
            ctx.closePath();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(centerX - 12, centerY + 12);
            ctx.lineTo(centerX - 16, centerY + 16);
            ctx.stroke();
            break;

          case "delete": // Trash icon
            ctx.strokeRect(centerX - 12, centerY - 8, 24, 20);
            ctx.beginPath();
            ctx.moveTo(centerX - 15, centerY - 8);
            ctx.lineTo(centerX + 15, centerY - 8);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(centerX - 8, centerY - 8);
            ctx.lineTo(centerX - 8, centerY - 14);
            ctx.moveTo(centerX + 8, centerY - 8);
            ctx.lineTo(centerX + 8, centerY - 14);
            ctx.stroke();
            // Vertical lines inside
            ctx.beginPath();
            ctx.moveTo(centerX - 6, centerY - 4);
            ctx.lineTo(centerX - 6, centerY + 8);
            ctx.moveTo(centerX, centerY - 4);
            ctx.lineTo(centerX, centerY + 8);
            ctx.moveTo(centerX + 6, centerY - 4);
            ctx.lineTo(centerX + 6, centerY + 8);
            ctx.stroke();
            break;
        }
      };

      // Draw all bottom icons
      drawBottomIcon("style", spacing * 0.5);
      drawBottomIcon("preview", spacing * 1.5);
      drawBottomIcon("download", spacing * 2.5);
      drawBottomIcon("edit", spacing * 3.5);
      drawBottomIcon("delete", spacing * 4.5);

      // Draw labels
      ctx.fillStyle = "#F59E0B";
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Style", spacing * 0.5, labelY);
      ctx.fillText("Preview", spacing * 1.5, labelY);
      ctx.fillText("Download", spacing * 2.5, labelY);
      ctx.fillText("Edit", spacing * 3.5, labelY);
      ctx.fillText("Delete", spacing * 4.5, labelY);

      // Download the screenshot
      const link = document.createElement("a");
      link.download = `shayari-screenshot-${card.id}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();

      setShowMoreMenu(false);
    } catch (error) {
      console.error("Error downloading notes screenshot:", error);
      alert("Error downloading screenshot. Please try again.");
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const currentShayari = isEditing ? editedShayari : card.shayari;
      const currentAuthor = isEditing ? editedAuthor : card.author;
      const textContent = `${currentShayari}\n\n- ${
        currentAuthor || "Anonymous"
      }`;

      await navigator.clipboard.writeText(textContent);
      setShowMoreMenu(false);
      alert("Copied to clipboard!");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      alert("Error copying to clipboard. Please try again.");
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
          onClick={() => navigate("/create")}
          className="flex items-center text-yellow-500 text-lg"
        >
          <svg
            className="w-6 h-6 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Cards
        </button>

        <div className="flex items-center space-x-4">
          {/* Download Card button*/}
          <button
            id="download-btn"
            onClick={handleDownload}
            className="text-yellow-500 text-2xl hover:scale-110 transition-transform"
            title="Download Card as Image"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </button>

          {/* Share button */}
          <button
            onClick={handleDownload}
            className="text-yellow-500 text-2xl hover:scale-110 transition-transform"
            title="Share"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>

          {/* More Options */}
          <div className="relative more-menu-container">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="text-yellow-500 text-2xl hover:scale-110 transition-transform"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50">
                <button
                  onClick={handleDownloadNotes}
                  className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Download Notes (PNG)</span>
                </button>

                <button
                  onClick={handleCopyToClipboard}
                  className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Copy to Clipboard</span>
                </button>

                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="w-full px-4 py-3 text-left text-red-400 hover:bg-gray-700 flex items-center space-x-3 transition-colors border-t border-gray-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>Delete Card</span>
                </button>
              </div>
            )}
          </div>

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
            <svg
              className="w-7 h-7 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            <span className="text-xs">Style</span>
          </button>

          {/* Preview */}
          <button
            onClick={togglePreview}
            className="flex flex-col items-center text-yellow-500 hover:scale-110 transition-transform"
          >
            <svg
              className="w-7 h-7 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span className="text-xs">Preview</span>
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="flex flex-col items-center text-yellow-500 hover:scale-110 transition-transform"
          >
            <svg
              className="w-7 h-7 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span className="text-xs">Download</span>
          </button>

          {/* Edit */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex flex-col items-center text-yellow-500 hover:scale-110 transition-transform"
          >
            <svg
              className="w-7 h-7 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span className="text-xs">Edit</span>
          </button>

          {/* Delete */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex flex-col items-center text-yellow-500 hover:scale-110 transition-transform"
          >
            <svg
              className="w-7 h-7 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="text-xs">Delete</span>
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <button onClick={togglePreview} className="text-yellow-500 text-lg">
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
              className={`${
                backgrounds[card.background]
              } p-8 rounded-2xl shadow-2xl w-full max-w-md aspect-square flex flex-col justify-center items-center text-center relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

              <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/20 rounded-full translate-x-20 translate-y-20 animate-pulse"></div>

              <div className="relative z-10">
                <p className="text-white text-2xl font-bold mb-4 leading-relaxed whitespace-pre-line drop-shadow-lg">
                  {isEditing ? editedShayari : card.shayari}
                </p>
                <p className="text-white/90 text-lg italic drop-shadow-md">
                  - {isEditing ? editedAuthor || "Anonymous" : card.author}
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
              <h3 className="text-white text-xl font-bold">
                Choose Background
              </h3>
              <button
                onClick={() => setShowBgPicker(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
              {Object.keys(backgrounds).map((bg) => (
                <button
                  key={bg}
                  onClick={() => handleBackgroundChange(bg)}
                  className={`h-24 rounded-xl ${
                    backgrounds[bg]
                  } transform transition-all hover:scale-105 ${
                    card.background === bg
                      ? "ring-4 ring-yellow-500 scale-105"
                      : ""
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
