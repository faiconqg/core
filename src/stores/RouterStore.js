import { observable, action, computed } from './../api'
import { AccessRoutesStore, AppStore } from 'stores'
import RealmStore from './RealmStore'

class RouterStore {
  @observable
  location = null

  history = null

  constructor() {
    this.push = this.push.bind(this)
    this.replace = this.replace.bind(this)
    this.go = this.go.bind(this)
    this.goBack = this.goBack.bind(this)
    this.goForward = this.goForward.bind(this)
    this.pushAccessRoute = this.pushAccessRoute.bind(this)
    this.pushSubpage = this.pushSubpage.bind(this)
    this.pushBack = this.pushBack.bind(this)
  }

  @computed
  get currentTitle() {
    if (this.location && !AccessRoutesStore.isEmpty) {
      const pathArray = this.location.pathname.split('/')
      pathArray.shift()
      let accessRoutes = AccessRoutesStore.models
      pathArray.some(path => {
        accessRoutes = accessRoutes.filter(item => (item.path || item.get('path')) === path)[0]
        if (accessRoutes && accessRoutes.toJS) {
          accessRoutes = accessRoutes.toJS()
        }
        if (accessRoutes && accessRoutes.accessRoutes && accessRoutes.accessRoutes.length > 0) {
          accessRoutes = accessRoutes.accessRoutes
        } else {
          return true
        }
        return false
      })
      return accessRoutes ? accessRoutes.title || accessRoutes.label : RealmStore.appName
    } else {
      return ''
    }
  }

  resolvePath(props) {
    if (props.parent) {
      return this.resolvePath(props.parent) + '/' + props.accessRoute.path
    } else {
      return '/' + props.accessRoute.path
    }
  }

  isActive(props) {
    return this.location.pathname.indexOf(this.resolvePath(props)) === 0
  }

  @action
  _updateLocation(newState) {
    let splited = newState.pathname.split('/')
    let size = 3

    const mainRouter = AccessRoutesStore.models.find(item => (item.path || item.get('path')) === splited[1])

    if (mainRouter && mainRouter.has('accessRoutes') && mainRouter.get('accessRoutes').length > 0) {
      size = 4
    }

    this.checkSubPage(splited.length >= size)
    this.location = newState
  }

  checkSubPage = open => {
    if (open !== AppStore.inSubPage) {
      // setTimeout(() => (AppStore.inSubPage = open), 100)
      AppStore.inSubPage = open
    }
  }

  /*
   * History methods
   */
  @action
  pushAccessRoute(props) {
    this.history.push(this.resolvePath(props))
  }

  @action
  pushBack(count = 1) {
    const splited = this.location.pathname.split('/')
    this.history.push(this.location.pathname.slice(0, this.location.pathname.lastIndexOf(splited[splited.length - count]) - 1))
  }

  @action
  replaceSubpage(location) {
    this.history.replace(this.location.pathname.slice(0, this.location.pathname.lastIndexOf('/')) + '/' + location)
  }

  @action
  push(location) {
    this.history.push(location)
  }

  @action
  pushSubpage(location) {
    this.history.push(this.location.pathname + '/' + location)
  }

  @action
  replace(location) {
    this.history.replace(location)
  }

  @action
  go(n) {
    this.history.go(n)
  }

  @action
  goBack() {
    this.history.goBack()
  }
  @action
  goForward() {
    this.history.goForward()
  }
}

export default new RouterStore()
