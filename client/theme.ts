import { grommet } from 'grommet/themes';
import { deepMerge } from 'grommet/utils'

export default deepMerge(grommet, {
  global: {
    colors: {
      brand: '#00a5e4'
    }
  }
})