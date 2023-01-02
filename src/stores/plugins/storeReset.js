import cloneDeep from 'lodash.clonedeep'
import { toRaw } from 'vue'

export default function storeReset({ store }) {
  const initialState = cloneDeep(toRaw(store.$state))
  store.$reset = () => store.$patch(cloneDeep(initialState))
}
