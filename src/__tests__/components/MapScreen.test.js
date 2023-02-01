import { render, act } from '@testing-library/react';
import MapScreen from '../../components/MapScreen';

describe('MapScreen Component', () => {
  test('MapScreen renders', () => {
    const {container} = render(<MapScreen />);
    
		expect(container).toMatchSnapshot();
  });
});