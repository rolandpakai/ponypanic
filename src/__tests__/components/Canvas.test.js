import { render, act } from '@testing-library/react';
import Canvas from '../../components/Canvas';

describe('Canvas Component', () => {
  test('Canvas renders', () => {
    const {container} = render(<Canvas />);

		expect(container).toMatchSnapshot();
  });
});