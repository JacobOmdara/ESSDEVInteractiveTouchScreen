import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const ROWS = 9;
const COLS = 9;
const MINES = 10;

const createEmptyBoard = () =>
  Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );

const placeMines = (board, firstRow, firstCol) => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!newBoard[r][c].isMine && !(r === firstRow && c === firstCol)) {
      newBoard[r][c].isMine = true;
      placed++;
    }
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!newBoard[r][c].isMine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newBoard[nr][nc].isMine) count++;
          }
        }
        newBoard[r][c].adjacentMines = count;
      }
    }
  }
  return newBoard;
};

const revealCells = (board, row, col) => {
  const newBoard = board.map(r => r.map(c => ({ ...c })));
  const stack = [[row, col]];
  while (stack.length) {
    const [r, c] = stack.pop();
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
    if (newBoard[r][c].isRevealed || newBoard[r][c].isFlagged) continue;
    newBoard[r][c].isRevealed = true;
    if (newBoard[r][c].adjacentMines === 0 && !newBoard[r][c].isMine) {
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          stack.push([r + dr, c + dc]);
    }
  }
  return newBoard;
};

const NUMBER_COLORS = ['', '#2563eb', '#16a34a', '#dc2626', '#7c3aed', '#b91c1c', '#0891b2', '#000', '#6b7280'];

const Minesweeper = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [gameState, setGameState] = useState('idle'); // idle, playing, won, lost
  const [flagMode, setFlagMode] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const navigate = useNavigate();

  const handleReset = useCallback(() => {
    setBoard(createEmptyBoard());
    setGameState('idle');
    setFlagMode(false);
    setFirstClick(true);
  }, []);

  const checkWin = (b) => {
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (!b[r][c].isMine && !b[r][c].isRevealed) return false;
    return true;
  };

  const handleCellPress = useCallback((row, col) => {
    if (gameState === 'won' || gameState === 'lost') return;
    const cell = board[row][col];
    if (cell.isRevealed) return;

    if (flagMode) {
      const newBoard = board.map(r => r.map(c => ({ ...c })));
      const wasFlag = newBoard[row][col].isFlagged;
      newBoard[row][col].isFlagged = !wasFlag;
      setBoard(newBoard);
      return;
    }

    if (cell.isFlagged) return;

    let workingBoard = board;
    if (firstClick) {
      workingBoard = placeMines(board, row, col);
      setFirstClick(false);
      setGameState('playing');
    }

    if (workingBoard[row][col].isMine) {
      const newBoard = workingBoard.map(r =>
        r.map(c => ({ ...c, isRevealed: c.isMine ? true : c.isRevealed }))
      );
      newBoard[row][col].exploded = true;
      setBoard(newBoard);
      setGameState('lost');
      return;
    }

    const newBoard = revealCells(workingBoard, row, col);
    setBoard(newBoard);
    if (checkWin(newBoard)) setGameState('won');
  }, [board, gameState, flagMode, firstClick]);

  const flagCount = board.flat().filter(c => c.isFlagged).length;

  const getCellStyle = (cell) => {
    const base = {
      width: '80px',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '12px',
      fontSize: '32px',
      fontWeight: '800',
      fontFamily: "'Courier New', monospace",
      cursor: 'pointer',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      transition: 'transform 0.08s, background 0.1s',
      border: 'none',
      outline: 'none',
      WebkitTapHighlightColor: 'transparent',
    };

    if (cell.exploded) return { ...base, background: '#ef4444', color: '#fff' };
    if (cell.isRevealed && cell.isMine) return { ...base, background: '#374151' };
    if (cell.isRevealed) return {
      ...base,
      background: 'rgba(255,255,255,0.06)',
      color: NUMBER_COLORS[cell.adjacentMines] || 'transparent',
      cursor: 'default',
    };
    if (cell.isFlagged) return { ...base, background: 'rgba(251,191,36,0.2)', border: '3px solid rgba(251,191,36,0.5)', color: '#fbbf24' };
    return { ...base, background: 'rgba(255,255,255,0.1)', border: '3px solid rgba(255,255,255,0.15)' };
  };

  const renderCellContent = (cell) => {
    if (cell.isFlagged && !cell.isRevealed) return '🚩';
    if (cell.isRevealed && cell.isMine) {
      return (
        <img 
          src="/commerce.png" 
          alt="mine" 
          style={{ 
            width: '60px', 
            height: '60px', 
            objectFit: 'contain',
            filter: cell.exploded ? 'drop-shadow(0 0 10px red) brightness(1.2)' : 'none'
          }} 
        />
      );
    }
    if (cell.isRevealed && cell.adjacentMines > 0) return cell.adjacentMines;
    return '';
  };

  const statusImage = gameState === 'won'
    ? '/win.png'
    : gameState === 'lost'
    ? '/lose.png'
    : flagMode
    ? '/looking.png'
    : '/good.png';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#111',
      padding: '40px',
      boxSizing: 'border-box',
      fontFamily: 'serif', // Matches your "everything else is serif" requirement
    }}>

      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '2px solid rgba(255,255,255,0.3)',
            color: 'white',
            fontSize: '24px',
            padding: '15px 35px',
            borderRadius: '15px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          ← Back
        </button>

        <div style={{ 
          color: 'white', 
          fontSize: '36px', 
          fontWeight: '900', 
          letterSpacing: '4px',
          fontFamily: '"Volkhov", serif' // Specifically Volkhov
        }}>
          COMMSWEEPER
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.1)',
          border: '3px solid rgba(255,255,255,0.2)',
          borderRadius: '15px',
          padding: '15px 25px',
          color: '#f87171',
          fontSize: '32px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <img src="/commerce.png" alt="Mines" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
          {MINES - flagCount}
        </div>
      </div>

      {/* Centering Container */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        gap: '40px' 
      }}>
        
        {/* Status Image Bar */}
        <div style={{ minHeight: '100px', display: 'flex', alignItems: 'center' }}>
          <img
            src={statusImage}
            alt="status"
            style={{ height: '100px', objectFit: 'contain', transition: 'all 0.3s' }}
          />
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 80px)`,
          gridTemplateRows: `repeat(${ROWS}, 80px)`,
          gap: '8px',
          padding: '20px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        }}>
          {board.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                onPointerDown={() => handleCellPress(r, c)}
                style={getCellStyle(cell)}
              >
                {renderCellContent(cell)}
              </button>
            ))
          )}
        </div>

        {/* Controls - Matched to Grid Width */}
        <div style={{
          display: 'flex',
          gap: '20px',
          width: `${(COLS * 80) + (COLS * 8)}px`,
        }}>
          <button
            onPointerDown={() => setFlagMode(f => !f)}
            style={{
              flex: 1,
              padding: '25px',
              borderRadius: '20px',
              border: flagMode ? '4px solid #fbbf24' : '4px solid rgba(255,255,255,0.3)',
              background: flagMode ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.1)',
              color: flagMode ? '#fbbf24' : 'white',
              fontSize: '28px',
              fontWeight: '700',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {flagMode ? '🚩 Flagging' : '🔍 Revealing'}
          </button>

          <button
            onPointerDown={handleReset}
            style={{
              flex: 1,
              padding: '25px',
              borderRadius: '20px',
              border: '4px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '28px',
              fontWeight: '700',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ↺ New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default Minesweeper;