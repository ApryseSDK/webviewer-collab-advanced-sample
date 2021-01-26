import { grommet } from 'grommet/themes';
import { deepMerge } from 'grommet/utils';

export default deepMerge(grommet, {
  global: {
    colors: {
      brand: '#00a5e4',
      'neutral-2': '#3a5169',
      'accent-1': '#face00',
    },
  },
});
