import { IrisOut, IrisOutOptions } from '../src/index';
// For production demo, we would use:
// import IrisOut, { IrisOutOptions } from '@nikitindiz/iris-out';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // Create a new instance of IrisOut with default options
  let iris = new IrisOut();
  let currentOptions: IrisOutOptions = {
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
  const callbackInfo = document.getElementById('callback-info');

  // Control elements
  const bgColorInput = document.getElementById('bg-color') as HTMLInputElement;
  const opacityInput = document.getElementById('opacity') as HTMLInputElement;
  const opacityValue = document.getElementById('opacity-value');
  const fadeDurationInput = document.getElementById('animation-duration') as HTMLInputElement;

  // Function to log callback events
  function logCallbackEvent(message: string) {
    if (!callbackInfo) return;
    
    const logItem = document.createElement('div');
    logItem.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
    callbackInfo.prepend(logItem);
    
    // Limit number of log items to prevent too many entries
    if (callbackInfo.children.length > 20) {
      callbackInfo.removeChild(callbackInfo.lastChild as Node);
    }
  }

  // Update opacity display when slider changes
  opacityInput.addEventListener('input', () => {
    if (opacityValue) {
      opacityValue.textContent = opacityInput.value;
    }
  });

  // Function to update IrisOut options based on form inputs
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

    // Update options of existing IrisOut instance instead of creating a new one
    iris.options = currentOptions;
    
    logCallbackEvent(`Options updated: ${rgbaColor}, opacity: ${opacity}, duration: ${fadeDurationInput.value}ms`);
  }

  // Add event listeners to form controls
  bgColorInput.addEventListener('change', updateIrisOptions);
  opacityInput.addEventListener('change', updateIrisOptions);
  fadeDurationInput.addEventListener('change', updateIrisOptions);

  // Add click event to each card to highlight it
  cards.forEach(card => {
    card.addEventListener('click', () => {
      logCallbackEvent(`Highlighting element: ${card.id}`);
      
      iris.highlight(
        card as HTMLElement, 
        (rect) => {
          logCallbackEvent(
            `Update callback: Element at x:${Math.round(rect.left)}, y:${Math.round(rect.top)}, w:${Math.round(rect.width)}, h:${Math.round(rect.height)}`
          );
        }, 
        () => {
          logCallbackEvent('Clear callback: Highlight was removed');
        }
      );
    });
  });

  // Button event listeners
  if (card1Btn) {
    card1Btn.addEventListener('click', () => {
      const card1 = document.getElementById('card1');
      if (card1) {
        logCallbackEvent(`Highlighting Card 1 via button`);
        iris.highlight(
          card1,
          (rect) => {
            logCallbackEvent(`Update callback for Card 1: x:${Math.round(rect.left)}, y:${Math.round(rect.top)}`);
          },
          () => {
            logCallbackEvent('Card 1 highlight cleared');
          }
        );
      }
    });
  }

  if (card3Btn) {
    card3Btn.addEventListener('click', () => {
      const card3 = document.getElementById('card3');
      if (card3) {
        logCallbackEvent(`Highlighting Card 3 via button`);
        iris.highlight(
          card3,
          (rect) => {
            logCallbackEvent(`Update callback for Card 3: x:${Math.round(rect.left)}, y:${Math.round(rect.top)}`);
          },
          () => {
            logCallbackEvent('Card 3 highlight cleared');
          }
        );
      }
    });
  }

  if (card5Btn) {
    card5Btn.addEventListener('click', () => {
      const card5 = document.getElementById('card5');
      if (card5) {
        logCallbackEvent(`Highlighting Card 5 via button`);
        iris.highlight(
          card5,
          (rect) => {
            logCallbackEvent(`Update callback for Card 5: x:${Math.round(rect.left)}, y:${Math.round(rect.top)}`);
          },
          () => {
            logCallbackEvent('Card 5 highlight cleared');
          }
        );
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      logCallbackEvent('Manually clearing highlight');
      iris.clear();
    });
  }

  // Initialize with default options
  updateIrisOptions();
  logCallbackEvent('Demo initialized');

  // Add window message for GitHub Pages demo
  if (window.location.hostname.includes('github.io')) {
    const demoMessage = document.createElement('div');
    demoMessage.style.position = 'fixed';
    demoMessage.style.bottom = '20px';
    demoMessage.style.left = '20px';
    demoMessage.style.padding = '15px';
    demoMessage.style.background = '#4a6ef5';
    demoMessage.style.color = 'white';
    demoMessage.style.borderRadius = '4px';
    demoMessage.style.zIndex = '1000';
    demoMessage.style.maxWidth = '250px';
    demoMessage.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    demoMessage.innerHTML = 'This is a demo of <strong>iris-out</strong>. Try clicking the cards to see the highlight effect!';
    
    document.body.appendChild(demoMessage);
    
    // Hide after 8 seconds
    setTimeout(() => {
      demoMessage.style.opacity = '0';
      demoMessage.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        demoMessage.remove();
      }, 500);
    }, 8000);
  }
});
