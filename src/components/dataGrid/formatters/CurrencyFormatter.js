export default value => (value !== null ? `${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` : '')
