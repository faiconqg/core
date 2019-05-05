import BaseUserStore from './UserStore'
import BaseAccessRoutesStore from './AccessRoutesStore'
import BaseRealmStore from './RealmStore'
import BaseAccountStore from './AccountStore'
import BaseUserDetailStore from './UserDetailStore'

export { default as AppStore } from './AppStore'
export { default as RouterStore } from './RouterStore'
export const UserStore = new BaseUserStore()
export const AccessRoutesStore = new BaseAccessRoutesStore({
  where: { enabled: true, accessRouteId: null },
  order: ['orderIndex'],
  include: 'accessRoutes'
})
export const AccountStore = new BaseAccountStore()
export const UserDetailStore = new BaseUserDetailStore()
export const RealmStore = new BaseRealmStore()
