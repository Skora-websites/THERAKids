import React, { useState } from 'react';
import { ArrowUpRight, Heart, Play, Quote } from 'lucide-react';
import { PARENT_TESTIMONIALS, PARENT_REVIEW_LINKS } from '../data/programsData';
import MediaViewer from './MediaViewer';
// Story-card styles live with the Programs stylesheet (class-scoped, not page
// scoped), so the section renders identically wherever it is mounted.
import '../pages/Programs.css';

/* Official parent testimonials (client "THERAKids — Parent & Child Progress"
   document) — moved from the THERAKids Academy page onto the Services and
   Conditions pages per the client brief. Videos play in-page through the site's
   MediaViewer; the two "Parents review" links open in a new tab.
   data-reveal / data-reveal-group are picked up by each page's
   initScrollReveals() call. */
const CaseStories = () => {
  const [viewerItem, setViewerItem] = useState(null);

  const watch = (t) =>
    setViewerItem({
      title: t.childName ? `${t.childName} — ${t.concern}` : t.concern,
      url: t.video,
      resourceType: 'video',
    });

  return (
    <section className="programs-section programs-stories">
      <div className="container">
        <div className="section-header center mb-12" data-reveal>
          <p className="label-md text-navy uppercase tracking-widest mb-2">Real Stories</p>
          <h2 className="headline-lg text-navy">Parent &amp; Child Testimonials</h2>
          <p className="body-lg text-navy-light">
            Progress reported by parents — watch each story in their own words.
          </p>
        </div>
        <div className="stories-grid" data-reveal-group>
          {PARENT_TESTIMONIALS.map((t) => (
            <article key={t.id} className="story-card card-panel">
              <div className="story-top">
                <span className="story-type is-video">
                  <Play size={11} /> Video Testimonial
                </span>
              </div>
              <h3>{t.concern}</h3>
              {(t.childName || t.parentName) && (
                <p className="story-family">{[t.childName, t.parentName].filter(Boolean).join(' · ')}</p>
              )}
              <p className="story-outcome">
                <Heart size={13} /> {t.progress}
              </p>
              <button type="button" className="prog-btn prog-btn-ghost story-watch" onClick={() => watch(t)}>
                Watch Story <Play size={13} />
              </button>
            </article>
          ))}
          {PARENT_REVIEW_LINKS.map((url) => (
            <article key={url} className="story-card card-panel">
              <div className="story-top">
                <span className="story-type is-story">
                  <Quote size={11} /> Parents Review
                </span>
              </div>
              <h3>What parents say about THERAKids</h3>
              <p className="story-family">Recorded reviews from our families</p>
              <p className="story-outcome">
                <Heart size={13} /> Straight from the parents who lived the journey
              </p>
              <a className="prog-btn prog-btn-ghost story-watch" href={url} target="_blank" rel="noopener noreferrer">
                Read the Review <ArrowUpRight size={13} />
              </a>
            </article>
          ))}
        </div>
      </div>
      <MediaViewer open={!!viewerItem} item={viewerItem} onClose={() => setViewerItem(null)} />
    </section>
  );
};

export default CaseStories;
