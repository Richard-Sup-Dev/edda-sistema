import React, { useState, useEffect } from 'react';
import "@/styles/App.css";

const MedicoesBatimento = ({ onMedicoesChange }) => {
    const [medicoes, setMedicoes] = useState([
        { id: 1, descricao: "Medição do batimento radial na ponta dianteira ‘A’ do eixo", valor: "", unidade: "mm", tolerancia: "K" },
        { id: 2, descricao: "Medição do batimento radial no ponto lateral ‘C’ do eixo", valor: "", unidade: "mm", tolerancia: "N/A" },
        { id: 3, descricao: "Medição do batimento radial na ponta traseira ‘B’ do eixo", valor: "", unidade: "mm", tolerancia: "H" },
    ]);

    useEffect(() => {
        onMedicoesChange(medicoes.filter(m => m.valor.trim() !== "" || m.tolerancia.trim() !== ""));
    }, [medicoes, onMedicoesChange]);

    const handleChangeValor = (id, event) => {
        const newMedicoes = medicoes.map(medicao =>
            medicao.id === id ? { ...medicao, valor: event.target.value } : medicao
        );
        setMedicoes(newMedicoes);
    };

    const handleChangeTolerancia = (id, event) => {
        const newMedicoes = medicoes.map(medicao =>
            medicao.id === id ? { ...medicao, tolerancia: event.target.value } : medicao
        );
        setMedicoes(newMedicoes);
    };

    const handleAddMedicao = () => {
        const newId = Math.max(...medicoes.map(m => m.id), 0) + 1;
        setMedicoes([
            ...medicoes,
            { id: newId, descricao: `Medição do batimento radial adicional ${newId}`, valor: "", unidade: "mm", tolerancia: "N/A" }
        ]);
    };

    const handleRemoveMedicao = (id) => {
        setMedicoes(medicoes.filter(medicao => medicao.id !== id));
    };

    return (
        <div className="measurement-section">
            <div className="measurement-grid">
                <div className="measurement-headers">
                    <div>Descrição da Medição</div>
                    <div>Valor Encontrado</div>
                    <div>Unidade</div>
                    <div>Tolerância</div>
                    <div>Ações</div>
                </div>
                {medicoes.map((medicao) => (
                    <div className="measurement-item" key={medicao.id}>
                        <div className="measurement-label">{medicao.descricao}</div>
                        <div>
                            <input
                                type="text"
                                value={medicao.valor}
                                onChange={(e) => handleChangeValor(medicao.id, e)}
                            />
                        </div>
                        <div className="fixed-unit">{medicao.unidade}</div>
                        <div>
                            <select
                                value={medicao.tolerancia}
                                onChange={(e) => handleChangeTolerancia(medicao.id, e)}
                            >
                                <option value="H">H</option>
                                <option value="K">K</option>
                                <option value="L">L</option>
                                <option value="N/A">N/A</option>
                            </select>
                        </div>
                        <div>
                            <button onClick={() => handleRemoveMedicao(medicao.id)} className="remove-btn" disabled={medicoes.length < 2}>
                                Remover
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="add-btn-container">
                <button type="button" onClick={handleAddMedicao} className="add-btn">
                    Adicionar Medição
                </button>
            </div>
        </div>
    );
};

export default MedicoesBatimento;