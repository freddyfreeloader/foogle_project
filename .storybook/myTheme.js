import {create} from '@storybook/theming/create';

import foogle from '../public/foogle.png';

export default create({
  base: 'light',
  brandTitle: 'Foogle - A Fake Google Contacts Application',
  brandImage: foogle,
});
