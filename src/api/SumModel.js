import Model from './Model'

export default class SumModel extends Model {
  url(): string {
    return `${this.collection.url()}/sum`
  }

  fetch = where =>
    super.fetch({
      data: { fields: this.collection.numericFields(), where: where }
    })
}
