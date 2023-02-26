// Select the stars container
const container = document.getElementById('stars-container');

// Define a function to create a new star
function createStar() {
  const star = document.createElement('div');
  star.classList.add('star');
  star.style.left = Math.random() * 98 + '%';
  star.style.top = Math.random() * 98 + '%';
  container.appendChild(star);
  
  // Set the opacity to 1 after a short delay
  setTimeout(() => {
    star.style.opacity = 1;
  }, 100);
  
  setTimeout(() => {
    star.style.opacity = 0;
  }, 2500);
  
  setTimeout(() => {
    container.removeChild(star);
  }, 3000);
}

// Call the createStar function every 100ms to create new stars
setInterval(createStar, 100);