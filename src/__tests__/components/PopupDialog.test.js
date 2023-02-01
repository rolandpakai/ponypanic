import { render, act } from '@testing-library/react';
import PopupDialog from '../../components/PopupDialog';

describe('PopupDialog Component', () => {
  test('PopupDialog renders', () => {
    const {container} = render(<PopupDialog open={true} />);
    
		expect(container).toMatchSnapshot();
  });
});