import { render, act } from '@testing-library/react';
import Button from '../../components/Button';

describe('Button Component', () => {
  test('Button renders', () => {
    const {container} = render(<Button />);
    
		expect(container).toMatchSnapshot();
  });
});