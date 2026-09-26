import React, { useEffect, useRef } from 'react';
import API_URL from '../config';
import './RichTextEditor.css';

/* ------------------------------------------------------------------ *
 * Paste pipeline: read the clipboard's text/html flavour, strip Office
 * junk + dangerous markup, re-host remote images through the project's
 * existing upload endpoint, then insert the cleaned HTML.
 * ------------------------------------------------------------------ */

// Client-side pre-clean of pasted HTML. The server-side allowlist
// (sanitize-html in server.js) is the security boundary — this pass only
// removes obvious junk up-front so the editor DOM stays tidy.
// Same property allowlist the server sanitiser enforces — everything else
// (Office junk like mso-fareast-font-family, stray font-family declarations)
// is dropped up-front so editor DOM and saved HTML stay identical.
const ALLOWED_STYLE_PROPS = new Set([
  'text-align', 'color', 'background-color', 'font-weight', 'font-style',
  'text-decoration', 'font-size', 'margin-left', 'border', 'border-collapse', 'padding'
]);

const stripPasteJunk = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  // Comments (includes Word conditional comments <!--[if gte mso 9]>…)
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_COMMENT);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((node) => node.remove());

  [...doc.body.querySelectorAll('*')].forEach((el) => {
    const tag = el.tagName.toLowerCase();
    // Namespaced/office tags (<o:p>, <w:…>, <?xml…>) + executable/irrelevant nodes
    if (tag.includes(':') || ['script', 'style', 'meta', 'link', 'iframe', 'object', 'embed'].includes(tag)) {
      el.remove();
      return;
    }
    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      // classes carry mso-* junk; on* are inline event handlers
      if (name === 'class' || name.startsWith('on')) { el.removeAttribute(attr.name); return; }
      // executable URLs must never reach the editor (server strips them too)
      if ((name === 'href' || name === 'src') && /^\s*(javascript|vbscript):/i.test(attr.value)) {
        el.removeAttribute(attr.name);
        return;
      }
      // keep only allowlisted style properties (drops mso-* and friends)
      if (name === 'style') {
        const kept = attr.value
          .split(';')
          .map((d) => d.trim())
          .filter((d) => ALLOWED_STYLE_PROPS.has((d.split(':')[0] || '').trim().toLowerCase()));
        if (kept.length) el.setAttribute('style', kept.join('; '));
        else el.removeAttribute('style');
      }
    });
  });

  return doc.body.innerHTML;
};

const EXT_BY_TYPE = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg'
};

