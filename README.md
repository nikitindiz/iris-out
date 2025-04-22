# Iris Out

A lightweight library for highlighting DOM elements by shading everything else on the page.

## Installation

```bash
npm install iris-out
```

or

```bash
yarn add iris-out
```

## Usage

```typescript
import Iris from 'iris-out';

// Initialize with default options
const iris = new Iris();

// Highlight a specific element
const elementToHighlight = document.getElementById('my-element');
iris.highlight(elementToHighlight);

// Remove the highlight when done
iris.clear();
```

## Options

You can customize the highlighting effect by passing options to the constructor:

```typescript
const iris = new Iris({
  backgroundColor: 'rgba(0, 0, 0, 0.7)', // Background color of the overlay
  opacity: 0.7, // Opacity of the overlay
  zIndex: 9999, // z-index of the overlay
  fadeDuration: 300, // Duration of animation in milliseconds
});
```

### Updating Options

You can update options after initialization using the options setter:

```typescript
// Update all options
iris.options = {
  backgroundColor: 'rgba(255, 0, 0, 0.5)',
  opacity: 0.5,
  zIndex: 1000,
  fadeDuration: 500,
};

// Or just update specific options
iris.options = {
  backgroundColor: 'rgba(0, 0, 255, 0.3)',
};
```

When you update options while an element is highlighted, the changes take effect immediately.

## License

MIT
