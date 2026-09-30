import React, { useEffect } from 'react';
import { Download, ExternalLink, FileText, X } from 'lucide-react';
import './MediaViewer.css';

/* Extract the YouTube video id from any common URL shape. */
const getYouTubeId = (url) => {
  const m = String(url || '').match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/
  );
  return m ? m[1] : null;
};

const fileExt = (url = '') => (url.split('?')[0].split('.').pop() || '').toLowerCase();

/* Decide how a URL should be presented inside the viewer. */
const classifyMedia = (url, resourceType) => {
  const u = String(url || '');
  if (resourceType === 'video' && getYouTubeId(u)) return 'youtube';
  if (resourceType === 'video') return 'unsupported-video';
  if (/\.(pdf)(\?|#|$)/i.test(u)) return 'pdf';
  if (/\.(png|jpe?g|gif|webp|avif)(\?|#|$)/i.test(u)) return 'image';
  if (u.startsWith('/uploads/')) {
    const ext = fileExt(u);
    if (ext === 'pdf') return 'pdf';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif'].includes(ext)) return 'image';
    return 'download';
  }
  return 'external';
};

/* Full-screen modal that presents media IN PAGE: YouTube embeds, inline PDFs
 * and images; anything the browser can't render (docx, external sites) gets
 * an open-in-new-tab / download hand-off from the same dialog. */
const MediaViewer = ({ open, item, onClose }) => {
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open || !item) return null;

  const url = item.url || '';
  const kind = classifyMedia(url, item.resourceType);
  const ytId = getYouTubeId(url);

  let body;
  if (kind === 'youtube') {
    body = (
      <div className="mv-frame mv-frame-video">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
          title={item.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  } else if (kind === 'pdf') {
    body = (
      <div className="mv-frame mv-frame-doc">
        <iframe src={url} title={item.title} />
      </div>
    );
  } else if (kind === 'image') {
    body = (
      <div className="mv-frame mv-frame-image">
        <img src={url} alt={item.title} />
      </div>
    );
  } else {
    body = (
      <div className="mv-fallback">
        <FileText size={34} />
        <p>
          {kind === 'unsupported-video'
            ? 'This video is hosted outside YouTube and can’t be embedded here.'
            : 'This file opens outside the page — use the buttons below.'}
        </p>
        <div className="mv-fallback-actions">
          <a className="prog-btn prog-btn-solid" href={url} target="_blank" rel="noopener noreferrer">
            Open in New Tab <ExternalLink size={15} />
          </a>
          {kind === 'download' && (
            <a className="prog-btn prog-btn-outline" href={url} download>
              Download <Download size={15} />
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="mv-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mv-dialog" role="dialog" aria-modal="true" aria-label={item.title}>
        <div className="mv-header">
          <p className="mv-title">{item.title}</p>
          <button type="button" className="mv-close" onClick={onClose} aria-label="Close viewer">
            <X size={18} />
          </button>
        </div>
        {item.description && <p className="mv-desc">{item.description}</p>}
        {body}
      </div>
    </div>
  );
};

export default MediaViewer;
