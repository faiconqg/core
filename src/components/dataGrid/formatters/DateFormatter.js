import moment from 'moment'
export default value => (value ? moment(value).utc().format('DD/MM/YY') : '')
