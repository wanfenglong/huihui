(function () {
  const resolvePath = (path) => {
    const base = document.body.dataset.base || '.';
    if (base === '.' || base === './') {
      return path;
    }
    return `${base.replace(/\/$/, '')}/${path}`;
  };

  const initNavigation = () => {
    const toggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('open');
    });

    document.addEventListener('click', (event) => {
      if (!navLinks.contains(event.target) && !toggle.contains(event.target)) {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    const currentPage = document.body.dataset.page;
    if (currentPage) {
      navLinks.querySelectorAll('a[data-page]').forEach((link) => {
        if (link.dataset.page === currentPage) {
          link.classList.add('active');
        }
      });
    }
  };

  const loadJSON = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`加载失败：${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('数据加载失败', error);
      return [];
    }
  };

  const renderRecentPosts = async () => {
    const container = document.querySelector('#recent-posts');
    if (!container) return;

    const posts = await loadJSON(resolvePath('data/posts.json'));
    const latest = posts.slice(0, 3);
    container.innerHTML = latest
      .map(
        (post) => `
        <article class="post-card">
          <img src="${post.cover}" alt="${post.title}" loading="lazy" width="320" height="240">
          <div>
            <div class="meta">${post.date} · ${post.tags.join(' / ')}</div>
            <h3><a href="${post.url}">${post.title}</a></h3>
          </div>
        </article>
      `
      )
      .join('');
  };

  const createTagOptions = (data) => {
    const tags = new Set();
    data.forEach((item) => {
      (item.tags || []).forEach((tag) => tags.add(tag));
    });
    return ['全部', ...Array.from(tags)];
  };

  const renderFiles = async (selector) => {
    const container = document.querySelector(selector);
    if (!container) return;

    const data = await loadJSON(resolvePath('data/files.json'));
    const select = container.querySelector('select');
    const search = container.querySelector('input[type="search"]');
    const list = container.querySelector('.list-body');

    if (!select || !search || !list) return;

    const tags = createTagOptions(data);
    select.innerHTML = tags
      .map((tag) => `<option value="${tag}">${tag}</option>`)
      .join('');

    const filterAndRender = () => {
      const keyword = search.value.trim().toLowerCase();
      const tag = select.value;
      const filtered = data.filter((item) => {
        const matchesTag = tag === '全部' || (item.tags || []).includes(tag);
        const matchesKeyword = !keyword ||
          item.name.toLowerCase().includes(keyword) ||
          (item.desc || '').toLowerCase().includes(keyword);
        return matchesTag && matchesKeyword;
      });

      list.innerHTML = filtered
        .map(
          (item) => `
          <tr>
            <td>
              <strong>${item.name}</strong>
              <div class="meta">${item.desc || ''}</div>
              <div class="tags-row">${(item.tags || [])
                .map((tag) => `<span class="tag">${tag}</span>`)
                .join('')}</div>
            </td>
            <td>${item.size || ''}</td>
            <td>${item.updated || ''}</td>
            <td><a class="button" href="${item.path}" download>下载</a></td>
          </tr>
        `
        )
        .join('');
    };

    filterAndRender();
    select.addEventListener('change', filterAndRender);
    search.addEventListener('input', filterAndRender);
  };

  const renderWorks = async () => {
    const container = document.querySelector('#works-grid');
    if (!container) return;

    const data = await loadJSON(resolvePath('data/works.json'));
    const select = document.querySelector('#works-filter');

    const tags = createTagOptions(data);
    select.innerHTML = tags.map((tag) => `<option value="${tag}">${tag}</option>`).join('');

    const render = () => {
      const tag = select.value;
      container.innerHTML = data
        .filter((item) => tag === '全部' || (item.tags || []).includes(tag))
        .map(
          (item) => `
          <article class="work-card">
            <img src="${item.cover}" alt="${item.title}" loading="lazy" width="320" height="240">
            <div class="meta">${(item.tags || []).join(' / ')}</div>
            <h3>${item.title}</h3>
            <p>${item.prompt || item.desc || ''}</p>
            <a class="button" href="${item.link}" target="_blank" rel="noopener">查看作品</a>
          </article>
        `
        )
        .join('');
    };

    render();
    select.addEventListener('change', render);
  };

  const renderPostsList = async () => {
    const container = document.querySelector('#posts-list');
    if (!container) return;

    const data = await loadJSON(resolvePath('data/posts.json'));
    container.innerHTML = data
      .map(
        (post) => `
        <article class="post-card">
          <img src="${post.cover}" alt="${post.title}" loading="lazy" width="320" height="240">
          <div class="meta">${post.date} · ${post.tags.join(' / ')}</div>
          <h3><a href="${post.url}">${post.title}</a></h3>
        </article>
      `
      )
      .join('');
  };

  const renderGallery = async () => {
    const grid = document.querySelector('#gallery-grid');
    if (!grid) return;

    const data = await loadJSON(resolvePath('data/gallery.json'));
    grid.innerHTML = data
      .map(
        (item, index) => `
        <figure class="gallery-card" data-index="${index}">
          <img src="${item.src}" alt="${item.title}" loading="lazy" width="${item.w}" height="${item.h}">
          <figcaption>${item.title}</figcaption>
        </figure>
      `
      )
      .join('');

    initLightbox(data);
  };

  const initLightbox = (items) => {
    const lightbox = document.querySelector('#lightbox');
    if (!lightbox) return;
    const image = lightbox.querySelector('img');
    const caption = lightbox.querySelector('p');
    const closeBtn = lightbox.querySelector('button');

    const open = (item) => {
      image.src = item.src;
      image.alt = item.title;
      caption.textContent = item.title || '';
      lightbox.classList.add('open');
      closeBtn.focus();
    };

    const close = () => {
      lightbox.classList.remove('open');
    };

    document.querySelectorAll('.gallery-card').forEach((card) => {
      card.addEventListener('click', () => {
        open(items[Number(card.dataset.index)]);
      });
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open(items[Number(card.dataset.index)]);
        }
      });
      card.setAttribute('tabindex', '0');
    });

    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });
  };

  const initTOC = () => {
    const toc = document.querySelector('#toc');
    const article = document.querySelector('article');
    if (!toc || !article) return;

    const headings = article.querySelectorAll('h2, h3');
    if (!headings.length) {
      toc.style.display = 'none';
      return;
    }

    const list = document.createElement('ul');
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `section-${index + 1}`;
      }
      const item = document.createElement('li');
      item.innerHTML = `<a href="#${heading.id}">${heading.textContent}</a>`;
      list.appendChild(item);
    });
    toc.appendChild(list);
  };

  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderRecentPosts();
    renderFiles('#teaching-files');
    renderFiles('#downloads-files');
    renderWorks();
    renderPostsList();
    renderGallery();
    initTOC();
  });
})();
