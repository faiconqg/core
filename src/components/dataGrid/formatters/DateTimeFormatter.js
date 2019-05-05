import moment from 'moment'
export default value => (value ? moment.utc(value).format('DD/MM/YYYY HH:mm') : '')
