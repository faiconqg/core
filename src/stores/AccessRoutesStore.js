import { Collection, Model } from './../api'

class AccessRoute extends Model {
  urlRoot = () => 'access-routes'
}

class AccessRoutes extends Collection {
  url = () => 'access-routes'
  model = () => AccessRoute
}

export default AccessRoutes
