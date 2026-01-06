import React, { useState, useEffect } from 'react';


const MedicoesResistencia = ({ onMedicoesChange }) => {
  const [medicoes, setMedicoes] = useState([
    { id: 1, descricao: 'Medição entre bobina e carcaça 1 e 4', valor: '', unidade: 'GΩ' },
    { id: 2, descricao: 'Medição entre bobina e carcaça 2 e 5', valor: '', unidade: 'GΩ' },
    { id: 3, descricao: 'Medição entre bobina e carcaça 3 e 6', valor: '', unidade: 'GΩ' },
    { id: 4, descricao: 'Medição entre bobinas 1 e 2', valor: '', unidade: 'GΩ' },
    { id: 5, descricao: 'Medição entre bobinas 1 e 3', valor: '', unidade: 'GΩ' },
    { id: 6, descricao: 'Medição entre bobinas 2 e 3', valor: '', unidade: 'GΩ' },
  ]);

  useEffect(() => {
    onMedicoesChange(medicoes);
  }, [medicoes, onMedicoesChange]);

  const handleChange = (id, field, value) => {
    const newMedicoes = medicoes.map(medicao =>
      medicao.id === id ? { ...medicao, [field]: value } : medicao
    );
    setMedicoes(newMedicoes);
  };
  
  const handleAddMedicao = () => {
    const newId = Math.max(...medicoes.map(m => m.id)) + 1;
    setMedicoes([
      ...medicoes,
      { id: newId, descricao: `Medição adicional ${newId}`, valor: "", unidade: "GΩ" }
    ]);
  };

  const handleRemoveMedicao = (id) => {
    setMedicoes(medicoes.filter(medicao => medicao.id !== id));
  };

  return (
    // O id "section-isolation-measurements" é crucial para o CSS
    <div className="measurement-section" id="section-isolation-measurements">
      
      {/* O container da grade "measurement-grid" envolve tudo */}
      <div className="measurement-grid">
        
        {/* Este é o cabeçalho, ele deve estar dentro da grade */}
        <div className="measurement-headers">
          <div>Descrição da Medição</div>
          <div>Valor Encontrado</div>
          <div>Unidade</div>
          <div>Ações</div>
        </div>

        {/* O loop que cria cada item, deve estar dentro da grade */}
        {medicoes.map((medicao) => (
          <div className="measurement-item" key={medicao.id}>
            <div className="measurement-label">{medicao.descricao}</div>
            <input
              type="text"
              value={medicao.valor}
              onChange={(e) => handleChange(medicao.id, 'valor', e.target.value)}
            />
            <select
              value={medicao.unidade}
              onChange={(e) => handleChange(medicao.id, 'unidade', e.target.value)}
            >
              <option value="GΩ">GΩ</option>
              <option value="MΩ">MΩ</option>
              <option value="TΩ">TΩ</option>
            </select>
            <button 
              onClick={() => handleRemoveMedicao(medicao.id)} 
              className="remove-btn" 
              disabled={medicoes.length <= 6}
            >
              Remover
            </button>
          </div>
        ))}
        
      </div>
      
      {/* O botão de adicionar pode ficar fora da grade */}
      <div className="add-btn-container">
        <button 
          type="button"
          onClick={handleAddMedicao} 
          className="add-btn"
        >
          Adicionar Medição
        </button>
      </div>
    </div>
  );
};

export default MedicoesResistencia;