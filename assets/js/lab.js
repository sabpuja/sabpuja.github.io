(function () {
  function initViewportControls() {
    var buttons = document.querySelectorAll('[data-demo-viewport]');
    var frames = document.querySelectorAll('.demo-frame');
    if (!buttons.length || !frames.length) return;

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var viewport = button.getAttribute('data-demo-viewport');
        buttons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
          item.setAttribute('aria-pressed', item === button ? 'true' : 'false');
        });
        frames.forEach(function (frame) {
          frame.setAttribute('data-viewport', viewport);
        });
      });
    });
  }

  function initReviewCarousels() {
    document.querySelectorAll('[data-review-carousel-wrap]').forEach(function (wrap) {
      var track = wrap.querySelector('[data-review-carousel]');
      var prev = wrap.querySelector('[data-review-prev]');
      var next = wrap.querySelector('[data-review-next]');
      if (!track || !prev || !next) return;

      function amount() {
        var card = track.querySelector('.review-card');
        if (!card) return 320;
        var styles = getComputedStyle(track);
        var gap = parseFloat(styles.columnGap || styles.gap || 0) || 0;
        return card.getBoundingClientRect().width + gap;
      }

      prev.addEventListener('click', function () {
        track.scrollBy({ left: -amount(), behavior: 'smooth' });
      });
      next.addEventListener('click', function () {
        var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
        if (atEnd) track.scrollTo({ left: 0, behavior: 'smooth' });
        else track.scrollBy({ left: amount(), behavior: 'smooth' });
      });
    });
  }

  function formatBytes(bytes) {
    if (typeof bytes !== 'number' || Number.isNaN(bytes)) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  function initManifest() {
    var root = document.querySelector('[data-image-manifest]');
    if (!root) return;

    fetch('/assets/images/optimized/manifest.json', { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('No manifest yet');
        return response.json();
      })
      .then(function (manifest) {
        var images = Array.isArray(manifest.images) ? manifest.images : [];
        if (!images.length) {
          root.innerHTML = '<div class="lab-note">The optimization pipeline is ready. Add source images to <strong>assets/images/source/</strong>; optimized WebP/AVIF files and size reports will appear here automatically.</div>';
          return;
        }

        root.innerHTML = '<div class="manifest-list">' + images.map(function (item) {
          var original = item.original || {};
          var outputs = Array.isArray(item.outputs) ? item.outputs : [];
          var outputRows = outputs.map(function (output) {
            var saving = original.bytes && output.bytes ? Math.max(0, (1 - output.bytes / original.bytes) * 100) : 0;
            return '<div><strong>' + output.format.toUpperCase() + ' ' + output.width + 'w</strong> · ' + formatBytes(output.bytes) + ' · ' + saving.toFixed(1) + '% smaller</div>';
          }).join('');
          return '<article class="manifest-item"><strong>' + item.source + '</strong><div>Original: ' + formatBytes(original.bytes) + ' · ' + (original.width || '—') + '×' + (original.height || '—') + '</div><div style="margin-top:8px;color:var(--sp-muted)">' + outputRows + '</div></article>';
        }).join('') + '</div>';
      })
      .catch(function () {
        root.innerHTML = '<div class="lab-note">The image pipeline is installed, but no optimization report has been generated yet. Add a source image to <strong>assets/images/source/</strong> and run the GitHub Action.</div>';
      });
  }

  initViewportControls();
  initReviewCarousels();
  initManifest();
}());
