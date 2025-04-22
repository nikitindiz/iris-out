/**
 * iris-out
 * A library for highlighting selected DOM elements by shading everything else
 */

export interface IrisOutOptions {
  backgroundColor?: string;
  opacity?: number;
  zIndex?: number;
  fadeDuration?: number;
}

export class IrisOut {
  private _options: IrisOutOptions;
  private overlay: HTMLDivElement | null = null;
  private highlightedElement: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private updateHandler: () => void;
  private onCutoutUpdate: null | ((rect: DOMRect) => void) = null;
  private onClear: null | (() => void) = null;

  constructor(options: IrisOutOptions = {}) {
    // Check if running in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      throw new Error('Iris only works in browser environments');
    }

    this._options = {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      opacity: 0.7,
      zIndex: 9999,
      fadeDuration: 300,
      ...options,
    };

    // Update on scroll
    this.updateHandler = this.updateCutout.bind(this);
  }

  /**
   * Update the options for this Iris instance
   * @param newOptions The new options to apply
   */
  public set options(newOptions: IrisOutOptions) {
    this._options = {
      ...this._options,
      ...newOptions,
    };

    // Update overlay with new options if it exists
    if (this.overlay) {
      if (newOptions.backgroundColor !== undefined) {
        this.overlay.style.backgroundColor = newOptions.backgroundColor;
      }

      if (newOptions.opacity !== undefined) {
        this.overlay.style.opacity = `${newOptions.opacity}`;
      }

      if (newOptions.zIndex !== undefined) {
        this.overlay.style.zIndex = `${newOptions.zIndex}`;
      }

      if (newOptions.fadeDuration !== undefined) {
        this.overlay.style.transition = `opacity ${newOptions.fadeDuration}ms ease`;
      }

      // Re-apply the cutout effect with potentially new styles
      this.updateCutout();
    }
  }

  private renderOverlay = (element: HTMLElement): void => {
    this.highlightedElement = element;

    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.style.position = 'fixed';
    this.overlay.style.top = '0';
    this.overlay.style.left = '0';
    this.overlay.style.width = '100%';
    this.overlay.style.height = '100%';
    this.overlay.style.backgroundColor = this._options.backgroundColor || 'rgba(0, 0, 0, 0.7)';
    this.overlay.style.opacity = '0';
    this.overlay.style.transition = `opacity ${this._options.fadeDuration}ms ease`;
    this.overlay.style.zIndex = `${this._options.zIndex || 9999}`;
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
        this.overlay.style.opacity = `${this._options.opacity || 0.7}`;
      }
    }, 10);
  };

  /**
   * Highlight a DOM element by shading everything else
   * @param element The element to highlight
   */
  public highlight(
    element: HTMLElement,
    updateCb?: null | ((rect: DOMRect) => void),
    onClear?: null | (() => void)
  ): void {
    if (updateCb) {
      this.onCutoutUpdate = updateCb;
    } else {
      this.onCutoutUpdate = null;
    }

    if (onClear) {
      this.onClear = onClear;
    } else {
      this.onClear = null;
    }

    // Clear any existing highlight first
    this.clear(() => this.renderOverlay(element));
  }

  /**
   * Remove the highlighting overlay
   */
  public clear(cb?: () => void): void {
    // Stop observing resize
    this.removeResizeObserver();

    const onClear = this.onClear;

    if (this.overlay) {
      // Animate opacity to 0 and then remove
      this.overlay.style.opacity = '0';

      setTimeout(() => {
        if (this.overlay && this.overlay.parentNode) {
          this.overlay.parentNode.removeChild(this.overlay);
        }
        this.overlay = null;
        this.highlightedElement = null;

        onClear && onClear();
        cb && cb();
      }, this._options.fadeDuration || 300);
    } else {
      onClear && onClear();
      cb && cb();
    }
  }

  /**
   * Update the cutout position and size when element changes
   */
  private updateCutout(): void {
    if (!this.highlightedElement) return;

    const rect = this.highlightedElement.getBoundingClientRect();

    if (this.onCutoutUpdate) {
      this.onCutoutUpdate(rect);
    }

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

    window.addEventListener('scroll', this.updateHandler);
    window.addEventListener('resize', this.updateHandler);

    // Update on resize with ResizeObserver
    this.resizeObserver = new ResizeObserver(() => {
      this.updateCutout();
    });

    this.resizeObserver.observe(this.highlightedElement);
  }

  private removeResizeObserver = (): void => {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    // Clean up event listener when overlay is removed
    if (this.overlay) {
      const cleanupScrollHandler = () => {
        window.removeEventListener('scroll', this.updateHandler);
        window.removeEventListener('resize', this.updateHandler);

        if (this.overlay) {
          this.overlay.removeEventListener('transitionend', cleanupScrollHandler);
        }
      };

      this.overlay.addEventListener('transitionend', cleanupScrollHandler);
    }
  };
}

export default IrisOut;
