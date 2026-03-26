'use client';

import { useState } from 'react';

interface FreePreviewButtonProps {
  videoId: string;
}

const FreePreviewButton = ({ videoId }: FreePreviewButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="free-preview-btn"
        onClick={() => setIsOpen(true)}
      >
        ▶ FREE PREVIEW
      </button>

      {isOpen && (
        <div className="video-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setIsOpen(false)}>✕</button>
            <div className="video-modal-iframe-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="Free Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FreePreviewButton;
