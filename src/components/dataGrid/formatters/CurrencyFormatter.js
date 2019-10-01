export default value => (value !== null && value !== undefined ? `${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` : '')
