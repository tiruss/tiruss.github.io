// Renders an article from articles/<slug>.json (built by tools/gen_articles.py).
// JSON is served verbatim by GitHub Pages even with Jekyll on, unlike raw .md.
// Usage: article.html?p=<slug>
(function () {
  const titleEl = document.getElementById('article-title');
  const dateEl = document.getElementById('article-date');
  const bodyEl = document.getElementById('article-body');

  function fail(msg) {
    titleEl.textContent = 'Not found';
    bodyEl.innerHTML = '<p>' + msg + ' <a href="index.html">Back home</a>.</p>';
  }

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('p');
  if (!slug || !/^[a-z0-9\-]+$/i.test(slug)) {
    fail('No article specified.');
    return;
  }

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function formatDate(d) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || '');
    return m ? MONTHS[+m[2] - 1] + ' ' + m[1] : (d || '');
  }

  // Protect LaTeX math from the Markdown parser (so a_i, *, etc. survive),
  // then restore it with \( \) / \[ \] delimiters for MathJax.
  function shieldMath(src) {
    const store = [];
    function hold(rendered) { store.push(rendered); return '@@MATH' + (store.length - 1) + '@@'; }
    // $$...$$ (display) first, then \[..\], then $...$ (inline), then \(..\).
    const out = src
      .replace(/\$\$([\s\S]+?)\$\$/g, function (_, m) { return hold('\\[' + m + '\\]'); })
      .replace(/\\\[([\s\S]+?)\\\]/g, function (_, m) { return hold('\\[' + m + '\\]'); })
      .replace(/\$([^\$\n]+?)\$/g, function (_, m) { return hold('\\(' + m + '\\)'); })
      .replace(/\\\(([\s\S]+?)\\\)/g, function (_, m) { return hold('\\(' + m + '\\)'); });
    return { text: out, store: store };
  }
  function restoreMath(html, store) {
    return html.replace(/@@MATH(\d+)@@/g, function (_, n) { return store[+n] || ''; });
  }

  fetch('articles/' + slug + '.json')
    .then(function (r) {
      if (!r.ok) throw new Error();
      return r.json();
    })
    .then(function (post) {
      const title = post.title || slug;
      document.title = title + ' — DongGoo Kang';
      titleEl.textContent = title;
      dateEl.textContent = post.display || formatDate(post.date);
      const shielded = shieldMath(post.body || '');
      bodyEl.innerHTML = restoreMath(marked.parse(shielded.text), shielded.store);
      if (window.MathJax && MathJax.startup && MathJax.startup.promise) {
        MathJax.startup.promise.then(function () { MathJax.typesetPromise([bodyEl]); });
      }
    })
    .catch(function () {
      fail('Could not load this article.');
    });
})();
