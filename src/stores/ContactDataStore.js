import { Collection } from './../api'
import { UserStore } from 'stores'

class ContactData extends Collection {
  url = () => 'contact-data'

  current = () => this.where({ id: UserStore.logged.contactDataId }).all()
}

export default ContactData