// Fetch every remote <img> and upload it via the existing admin upload
// endpoint, rewriting src to the returned /uploads/… path. A failed fetch
// keeps the original remote URL (spec: fall back, never drop the image).
const rehostImages = async (html, token) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const images = [...doc.body.querySelectorAll('img[src]')];

  await Promise.all(images.map(async (img) => {
    const src = img.getAttribute('src') || '';
    if (!/^https?:\/\//i.test(src)) return; // already local (/uploads/…)
    try {
      const res = await fetch(src);
      if (!res.ok) return;
      const blob = await res.blob();
      if (!blob.type.startsWith('image/')) return;
      const ext = EXT_BY_TYPE[blob.type] || 'png';
      const fd = new FormData();
      fd.append('image', blob, `pasted-image.${ext}`);
      const up = await fetch(`${API_URL}/api/admin/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd
      });
      if (!up.ok) return;
      const data = await up.json();
      if (data.url) img.setAttribute('src', data.url);
    } catch {
      // CORS/offline — keep the original remote src
    }
  }));

  return doc.body.innerHTML;
};

/* ------------------------------------------------------------------ */

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const initialised = useRef(false);
  const savedRange = useRef(null);

  // Seed the editor once per mount (the CRUD modal remounts per record)
  useEffect(() => {
    if (editorRef.current && !initialised.current) {
      editorRef.current.innerHTML = value || '';
      initialised.current = true;
    }
  }, [value]);

  const emit = () => {
    if (onChange) onChange(editorRef.current ? editorRef.current.innerHTML : '');
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount && editorRef.current && editorRef.current.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  // Restore the caret saved before the toolbar stole focus, then run the command
  const exec = (cmd, arg = null) => {
    const sel = window.getSelection();
    if (savedRange.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    } else if (editorRef.current) {
      editorRef.current.focus();
    }
    try {
      document.execCommand('styleWithCSS', false, true); // colours → <span style>, not <font>
    } catch { /* not supported */ }
    document.execCommand(cmd, false, arg);
    saveSelection();
    emit();
  };

  const handlePaste = async (e) => {
    const html = e.clipboardData ? e.clipboardData.getData('text/html') : '';
    if (!html) return; // plain-text clipboard → browser default paste (spec #5)

    e.preventDefault();

    // Remember the caret across the async image uploads
    const sel = window.getSelection();
    const range = sel && sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null;

    let cleaned = stripPasteJunk(html);
    const token = localStorage.getItem('admin_token');
    cleaned = await rehostImages(cleaned, token); // resolves after ALL uploads

    // Insert through a detached, classless host first: running insertHTML directly
    // inside the editor makes Blink's editing StyleAdjuster reconcile the fragment
    // against .rte-content's CSS (the td { border } rule), which rewrites pasted
    // table styles — e.g. "border:1px solid #333" collapses to "border-color" only,
    // losing width/style. A plain host keeps the literal markup; moving the nodes
    // to the caret afterwards never re-parses or re-adjusts attributes.
    const host = document.createElement('div');
    host.contentEditable = 'true';
    host.style.position = 'fixed';
    host.style.left = '-9999px';
    document.body.appendChild(host);
    host.focus();
    document.execCommand('insertHTML', false, cleaned);
    const pastedNodes = Array.from(host.childNodes);
    host.remove();

    if (range && sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (editorRef.current) {
      editorRef.current.focus();
    }

    const activeSel = window.getSelection();
    const insertRange = activeSel && activeSel.rangeCount ? activeSel.getRangeAt(0) : null;
    if (insertRange && editorRef.current && editorRef.current.contains(insertRange.commonAncestorContainer)) {
      insertRange.deleteContents();
      insertRange.insertNode(pastedNodes.length === 1 ? pastedNodes[0] : (() => {
        const frag = document.createDocumentFragment();
        pastedNodes.forEach((n) => frag.appendChild(n));
        return frag;
      })());
      // Caret after the pasted content so continued typing flows naturally
      const last = pastedNodes[pastedNodes.length - 1];
      if (last && last.parentNode) {
        const after = document.createRange();
        after.setEndAfter(last);
        after.collapse(false);
        activeSel.removeAllRanges();
        activeSel.addRange(after);
      }
    } else if (editorRef.current) {
      pastedNodes.forEach((n) => editorRef.current.appendChild(n));
    }
    saveSelection();
    emit();
  };

  const addLink = () => {
    const url = window.prompt('Link URL (https://…)');
    if (url) exec('createLink', url);
  };

  // preventDefault on mousedown keeps focus in the editor so the selection survives
  const keepFocus = (e) => e.preventDefault();

  return (
    <div className="rte">
      <div className="rte-toolbar" role="toolbar" aria-label="Text formatting">
        <button type="button" className="rte-btn" title="Bold" onMouseDown={keepFocus} onClick={() => exec('bold')}><b>B</b></button>
        <button type="button" className="rte-btn" title="Italic" onMouseDown={keepFocus} onClick={() => exec('italic')}><i>I</i></button>
        <button type="button" className="rte-btn" title="Underline" onMouseDown={keepFocus} onClick={() => exec('underline')}><u>U</u></button>
        <span className="rte-sep" />
        <select
          className="rte-select"
          defaultValue=""
          title="Paragraph style"
          onChange={(e) => { if (e.target.value) { exec('formatBlock', e.target.value); e.target.value = ''; } }}
        >
          <option value="" disabled>Style</option>
          <option value="<p>">Paragraph</option>
          <option value="<h2>">Heading 2</option>
          <option value="<h3>">Heading 3</option>
        </select>
        <span className="rte-sep" />
        <button type="button" className="rte-btn" title="Bulleted list" onMouseDown={keepFocus} onClick={() => exec('insertUnorderedList')}>• List</button>
        <button type="button" className="rte-btn" title="Numbered list" onMouseDown={keepFocus} onClick={() => exec('insertOrderedList')}>1. List</button>
        <button type="button" className="rte-btn" title="Link" onMouseDown={keepFocus} onClick={addLink}>🔗</button>
        <span className="rte-sep" />
        <button type="button" className="rte-btn" title="Align left" onMouseDown={keepFocus} onClick={() => exec('justifyLeft')}>⇤</button>
        <button type="button" className="rte-btn" title="Align center" onMouseDown={keepFocus} onClick={() => exec('justifyCenter')}>≡</button>
        <button type="button" className="rte-btn" title="Align right" onMouseDown={keepFocus} onClick={() => exec('justifyRight')}>⇥</button>
        <span className="rte-sep" />
        <label className="rte-color" title="Text colour">
          <span aria-hidden="true">A</span>
          <input type="color" defaultValue="#ff0000" onChange={(e) => exec('foreColor', e.target.value)} />
        </label>
        <select
          className="rte-select"
          defaultValue=""
          title="Font size"
          onChange={(e) => { if (e.target.value) { exec('fontSize', e.target.value); e.target.value = ''; } }}
        >
          <option value="" disabled>Size</option>
          <option value="1">Small</option>
          <option value="2">Normal</option>
          <option value="3">Large</option>
          <option value="4">Extra large</option>
        </select>
      </div>
      <div
        ref={editorRef}
        className="rte-content"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Blog content"
        data-testid="blog-content-editor"
        onInput={emit}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        onFocus={saveSelection}
        onPaste={handlePaste}
      />
    </div>
  );
};

export default RichTextEditor;
