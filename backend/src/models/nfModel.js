// backend/src/models/NFModel.js
import { DataTypes, literal } from 'sequelize';
import sequelize from '../config/database.js'; // Importa a conexão Sequelize

// ----------------------------------------------------
// 1. Definição do Modelo NF (Estrutura da Tabela notas_fiscais)
// ----------------------------------------------------
const NF = sequelize.define('NotasFiscais', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    relatorio_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // references: { model: 'relatorios', key: 'id' }, // O Sequelize vai inferir o nome correto
        onDelete: 'SET NULL',
    },
    usuario_emissor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: { model: 'usuarios', key: 'id' },
        onDelete: 'RESTRICT',
    },
    numero_nf: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: { model: 'clientes', key: 'id' },
        onDelete: 'RESTRICT',
    },
    cliente_nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    valor_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    valor_iss: {
        type: DataTypes.DECIMAL(10, 2),
    },
    aliquota: {
        type: DataTypes.DECIMAL(5, 2),
    },
    caminho_pdf: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    data_emissao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    // O Sequelize vai cuidar de 'criado_em' e 'atualizado_em' automaticamente
}, {
    tableName: 'notas_fiscais', 
    timestamps: true,
    createdAt: 'criado_em', // Usa o nome definido em database.js
    updatedAt: 'atualizado_em', // Usa o nome definido em database.js
});


// ----------------------------------------------------
// 2. Lógica para Persistência (Métodos Estáticos do NFModel)
// ----------------------------------------------------

/**
 * Método para obter o próximo número sequencial da NF.
 */
NF.getNextNumeroNF = async () => {
    // Usar o método .max() do Sequelize para buscar o maior valor.
    const lastNumber = await NF.max('numero_nf'); 
    return (lastNumber || 0) + 1;
};

/**
 * Método para salvar o registro da NF.
 */
NF.saveNF = async (data) => {
    // Usar o método .create() do Sequelize para inserir o registro.
    return NF.create({
        numero_nf: data.numeroNF,
        cliente_id: data.clienteId,
        cliente_nome: data.clienteNome,
        valor_total: data.total,
        valor_iss: data.valorISS,
        aliquota: data.aliquota,
        caminho_pdf: data.caminhoPdf,
        usuario_emissor_id: data.usuarioEmissorId,
        // Adicione relatorio_id se for fornecido nos dados
    });
};


export default NF;