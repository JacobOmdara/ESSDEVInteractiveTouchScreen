import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_S3_SECRET_KEY,
  },
});

function PhotoGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const bucketName = "essdev-photo-album-2026";
  const navigate = useNavigate();

  const VISIBLE = 10;
  const PER_ROW = 5;

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      const command = new ListObjectsV2Command({ Bucket: bucketName });
      try {
        const response = await s3Client.send(command);
        if (!response.Contents || response.Contents.length === 0) {
          setImages([]);
        } else {
          const s3Urls = response.Contents.map(file => ({
            key: file.Key,
            url: `https://${bucketName}.s3.amazonaws.com/${file.Key}`
          }));
          setImages(s3Urls);
        }
      } catch (err) {
        console.error("Error fetching images:", err);
        setError(err.message || "Failed to load images.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex, images]);

  const handlePrev = () => setCurrentIndex(i => Math.max(0, i - VISIBLE));
  const handleNext = () => setCurrentIndex(i => Math.min(images.length - VISIBLE, i + VISIBLE));

  const atStart = currentIndex === 0;
  const atEnd = currentIndex >= images.length - VISIBLE;

  const navButtonStyle = (disabled) => ({
    background: disabled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
    border: `2px solid ${disabled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'}`,
    color: disabled ? '#555' : 'white',
    fontSize: '40px',
    borderRadius: '10px',
    width: '56px',
    height: '56px',
    cursor: disabled ? 'default' : 'pointer',
    flexShrink: 0,
    alignSelf: 'center',
    transition: 'background 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#111' }}>
        <p style={{ fontSize: '24px', color: '#aaa' }}>📷 Loading photos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#111', gap: '12px' }}>
        <p style={{ fontSize: '24px', color: 'red' }}>⚠️ Error loading photos</p>
        <p style={{ fontSize: '16px', color: '#aaa' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', borderRadius: '8px', border: 'none', background: '#667eea', color: 'white' }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#111' }}>
        <p style={{ fontSize: '24px', color: '#aaa' }}>No photos found in the bucket.</p>
      </div>
    );
  }

  const visibleImages = images.slice(currentIndex, currentIndex + VISIBLE);
  const topRow = visibleImages.slice(0, PER_ROW);
  const bottomRow = visibleImages.slice(PER_ROW, VISIBLE);

  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#111',
        padding: '20px',
        boxSizing: 'border-box',
        gap: '16px',
      }}>

        {/* Back Button */}
        <div>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid rgba(255,255,255,0.3)',
              color: 'white',
              fontSize: '18px',
              padding: '10px 24px',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            ← Back
          </button>
        </div>

        {/* Carousel Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flex: 1,
          minHeight: 0,
        }}>

          {/* Prev Button */}
          <button
            onClick={handlePrev}
            disabled={atStart}
            style={navButtonStyle(atStart)}
            onMouseEnter={(e) => { if (!atStart) e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={(e) => { if (!atStart) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          >
            ‹
          </button>

          {/* Two Rows of Thumbnails */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            flex: 1,
            height: '100%',
          }}>
            {[topRow, bottomRow].map((row, rowIndex) => (
              <div key={rowIndex} style={{ display: 'flex', gap: '16px', flex: 1 }}>
                {row.map(img => (
                  <div
                    key={img.key}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      flex: 1,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: '#222',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <img
                      src={img.url}
                      alt={img.key}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={atEnd}
            style={navButtonStyle(atEnd)}
            onMouseEnter={(e) => { if (!atEnd) e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={(e) => { if (!atEnd) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          >
            ›
          </button>
        </div>

      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            cursor: 'zoom-out',
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              const idx = images.findIndex(i => i.key === selectedImage.key);
              setSelectedImage(images[(idx - 1 + images.length) % images.length]);
            }}
            style={{
              position: 'absolute', left: '20px',
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid rgba(255,255,255,0.3)',
              color: 'white', fontSize: '40px', borderRadius: '10px',
              width: '56px', height: '56px', cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            ‹
          </button>

          <img
            src={selectedImage.url}
            alt={selectedImage.key}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '12px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            }}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              const idx = images.findIndex(i => i.key === selectedImage.key);
              setSelectedImage(images[(idx + 1) % images.length]);
            }}
            style={{
              position: 'absolute', right: '20px',
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid rgba(255,255,255,0.3)',
              color: 'white', fontSize: '40px', borderRadius: '10px',
              width: '56px', height: '56px', cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            ›
          </button>

          <button
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'absolute', top: '20px', right: '20px',
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid rgba(255,255,255,0.3)',
              color: 'white', fontSize: '20px', borderRadius: '10px',
              width: '48px', height: '48px', cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}

export default PhotoGallery;