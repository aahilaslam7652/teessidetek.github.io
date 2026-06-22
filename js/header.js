
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');

  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
  });
