import Select from './src/select.vue'
import { withInstall } from '@screen-ui/utils'
import type { SFCWithInstall } from "@screen-ui/utils"

export const SnSelect: SFCWithInstall<typeof Select> = withInstall(Select, { })

export default SnSelect
