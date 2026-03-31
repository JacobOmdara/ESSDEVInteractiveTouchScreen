import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SOURCES = {
  "Queen's Journal": {
    color: 'rgba(208, 217, 233, 0.8)',
    activeBackground: 'rgba(0, 36, 99, 0.6)',
    accent: 'rgb(56, 115, 177)',
    background: 'hsl(218, 65%, 42%)',
  },
  'Golden Words': {
    color: 'rgba(180, 140, 0, 0.8)',
    activeBackground: 'rgba(222, 174, 2, 0.6)',
    accent: 'rgb(180, 140, 0)',
    background: 'rgb(255, 200, 2)',
  },
};

const CATEGORY_ICONS = {
  Sports: '🏅', News: '📰', Opinion: '💬', Arts: '🎨',
  Science: '🔬', Technology: '💻', Politics: '🏛️', 'Student life': '🎓',
  Postscript: '✍️', Editorial: '📝', Music: '🎵', Film: '🎬',
  Food: '🍴', Health: '🏥', Environment: '🌿',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getPlaceholderIcon = (categories) => {
  for (const cat of categories ?? []) {
    if (CATEGORY_ICONS[cat]) return CATEGORY_ICONS[cat];
  }
  return '📰';
};

const getImage = (article) => {
  if (article.thumbnail) return article.thumbnail;
  const match = article.content?.match(/<img[^>]+src="([^">]+)"/);
  return match?.[1] ?? null;
};

const stripHtml = (html, max = 200) =>
  (html?.replace(/<[^>]+>/g, '') ?? '').slice(0, max) + '...';

const formatDate = (str, long = false) =>
  new Date(str).toLocaleDateString('en-CA', long
    ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    : { month: 'short', day: 'numeric', year: 'numeric' }
  );

// ─── Sub-components ───────────────────────────────────────────────────────────

const CategoryBadge = ({ cat, color, size = 'sm' }) => (
  <span style={{
    background: color,
    padding: size === 'lg' ? '4px 14px' : '2px 10px',
    borderRadius: '20px',
    fontSize: size === 'lg' ? '14px' : '13px',
    fontWeight: '600',
  }}>
    {cat}
  </span>
);

const Thumbnail = ({ article, theme, width, height, fontSize = '32px' }) => {
  const image = getImage(article);
  const style = { width, height, flexShrink: 0, borderRadius: height ? '10px' : 0, objectFit: 'cover' };
  return image
    ? <img src={image} alt="" style={style} />
    : (
      <div style={{ ...style, background: theme.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize }}>
        {getPlaceholderIcon(article.categories)}
      </div>
    );
};

const FeaturedArticle = ({ article, theme, onOpen }) => (
  <div
    onClick={() => onOpen(article.link)}
    style={{
      background: 'rgba(255,255,255,0.1)', borderRadius: '20px', marginBottom: '40px',
      cursor: 'pointer', border: `2px solid ${theme.accent}`, overflow: 'hidden',
      display: 'flex', minHeight: '300px', backdropFilter: 'blur(5px)', transition: '0.3s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
  >
    <Thumbnail article={article} theme={theme} width="400px" fontSize="100px" />
    <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {article.categories?.slice(0, 3).map(cat => (
          <CategoryBadge key={cat} cat={cat} color={theme.color} size="lg" />
        ))}
      </div>
      <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '14px', lineHeight: 1.3 }}>
        {article.title}
      </div>
      <div
        style={{ fontSize: '18px', opacity: 0.8, lineHeight: 1.6 }}
        dangerouslySetInnerHTML={{ __html: stripHtml(article.description) }}
      />
      <div style={{ marginTop: '16px', fontSize: '16px', opacity: 0.6 }}>
        {article.author && <span>{article.author} · </span>}
        {formatDate(article.pubDate, true)}
      </div>
    </div>
  </div>
);

const ArticleCard = ({ article, theme, onOpen }) => (
  <div
    onClick={() => onOpen(article.link)}
    style={{
      background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px 24px',
      cursor: 'pointer', border: `1px solid ${theme.accent}`, display: 'flex',
      alignItems: 'center', gap: '20px', backdropFilter: 'blur(5px)', transition: '0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
  >
    <Thumbnail article={article} theme={theme} width="100px" height="70px" />
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
        {article.categories?.slice(0, 2).map(cat => (
          <CategoryBadge key={cat} cat={cat} color={theme.color} />
        ))}
        <span style={{ fontSize: '14px', opacity: 0.6 }}>{formatDate(article.pubDate)}</span>
      </div>
      <div style={{ fontSize: '20px', fontWeight: '600' }}>{article.title}</div>
      {article.author && <div style={{ fontSize: '14px', opacity: 0.5, marginTop: '4px' }}>{article.author}</div>}
    </div>
    <div style={{ fontSize: '24px', opacity: 0.5 }}>→</div>
  </div>
);

const GoldenWords = ({ theme }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchPDF = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/golden-words');
      const data = await res.json();
      if (data.pdf_url) setPdfUrl(data.pdf_url);
    } catch (err) {
      console.error('Failed to fetch Golden Words PDF:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchPDF();
  }, []);

  return (
    <div style={{ width: '100%', height: '80vh', borderRadius: '20px', overflow: 'hidden', border: `2px solid ${theme.accent}` }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px', fontSize: '24px', opacity: 0.6 }}>Loading Golden Words...</div>
      ) : pdfUrl ? (
        <iframe src={pdfUrl} style={{ width: '100%', height: '100%', border: 'none' }} title="Golden Words Latest Issue" />
      ) : (
        <div style={{ textAlign: 'center', padding: '100px', fontSize: '24px', opacity: 0.6 }}>
          Could not load Golden Words. Try visiting{' '}
          <a href="https://goldenwords.ca" target="_blank" rel="noreferrer" style={{ color: 'white' }}>goldenwords.ca</a>
        </div>
      )}
    </div>
  );
};

