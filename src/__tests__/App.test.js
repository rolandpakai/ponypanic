import { render, act, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  test('App renders', () => {
    const {container} = render(<App />);
    
		expect(container).toMatchSnapshot();
  });
});