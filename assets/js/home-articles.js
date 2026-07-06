// Populates the homepage Articles list from articles/index.json
// (regenerated automatically on push by tools/gen_articles.py).
(function () {
  const list = document.getElementById('articles-list');
  if (!list) return;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  fetch('articles/index.json')
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (posts) {
      if (!posts.length) {
        list.innerHTML = '<li class="articles__empty">No articles yet.</li>';
        return;
      }
      list.innerHTML = posts.map(function (p) {
        return '<li>' +
          '<span class="article__date">' + esc(p.display || p.date) + '</span>' +
          '<a class="article__title" href="article.html?p=' + esc(p.slug) + '">' + esc(p.title) + '</a>' +
          (p.excerpt ? '<p class="article__excerpt">' + esc(p.excerpt) + '</p>' : '') +
          '</li>';
      }).join('');
    })
    .catch(function () {
      list.innerHTML = '<li class="articles__empty">Could not load articles.</li>';
    });
})();
