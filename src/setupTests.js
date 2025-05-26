// vitest.setup.js (or vitest.setup.ts)
import { vi } from 'vitest';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Optional: If you're using @testing-library/react and its custom matchers
// like .toBeInTheDocument(), you'll typically import them here.
import '@testing-library/jest-dom/vitest';