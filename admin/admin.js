/**
 * Parama.lk — Gallery admin panel (talks to worker/index.js /api/admin/*)
 */
(function () {
  'use strict';

  var TOKEN_KEY = 'paramaAdminToken';
  var token = '';
  var items = [];
  var pendingFiles = [];

  function $(sel) {
    return document.querySelector(sel);
  }

  function readToken() {
    try {
      return sessionStorage.getItem(TOKEN_KEY) || '';
    } catch (e) {
      return '';
    }
  }
  function saveToken(value) {
    try {
      if (value) sessionStorage.setItem(TOKEN_KEY, value);
      else sessionStorage.removeItem(TOKEN_KEY);
    } catch (e) {}
  }

  function api(path, options) {
    options = options || {};
    options.headers = Object.assign({ Authorization: 'Basic ' + token }, options.headers || {});
    return fetch(path, options).then(function (res) {
      return res
        .json()
        .catch(function () {
          return {};
        })
        .then(function (data) {
          if (res.status === 401) {
            var wasSignedIn = !$('#appView').hidden;
            signOut();
            throw new Error(wasSignedIn ? 'Session expired — please sign in again' : 'Wrong username or password');
          }
          if (!res.ok) throw new Error(data.error || 'Request failed (' + res.status + ')');
          return data;
        });
    });
  }

  var toastTimer;
  function toast(message, isError) {
    var el = $('#toast');
    el.textContent = message;
    el.classList.toggle('adm-toast--error', Boolean(isError));
    el.classList.add('adm-toast--show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove('adm-toast--show');
    }, 3500);
  }

  /* ---------- Auth ---------- */
  function encodeCredentials(username, password) {
    return btoa(unescape(encodeURIComponent(username + ':' + password)));
  }

  function signIn(credentials) {
    token = credentials;
    return api('/api/admin/login', { method: 'POST' }).then(function (data) {
      saveToken(token);
      $('#loginView').hidden = true;
      $('#appView').hidden = false;
      // First run: copy the static gallery-data.js list into R2 so it can be managed here
      if (!data.initialised) return importStaticItems();
      return loadItems();
    });
  }

  function signOut() {
    token = '';
    saveToken('');
    $('#appView').hidden = true;
    $('#loginView').hidden = false;
    $('#password').value = '';
  }

  function importStaticItems() {
    var seed = typeof galleryItems !== 'undefined' && Array.isArray(galleryItems) ? galleryItems : [];
    return api('/api/admin/gallery', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: seed }),
    }).then(function (data) {
      items = data.items;
      render();
      toast('Imported ' + items.length + ' existing images');
    });
  }

  function loadItems() {
    return fetch('/api/gallery', { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('Could not load gallery');
        return res.json();
      })
      .then(function (data) {
        items = data.items || [];
        render();
      });
  }

  /* ---------- Grid ---------- */
  function render() {
    var grid = $('#grid');
    var filter = $('#filterCategory').value;
    var visible = items.filter(function (it) {
      return !filter || it.category === filter;
    });
    grid.innerHTML = '';
    $('#countBadge').textContent = items.length;
    $('#emptyState').hidden = visible.length > 0;

    visible.forEach(function (it) {
      var card = document.createElement('article');
      card.className = 'adm-item';

      var img = document.createElement('img');
      img.src = it.image;
      img.alt = it.alt || it.title;
      img.loading = 'lazy';

      var body = document.createElement('div');
      body.className = 'adm-item-body';
      var title = document.createElement('strong');
      title.textContent = it.title;
      var meta = document.createElement('span');
      meta.textContent = it.category + (it.featured ? ' · Featured' : '');
      body.appendChild(title);
      body.appendChild(meta);

      var del = document.createElement('button');
      del.type = 'button';
      del.className = 'adm-item-delete';
      del.setAttribute('aria-label', 'Delete ' + it.title);
      del.innerHTML = '<i class="fas fa-trash-alt"></i>';
      del.addEventListener('click', function () {
        confirmDelete(card, del, it);
      });

      card.appendChild(img);
      card.appendChild(body);
      card.appendChild(del);
      grid.appendChild(card);
    });
  }

  // Two-step delete inside the card (avoids native confirm dialogs)
  function confirmDelete(card, btn, it) {
    if (!card.classList.contains('adm-item--confirm')) {
      card.classList.add('adm-item--confirm');
      btn.innerHTML = '<i class="fas fa-check"></i> Delete?';
      setTimeout(function () {
        if (!card.isConnected) return;
        card.classList.remove('adm-item--confirm');
        btn.innerHTML = '<i class="fas fa-trash-alt"></i>';
      }, 3000);
      return;
    }
    btn.disabled = true;
    api('/api/admin/images/' + it.id, { method: 'DELETE' })
      .then(function (data) {
        items = data.items;
        render();
        toast('Deleted "' + it.title + '"');
      })
      .catch(function (err) {
        btn.disabled = false;
        toast(err.message, true);
      });
  }

  /* ---------- Upload ---------- */
  function setFiles(fileList) {
    pendingFiles = Array.prototype.filter.call(fileList, function (f) {
      return /^image\//.test(f.type);
    });
    var list = $('#fileList');
    list.innerHTML = '';
    pendingFiles.forEach(function (f) {
      var li = document.createElement('li');
      li.textContent = f.name + ' (' + (f.size / 1024 / 1024).toFixed(1) + ' MB)';
      if (f.size > 10 * 1024 * 1024) li.className = 'adm-file--bad';
      list.appendChild(li);
    });
    $('#uploadBtn').disabled = pendingFiles.length === 0;
  }

  function uploadAll(e) {
    e.preventDefault();
    if (!pendingFiles.length) return;
    var btn = $('#uploadBtn');
    var baseTitle = $('#title').value.trim();
    var total = pendingFiles.length;
    var done = 0;
    var failed = 0;
    btn.disabled = true;

    // Sequential so each upload sees the previous one's id
    var chain = Promise.resolve();
    pendingFiles.forEach(function (file, i) {
      chain = chain.then(function () {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading ' + (i + 1) + ' / ' + total;
        var form = new FormData();
        form.append('file', file);
        var title = baseTitle || file.name.replace(/\.[^.]+$/, '');
        form.append('title', total > 1 && baseTitle ? title + ' ' + (i + 1) : title);
        form.append('category', $('#category').value);
        form.append('description', $('#description').value);
        form.append('featured', $('#featured').checked ? 'true' : 'false');
        return api('/api/admin/upload', { method: 'POST', body: form })
          .then(function (data) {
            items = data.items;
            done++;
            render();
          })
          .catch(function (err) {
            failed++;
            toast(file.name + ': ' + err.message, true);
          });
      });
    });

    chain.then(function () {
      btn.innerHTML = '<i class="fas fa-upload"></i> Upload';
      $('#uploadForm').reset();
      $('#fileInput').value = '';
      setFiles([]);
      if (done) toast('Uploaded ' + done + ' image' + (done > 1 ? 's' : '') + (failed ? ', ' + failed + ' failed' : ''), failed > 0);
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    $('#loginForm').addEventListener('submit', function (e) {
      e.preventDefault();
      $('#loginError').textContent = '';
      signIn(encodeCredentials($('#username').value.trim(), $('#password').value)).catch(function (err) {
        signOut();
        $('#loginError').textContent = err.message;
      });
    });
    $('#logoutBtn').addEventListener('click', signOut);
    $('#filterCategory').addEventListener('change', render);
    $('#fileInput').addEventListener('change', function (e) {
      setFiles(e.target.files);
    });
    $('#uploadForm').addEventListener('submit', uploadAll);

    var drop = $('#dropZone');
    ['dragenter', 'dragover'].forEach(function (ev) {
      drop.addEventListener(ev, function (e) {
        e.preventDefault();
        drop.classList.add('adm-drop--over');
      });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
      drop.addEventListener(ev, function (e) {
        e.preventDefault();
        drop.classList.remove('adm-drop--over');
      });
    });
    drop.addEventListener('drop', function (e) {
      setFiles(e.dataTransfer.files);
    });

    var saved = readToken();
    if (saved) {
      signIn(saved).catch(function () {
        signOut();
      });
    }
  });
})();
