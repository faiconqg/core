import { Collection } from './../api'
import { UserStore } from 'stores'

class Accounts extends Collection {
  url = () => 'accounts'

  current = () => this.where({ id: UserStore.logged.accountId }).all()
}

export default Accounts
