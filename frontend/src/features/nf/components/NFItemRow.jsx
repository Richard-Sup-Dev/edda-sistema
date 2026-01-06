// src/components/NFItemRow.jsx
export default function NFItemRow({ item, onQuantidadeChange, onRemove }) {
  return (
    <tr>
      <td>{item.tipo === 'peca' ? 'Peça' : 'Serviço'}</td>
      <td>{item.descricao}</td>
      <td>
        <input
          type="number"
          min="1"
          value={item.quantidade}
          onChange={e => onQuantidadeChange(item.id, parseFloat(e.target.value) || 1)}
          style={{ width: '60px' }}
        />
      </td>
      <td>R$ {item.valor_unitario.toFixed(2)}</td>
      <td>R$ {item.valor_total.toFixed(2)}</td>
      <td>
        <button onClick={() => onRemove(item.id)} style={{ color: 'red', background: 'none', border: 'none' }}>
          X
        </button>
      </td>
    </tr>
  );
}