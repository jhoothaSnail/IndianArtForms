const fs = require('fs');
let code = fs.readFileSync('js/timeline.js', 'utf8');

const oldImage =   /* Image */
  if (item.image?.src) {
    kids.push(h('img', {
      className: 'card__img',
      src: item.image.src,
      width: String(item.image.w),
      height: String(item.image.h),
      alt: item.image.alt || '',
      loading: 'lazy',
      decoding: 'async'
    }));
  };

const newImage =   /* Image */
  if (item.image?.src) {
    kids.push(h('img', {
      className: 'card__img card__open-img',
      src: item.image.src,
      width: String(item.image.w),
      height: String(item.image.h),
      alt: item.image.alt || '',
      loading: 'lazy',
      decoding: 'async',
      role: 'button',
      tabIndex: '0',
      'data-id': item.id,
      onClick: e => { openArtifact(item, e.currentTarget); setHash(item.id); },
      onKeyDown: e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openArtifact(item, e.currentTarget);
          setHash(item.id);
        }
      }
    }));
  };

const oldBody =   /* Body */
  kids.push(h('div', { className: 'card__body' },
    h('p', { className: 'card__meta', textContent: item.dateLabel }),
    h('h4', { className: 'card__title', textContent: item.title }),
    h('p', { className: 'card__meta', textContent: item.place || '' }),
    h('p', { className: 'card__summary', textContent: item.summary }),
    h('button', {
      className: 'btn card__open', type: 'button', 'data-id': item.id,
      textContent: 'Open artifact',
      onClick: e => { openArtifact(item, e.currentTarget); setHash(item.id); }
    })
  ));;

const newBody =   /* Body */
  kids.push(h('div', { className: 'card__body' },
    h('p', { className: 'card__meta', textContent: item.dateLabel }),
    h('h4', { className: 'card__title', textContent: item.title }),
    h('p', { className: 'card__meta', textContent: item.place || '' }),
    h('p', { className: 'card__summary', textContent: item.summary })
  ));;

code = code.replace(oldImage, newImage);
code = code.replace(oldBody, newBody);

fs.writeFileSync('js/timeline.js', code);
