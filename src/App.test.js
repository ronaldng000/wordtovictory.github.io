import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Bible Track dashboard', () => {
  localStorage.clear();
  render(<App />);
  expect(screen.getByText('Genesis')).toBeInTheDocument();
  expect(screen.getByText('0 of 1189 chapters read')).toBeInTheDocument();
});
