import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock canvas context
const mockContext = {
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(),
  putImageData: jest.fn(),
  createImageData: jest.fn(),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  translate: jest.fn(),
  transform: jest.fn(),
  beginPath: jest.fn(),
  closePath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  fill: jest.fn(),
  arc: jest.fn(),
  fillText: jest.fn(),
  strokeText: jest.fn(),
  measureText: jest.fn(),
  clip: jest.fn(),
  createLinearGradient: jest.fn(),
  createRadialGradient: jest.fn(),
  createPattern: jest.fn(),
};

HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

// Mock ReactConfetti
jest.mock("react-confetti", () => () => null);

test("renders portfolio website", () => {
  render(<App />);
  const nameElement = screen.getByText(/Saifuddin Ahammed Munna/i);
  expect(nameElement).toBeInTheDocument();
});
