import { render, act } from '@testing-library/react';
import MapContainer from '../../components/MapContainer';

describe('MapContainer Component', () => {
  test('MapContainer renders', () => {
    const {container} = render(<MapContainer />);
    
		expect(container).toMatchSnapshot();
  });
});