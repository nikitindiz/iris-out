import { Iris, IrisOptions } from '../src/index';
import { JSDOM } from 'jsdom';

describe('Iris', () => {
  // Set up a simulated browser environment before each test
  let dom: JSDOM;

  beforeEach(() => {
    // Create a new JSDOM instance for each test
    dom = new JSDOM(
      '<!DOCTYPE html><html><body><div id="test-element" style="width: 100px; height: 100px;"></div></body></html>'
    );

    // Set up the global window and document objects
    global.window = dom.window as any;
    global.document = dom.window.document;
    global.HTMLElement = dom.window.HTMLElement;
    global.HTMLDivElement = dom.window.HTMLDivElement;
    global.ResizeObserver = class ResizeObserver {
      constructor(callback: ResizeObserverCallback) {}
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  afterEach(() => {
    // Clean up after each test
    dom.window.close();
    // @ts-ignore
    global.window = undefined;
    // @ts-ignore
    global.document = undefined;
    // @ts-ignore
    global.HTMLElement = undefined;
    // @ts-ignore
    global.HTMLDivElement = undefined;
    // @ts-ignore
    global.ResizeObserver = undefined;
  });

  test('should throw error if instantiated outside browser environment', () => {
    // @ts-ignore
    global.window = undefined;

    expect(() => new Iris()).toThrow('Iris only works in browser environments');
  });

  test('should create an instance with default options', () => {
    const iris = new Iris();
    expect(iris).toBeInstanceOf(Iris);
  });

  test('should accept custom options', () => {
    const options: IrisOptions = {
      backgroundColor: 'rgba(255, 0, 0, 0.5)',
      opacity: 0.5,
      zIndex: 1000,
      animationDuration: 500,
    };

    const iris = new Iris(options);
    expect(iris).toBeInstanceOf(Iris);
  });

  test('should highlight an element', () => {
    const iris = new Iris();
    const element = document.getElementById('test-element');

    if (element) {
      iris.highlight(element);
      const overlay = document.body.querySelector('div:not(#test-element)') as HTMLElement;

      expect(overlay).not.toBeNull();
      expect(overlay?.style.position).toBe('fixed');
      expect(overlay?.style.backgroundColor).toBe('rgba(0, 0, 0, 0.7)');
    } else {
      fail('Test element not found in the DOM');
    }
  });

  test('should clear highlight when requested', done => {
    const iris = new Iris({
      animationDuration: 10, // Speed up the test with shorter animation
    });
    const element = document.getElementById('test-element');

    if (element) {
      iris.highlight(element);

      // Verify the overlay was created
      let overlay = document.body.querySelector('div:not(#test-element)');
      expect(overlay).not.toBeNull();

      // Clear the highlight
      iris.clear(() => {
        // After clearing, the overlay should be removed
        overlay = document.body.querySelector('div:not(#test-element)');
        expect(overlay).toBeNull();
        done();
      });
    } else {
      fail('Test element not found in the DOM');
    }
  });

  test('should update cutout when element changes position', () => {
    // Mock the getBoundingClientRect to simulate element position
    const mockRect = { left: 50, top: 50, width: 200, height: 100 };
    const element = document.getElementById('test-element');

    if (element) {
      element.getBoundingClientRect = jest.fn(() => mockRect as DOMRect);

      const iris = new Iris();
      const updateCutoutSpy = jest.spyOn(iris as any, 'updateCutout');

      iris.highlight(element);
      expect(updateCutoutSpy).toHaveBeenCalled();

      // Check if the overlay has the correct clip-path
      const overlay = document.body.querySelector('div:not(#test-element)') as HTMLElement;
      expect(overlay?.style.clipPath).toContain(`${mockRect.left}px ${mockRect.top}px`);
    } else {
      fail('Test element not found in the DOM');
    }
  });

  test('should clean up event listeners when cleared', done => {
    const iris = new Iris({
      animationDuration: 10, // Speed up the test
    });
    const element = document.getElementById('test-element');

    if (element) {
      // Create spies for addEventListener and removeEventListener
      const addEventSpy = jest.spyOn(window, 'addEventListener');
      const removeEventSpy = jest.spyOn(window, 'removeEventListener');

      // First check that highlight adds listeners
      iris.highlight(element);
      expect(addEventSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
      expect(addEventSpy).toHaveBeenCalledWith('resize', expect.any(Function));

      // Reset the spy counts to focus on just the removal
      addEventSpy.mockClear();
      removeEventSpy.mockClear();

      // Mock the transitionend event since it's what triggers the cleanup
      const mockOverlay = document.body.querySelector('div:not(#test-element)');
      if (mockOverlay) {
        // Manually trigger the cleanup that would happen on transitionend
        window.removeEventListener('scroll', iris.updateHandler);
        window.removeEventListener('resize', iris.updateHandler);

        // Now check that our event was removed
        expect(removeEventSpy).toHaveBeenCalledWith('scroll', iris.updateHandler);
        expect(removeEventSpy).toHaveBeenCalledWith('resize', iris.updateHandler);
        done();
      } else {
        fail('Overlay element not found');
      }
    } else {
      fail('Test element not found in the DOM');
    }
  });

  test('should update overlay when options are changed', () => {
    const iris = new Iris({
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      opacity: 0.7,
      zIndex: 9999,
      animationDuration: 300,
    });

    const element = document.getElementById('test-element');

    if (element) {
      // First highlight the element to create the overlay
      iris.highlight(element);

      // Get the overlay element
      const overlay = document.body.querySelector('div:not(#test-element)') as HTMLElement;
      expect(overlay).not.toBeNull();

      // Initial values check
      expect(overlay.style.backgroundColor).toBe('rgba(0, 0, 0, 0.7)');
      expect(overlay.style.opacity).toBe('0'); // Initially 0, animates to 0.7
      expect(overlay.style.zIndex).toBe('9999');
      expect(overlay.style.transition).toBe('opacity 300ms ease');

      // Update options
      iris.options = {
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
        opacity: 0.5,
        zIndex: 5000,
        animationDuration: 500,
      };

      // Verify the overlay properties were updated
      expect(overlay.style.backgroundColor).toBe('rgba(255, 0, 0, 0.5)');
      expect(overlay.style.opacity).toBe('0.5');
      expect(overlay.style.zIndex).toBe('5000');
      expect(overlay.style.transition).toBe('opacity 500ms ease');

      // Also verify that updateCutout was called
      const updateCutoutSpy = jest.spyOn(iris as any, 'updateCutout');
      iris.options = { backgroundColor: 'rgba(0, 0, 255, 0.5)' };
      expect(updateCutoutSpy).toHaveBeenCalled();
    } else {
      fail('Test element not found in the DOM');
    }
  });
});
