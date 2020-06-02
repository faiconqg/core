import moment from 'moment'
export default value => (value ? moment(value).utc(new Date()).format('DD/MM/YY') : '')
