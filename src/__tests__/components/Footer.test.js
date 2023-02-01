import { render, act } from '@testing-library/react';
import Footer from '../../components/Footer';

describe('Footer Component', () => {
  test('Footer renders', () => {
    const {container} = render(<Footer />);
    
		expect(container).toMatchSnapshot();
  });
});