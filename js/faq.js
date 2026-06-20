document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const button = item.querySelector('.faq-question');

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      items.forEach(i => i.classList.remove('active'));

      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
});
``