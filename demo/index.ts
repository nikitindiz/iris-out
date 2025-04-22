import { Iris, IrisOptions } from '../src/index';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // Create a new instance of Iris with default options
  let iris = new Iris();
  let currentOptions: IrisOptions = {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    opacity: 0.7,
    zIndex: 9999,
    fadeDuration: 300,
  };

  // Get DOM elements
  const cards = document.querySelectorAll('.card');
  const card1Btn = document.getElementById('card1-btn');
  const card3Btn = document.getElementById('card3-btn');
  const card5Btn = document.getElementById('card5-btn');
  const clearBtn = document.getElementById('clear-btn');

  // Control elements
  const bgColorInput = document.getElementById('bg-color') as HTMLInputElement;
  const opacityInput = document.getElementById('opacity') as HTMLInputElement;
  const opacityValue = document.getElementById('opacity-value');
  const fadeDurationInput = document.getElementById('animation-duration') as HTMLInputElement;

  // Update opacity display when slider changes
  opacityInput.addEventListener('input', () => {
    if (opacityValue) {
      opacityValue.textContent = opacityInput.value;
    }
  });

  // Function to update Iris options based on form inputs
  function updateIrisOptions() {
    const color = bgColorInput.value;
    const opacity = parseFloat(opacityInput.value);
    const rgbaColor = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`;

    currentOptions = {
      backgroundColor: rgbaColor,
      opacity: opacity,
      zIndex: 9999,
      fadeDuration: parseInt(fadeDurationInput.value),
    };

    // Update options of existing Iris instance instead of creating a new one
    iris.options = currentOptions;
  }

  // Add event listeners to form controls
  bgColorInput.addEventListener('change', updateIrisOptions);
  opacityInput.addEventListener('change', updateIrisOptions);
  fadeDurationInput.addEventListener('change', updateIrisOptions);

  // Add click event to each card to highlight it
  cards.forEach(card => {
    card.addEventListener('click', () => {
      iris.highlight(card as HTMLElement);
    });
  });

  // Button event listeners
  if (card1Btn) {
    card1Btn.addEventListener('click', () => {
      const card1 = document.getElementById('card1');
      if (card1) {
        iris.highlight(card1);
      }
    });
  }

  if (card3Btn) {
    card3Btn.addEventListener('click', () => {
      const card3 = document.getElementById('card3');
      if (card3) {
        iris.highlight(card3);
      }
    });
  }

  if (card5Btn) {
    card5Btn.addEventListener('click', () => {
      const card5 = document.getElementById('card5');
      if (card5) {
        iris.highlight(card5);
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      iris.clear();
    });
  }

  // Initialize with default options
  updateIrisOptions();
});
