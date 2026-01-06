import React, { useState, useEffect } from 'react';

const PecasAtuais = ({ onPecasChange }) => {
  const [pecas, setPecas] = useState([]);
  const [novaPeca, setNovaPeca] = useState('');
  const [novaObservacao, setNovaObservacao] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    onPecasChange(pecas.map(peca => ({ descricao: peca, observacao: '' }))); // Envia como objeto com descrição e observação
  }, [pecas, onPecasChange]);

  const handleAdicionarPeca = () => {
    if (!novaPeca.trim()) {
      setError('O nome da peça não pode estar vazio.');
      return;
    }
    if (pecas.includes(novaPeca)) {
      setError('Esta peça já foi adicionada.');
      return;
    }
    setPecas([...pecas, novaPeca]);
    setNovaPeca('');
    setNovaObservacao('');
    setError(null); // Limpa erro após sucesso
  };

  const handleRemoverPeca = (index) => {
    const newPecas = pecas.filter((_, i) => i !== index);
    setPecas(newPecas);
    setError(null); // Limpa erro após remoção
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">6. Peças Atuais</h2>
      <div className="flex flex-col gap-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <ul className="list-disc list-inside">
          {pecas.map((peca, index) => (
            <li key={index} className="flex items-center justify-between text-gray-700 py-1">
              <span>{peca}</span>
              <button
                type="button"
                onClick={() => handleRemoverPeca(index)}
                className="text-red-500 hover:text-red-700 font-bold ml-2"
                aria-label="Remover peça"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={novaPeca}
            onChange={(e) => setNovaPeca(e.target.value)}
            placeholder="Nome da peça"
            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Nome da peça"
          />
          <input
            type="text"
            value={novaObservacao}
            onChange={(e) => setNovaObservacao(e.target.value)}
            placeholder="Observação (opcional)"
            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 md:mt-0"
            aria-label="Observação da peça"
          />
          <button
            type="button"
            onClick={handleAdicionarPeca}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 mt-2 md:mt-0"
            aria-label="Adicionar peça"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PecasAtuais;