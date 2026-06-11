// Compatibility shim: export the consolidated store from `store/index.js`
import { useAuthStore as _useAuthStore } from './index';

export const useAuthStore = _useAuthStore;
export default _useAuthStore;
