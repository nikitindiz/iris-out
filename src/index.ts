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
    // Implementation will go here
  }

  /**
   * Remove the highlighting overlay
   */
  public clear(): void {
    // Implementation will go here
  }
}

export default Iris;
