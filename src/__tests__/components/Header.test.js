import { render, act } from '@testing-library/react';
import Header from '../../components/Header';

describe('Header Component', () => {
  test('Header renders', () => {
    const {container} = render(<Header />);
    
		expect(container).toMatchSnapshot();
  });
});