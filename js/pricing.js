document.addEventListener('DOMContentLoaded', function () {

  const toggles = document.querySelectorAll('.price-toggle');

  toggles.forEach(button => {
    button.addEventListener('click', function () {

      const card = this.closest('.price-card');

      // Toggle open class
      card.classList.toggle('open');

      // Update button text
      if (card.classList.contains('open')) {
        this.innerHTML = 'Hide Prices <span class="icon">+</span>';
      } else {
        this.innerHTML = 'View Prices <span class="icon">+</span>';
      }

    });
  });

});