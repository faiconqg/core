import { Collection } from './../api'
import { UserStore } from 'stores'

class ContactData extends Collection {
  url = () => 'contact-data'

  current = () => {
    if (UserStore.logged.contactDataId) {
      this.where({ id: UserStore.logged.contactDataId }).all()
    }
  }
}

export default ContactData
