import { render, act } from '@testing-library/react';
import Field from '../../components/Field';

describe('Field Component', () => {
  test('Field renders', () => {
    const {container} = render(<Field />);

		expect(container).toMatchSnapshot();
  });
});