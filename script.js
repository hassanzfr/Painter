const container = document.querySelector('.container');
const resetButton = document.getElementById('resetButton');
const eraserButton = document.getElementById('eraserButton');
const colorPicker = document.getElementById('colorPicker');
const gridSizeButton = document.getElementById('gridSizeButton');
const saveButton = document.getElementById('saveButton');
const background = document.querySelector('.background');

let gridSize = 16;
let currentColor = '#000000';
let eraserActive = false;
let lastColor = currentColor;

// Create grid
function createGrid(size) {
  container.innerHTML = '';
  container.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  for (let i = 0; i < size * size; i++) {
    const box = document.createElement('div');
    box.classList.add('box');
    container.appendChild(box);
  }
  addMouseListeners();
}

// Add drawing functionality
function addMouseListeners() {
  let isDrawing = false;

  document.querySelectorAll('.box').forEach(box => {
    box.addEventListener('mousedown', () => {
      isDrawing = true;
      box.style.backgroundColor = eraserActive ? 'white' : currentColor;
      box.classList.add('colored');
    });

    box.addEventListener('mousemove', () => {
      if (isDrawing) {
        box.style.backgroundColor = eraserActive ? 'white' : currentColor;
        box.classList.add('colored');
      }
    });

    box.addEventListener('mouseup', () => (isDrawing = false));
  });

  document.addEventListener('mouseup', () => (isDrawing = false));
}

// Reset grid
resetButton.addEventListener('click', () => {
  document.querySelectorAll('.box').forEach(box => {
    box.style.backgroundColor = 'white';
    box.classList.remove('colored');
  });
});

// Toggle eraser
eraserButton.addEventListener('click', () => {
  eraserActive = !eraserActive;
  eraserButton.classList.toggle('active');
  if (!eraserActive) currentColor = lastColor;
});

// Update color picker
colorPicker.addEventListener('input', (e) => {
  currentColor = e.target.value;
  lastColor = currentColor;
  eraserActive = false;
  eraserButton.classList.remove('active');
});

// Toggle grid size
gridSizeButton.addEventListener('click', () => {
  gridSize = gridSize === 16 ? 32 : 16;
  gridSizeButton.textContent = `${gridSize}px`;
  gridSizeButton.classList.toggle('dark', gridSize === 32);
  createGrid(gridSize);
});

// Preset colors
document.querySelectorAll('.preset').forEach(preset => {
  preset.addEventListener('click', (e) => {
    currentColor = getComputedStyle(e.target).backgroundColor;
    lastColor = currentColor;
    colorPicker.value = rgbToHex(currentColor);
    eraserActive = false;
    eraserButton.classList.remove('active');
  });
});

// Save artwork
saveButton.addEventListener('click', () => {
  html2canvas(container).then(canvas => {
    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});

// Convert RGB to Hex
function rgbToHex(rgb) {
  const values = rgb.match(/\d+/g);
  return `#${values.map(v => parseInt(v).toString(16).padStart(2, '0')).join('')}`;
}

// Animated background
function createBackground() {
  const pixelSize = 20;
  const columns = Math.ceil(window.innerWidth / pixelSize);
  const rows = Math.ceil(window.innerHeight / pixelSize);

  for (let i = 0; i < columns * rows; i++) {
    const pixel = document.createElement('div');
    pixel.style.width = `${pixelSize}px`;
    pixel.style.height = `${pixelSize}px`;
    pixel.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    pixel.style.position = 'absolute';
    pixel.style.left = `${(i % columns) * pixelSize}px`;
    pixel.style.top = `${Math.floor(i / columns) * pixelSize}px`;
    pixel.style.animation = `move ${Math.random() * 10 + 5}s linear infinite`;
    background.appendChild(pixel);
  }
}

// Background animation
//createBackground();

// Initialize grid
createGrid(gridSize);