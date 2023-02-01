import { render, act } from '@testing-library/react';
import TitleScreen from '../../components/TitleScreen';

describe('TitleScreen Component', () => {
  test('TitleScreen renders', () => {
    const {container} = render(<TitleScreen />);
    
		expect(container).toMatchSnapshot();
  });
});