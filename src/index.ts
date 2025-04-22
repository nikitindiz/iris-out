/**
 * iris-out
 * A library for highlighting selected DOM elements by shading everything else
 */

export interface IrisOptions {
  backgroundColor?: string;
  opacity?: number;
  zIndex?: number;
  animationDuration?: number;
}

export class Iris {
  private options: IrisOptions;
  private overlay: HTMLDivElement | null = null;
  private highlightedElement: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;

  constructor(options: IrisOptions = {}) {
    this.options = {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      opacity: 0.7,
      zIndex: 9999,
      animationDuration: 300,
      ...options,
    };
  }

  /**
   * Highlight a DOM element by shading everything else
   * @param element The element to highlight
   */
  public highlight(element: HTMLElement): void {
    // Clear any existing highlight first
    this.clear();

    this.highlightedElement = element;

    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.style.position = 'fixed';
    this.overlay.style.top = '0';
    this.overlay.style.left = '0';
    this.overlay.style.width = '100%';
    this.overlay.style.height = '100%';
    this.overlay.style.backgroundColor = this.options.backgroundColor || 'rgba(0, 0, 0, 0.7)';
    this.overlay.style.opacity = '0';
    this.overlay.style.transition = `opacity ${this.options.animationDuration}ms ease`;
    this.overlay.style.zIndex = `${this.options.zIndex || 9999}`;
    this.overlay.style.pointerEvents = 'none'; // Allow clicking through the overlay

    // Add to document
    document.body.appendChild(this.overlay);

    // Create a cut-out effect for the highlighted element
    this.updateCutout();

    // Start observing resize
    this.observeResize();

    // Trigger animation
    setTimeout(() => {
      if (this.overlay) {
        this.overlay.style.opacity = `${this.options.opacity || 0.7}`;
      }
    }, 10);
  }

  /**
   * Remove the highlighting overlay
   */
  public clear(): void {
    // Stop observing resize
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.overlay) {
      // Animate opacity to 0 and then remove
      this.overlay.style.opacity = '0';

      setTimeout(() => {
        if (this.overlay && this.overlay.parentNode) {
          this.overlay.parentNode.removeChild(this.overlay);
        }
        this.overlay = null;
        this.highlightedElement = null;
      }, this.options.animationDuration || 300);
    }
  }

  /**
   * Update the cutout position and size when element changes
   */
  private updateCutout(): void {
    if (!this.highlightedElement) return;

    const rect = this.highlightedElement.getBoundingClientRect();

    // Create clip-path CSS for the overlay
    if (this.overlay) {
      this.overlay.style.clipPath = `
        polygon(
          0% 0%, 
          100% 0%, 
          100% 100%, 
          0% 100%, 
          0% 0%, 
          ${rect.left}px ${rect.top}px, 
          ${rect.left}px ${rect.top + rect.height}px, 
          ${rect.left + rect.width}px ${rect.top + rect.height}px, 
          ${rect.left + rect.width}px ${rect.top}px, 
          ${rect.left}px ${rect.top}px
        )
      `;
    }
  }

  /**
   * Observe element resize and scroll to update cutout
   */
  private observeResize(): void {
    if (!this.highlightedElement) return;

    // Update on scroll
    const scrollHandler = () => this.updateCutout();
    window.addEventListener('scroll', scrollHandler);

    // Update on resize with ResizeObserver
    this.resizeObserver = new ResizeObserver(() => {
      this.updateCutout();
    });

    this.resizeObserver.observe(this.highlightedElement);

    // Clean up event listener when overlay is removed
    if (this.overlay) {
      const cleanupScrollHandler = () => {
        window.removeEventListener('scroll', scrollHandler);
        if (this.overlay) {
          this.overlay.removeEventListener('transitionend', cleanupScrollHandler);
        }
      };

      this.overlay.addEventListener('transitionend', cleanupScrollHandler);
    }
  }
}

export default Iris;