const ArticleOverlay = ({ onClose }) => (
  <div
    onClick={onClose}
    style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(20,20,40,0.55)', backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 999, cursor: 'pointer',
    }}
  >
    <div style={{
      textAlign: 'center', color: 'white', fontSize: '26px',
      background: 'rgba(255,255,255,0.15)', padding: '30px 50px',
      borderRadius: '20px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
    }}>
      <div style={{ fontSize: '32px', marginBottom: '10px' }}>Article Open</div>
      <div style={{ opacity: 0.85 }}>Reading in the popup window</div>
      <div style={{ marginTop: '20px', fontSize: '20px', opacity: 0.7 }}>Tap anywhere to return</div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const News = () => {
  const navigate = useNavigate();
  const [activeSource, setActiveSource] = useState("Queen's Journal");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [articleOpen, setArticleOpen] = useState(false);
  const popupRef = useRef(null);
  const openedAt = useRef(null);

  const theme = SOURCES[activeSource];
  const [featured, ...rest] = articles;

  // Allow page to scroll naturally
  useEffect(() => {
    document.body.style.height = 'auto';
    document.body.style.minHeight = '100%';
    return () => {
      document.body.style.height = '100%';
      document.body.style.minHeight = '';
    };
  }, []);

  // Fetch articles
  // Fetch articles
useEffect(() => {
  const fetchAll = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/news');
      const data = await res.json();
      setArticles(data);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      console.error('Failed to fetch news:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchAll();
}, []);
//   useEffect(() => {
//     const fetchAll = async () => {
//         // Return cached data if it's fresh
//         const cached = localStorage.getItem(CACHE_KEY);
//         if (cached) {
//              const { timestamp, data } = JSON.parse(cached);
//         if (Date.now() - timestamp < CACHE_TTL) {
//             setArticles(data);
//             setLoading(false);
//             return;
//         }
//     }

//     // Otherwise fetch fresh and cache it
//     try {
//       const results = await Promise.all(
//         FEEDS.map(async (feed) => {
//           const res = await fetch(feed.url);
//           const data = await res.json();
//           return (data.items ?? []).map(item => ({ ...item, source: feed.name }));
//         })
//       );
//       const sorted = results.flat().sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
//       setArticles(sorted);
//       localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: sorted }));
//       window.scrollTo({ top: 0, behavior: 'instant' });
//     } catch (err) {
//       console.error('Failed to fetch feeds:', err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   fetchAll();
//   }, []);

  // Poll for popup close
  useEffect(() => {
    const interval = setInterval(() => {
      if (popupRef.current?.closed) {
        popupRef.current = null;
        setArticleOpen(false);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Close popup on window refocus
  useEffect(() => {
    const handleFocus = () => {
      if (Date.now() - (openedAt.current ?? 0) < 1000) return;
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
        popupRef.current = null;
        setArticleOpen(false);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const openArticle = (url) => {
    const w = Math.min(1400, window.innerWidth * 0.9);
    const h = Math.min(900, window.innerHeight * 0.9);
    const left = window.screenX + (window.innerWidth - w) / 2;
    const top = window.screenY + (window.innerHeight - h) / 2 - 50;
    popupRef.current = window.open(url, 'articleWindow', `width=${w},height=${h},left=${left},top=${top}`);
    openedAt.current = Date.now();
    if (!popupRef.current) { alert('Popup blocked!'); return; }
    setArticleOpen(true);
  };

  const closeArticle = () => {
    popupRef.current?.close();
    popupRef.current = null;
    setArticleOpen(false);
  };

  return (
    <div style={{
      minHeight: '100vh', padding: '60px 40px 40px 40px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: theme.background, color: 'white', transition: 'background 0.5s ease',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', gap: '20px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '12px', color: 'white', fontSize: '20px',
            padding: '10px 20px', cursor: 'pointer', flexShrink: 0,
          }}
        >
          ← Back
        </button>

        <h1 style={{ fontSize: '48px', fontWeight: '700', margin: 0 }}>Campus News</h1>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          {Object.keys(SOURCES).map(source => (
            <button
              key={source}
              onClick={() => setActiveSource(source)}
              style={{
                padding: '10px 20px', fontSize: '18px', borderRadius: '12px',
                border: `2px solid ${SOURCES[source].accent}`, cursor: 'pointer',
                transition: 'all 0.3s', color: 'white',
                background: activeSource === source ? SOURCES[source].activeBackground : 'rgba(255,255,255,0.1)',
                fontWeight: activeSource === source ? '700' : '400',
              }}
            >
              {source}
            </button>
          ))}
        </div>
      </div>

      {/* Queen's Journal */}
      {activeSource === "Queen's Journal" && (
        loading
          ? <div style={{ textAlign: 'center', fontSize: '28px', opacity: 0.7, marginTop: '100px' }}>Loading articles...</div>
          : <>
              {featured && <FeaturedArticle article={featured} theme={theme} onOpen={openArticle} />}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {rest.map((article, i) => (
                  <ArticleCard key={i} article={article} theme={theme} onOpen={openArticle} />
                ))}
              </div>
            </>
      )}

      {/* Golden Words */}
      {activeSource === 'Golden Words' && <GoldenWords theme={theme} />}

      {/* Popup overlay */}
      {articleOpen && <ArticleOverlay onClose={closeArticle} />}
    </div>
  );
};

export default News;