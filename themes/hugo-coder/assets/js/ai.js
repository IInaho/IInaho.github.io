// AI Tools Page JavaScript

// Add any interactive functionality here
console.log('AI Tools page loaded');

// Example: Add a click event to tool cards
document.addEventListener('DOMContentLoaded', function() {
  const toolCards = document.querySelectorAll('.tool-card');
  
  toolCards.forEach(card => {
    card.addEventListener('click', function() {
      // Add your custom logic here
      console.log('Tool card clicked:', this.querySelector('.tool-name').textContent);
    });
  });
});