import React, { useState, useEffect, useRef } from 'react';
// To respect Queen's login measures, use a popup window to login and book room
// note, iframe doesn't work bc queens login will popup another tab and leave the app
const BOOKING_URL = "https://app.skedda.com/account/login?returnUrl=https%3A%2F%2Fsmithengineering.skedda.com%2Fbooking";

const Booking = ({ isOpen, onClose }) => {
  const popupRef = useRef(null);
  const openedAt = useRef(null);

  // Open popup when isOpen becomes true
  useEffect(() => {
    if (isOpen) {
      const w = Math.min(1200, window.screen.availWidth * 0.9);
const h = Math.min(800, window.screen.availHeight * 0.9);
const left = (window.screen.availWidth - w) / 2;
const top = (window.screen.availHeight - h) / 2;

      popupRef.current = window.open(BOOKING_URL, "bookingWindow", `width=${w},height=${h},left=${left},top=${top}`);
      openedAt.current = Date.now();
      if (!popupRef.current) {
        alert("Popup blocked!");
        onClose();
      }
    }
  }, [isOpen]);

  // Detect popup closed by user
  useEffect(() => {
    const interval = setInterval(() => {
      if (popupRef.current?.closed) {
        popupRef.current = null;
        onClose();
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Close when main window regains focus
  useEffect(() => {
    const handleFocus = () => {
      const openedRecently = Date.now() - (openedAt.current ?? 0) < 1000;
      if (openedRecently) return;
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
        popupRef.current = null;
        onClose();
      }
    };
    //event listener for handling different clicking events (i.e. user clicks main page without closing popup)
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleClose = () => {
    popupRef.current?.close();
    popupRef.current = null;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={handleClose}
        // Gives faded background
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(20, 20, 40, 0.55)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, animation: 'fadeIn 0.3s ease', cursor: 'pointer' }}
      > 
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </>
  );
};

export default Booking;