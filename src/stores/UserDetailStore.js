import { Collection } from './../api'
import { UserStore } from 'stores'

class UserDetails extends Collection {
  url = () => 'user-details'

  current = () => this.where({ id: UserStore.logged.userDetailId }).all()
}

export default UserDetails
