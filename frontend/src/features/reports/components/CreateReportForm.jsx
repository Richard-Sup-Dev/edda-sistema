import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios'; 
import "@/styles/App.css";
import { API_ENDPOINTS, logger } from "@/config/api";
import { notifySuccess, notifyError } from "@/utils/notifications";
import MedicoesResistencia from "@/features/reports/components/MedicoesResistencia";
import MedicoesBatimento from "@/features/reports/components/MedicoesBatimento";
import PecasAtuais from "@/features/reports/components/PecasAtuais";
import DynamicPhotoSection from "@/components/ui/DynamicPhotoSection";
// import BudgetSection from './BudgetSection'; // REMOVIDO

const FIXED_PHOTO_SLOTS = {
    metodologia: [
        { description: 'FOTO 1: EQUIPAMENTO A SER DESMONTADO' },
    ],
    batimento: [
        { description: 'FOTO 1: MEDIÇÃO BATIMENTO RADIAL NO EIXO DIANTEIRO' },
        { description: 'FOTO 2: MEDIÇÃO BATIMENTO RADIAL NO EIXO TRASEIRO' },
    ],
    bobina_carcaca: [
        { description: 'FOTO 1: MEDIÇÃO ENTRE BOBINA E CARCAÇA 1 E 4' },
        { description: 'FOTO 2: MEDIÇÃO ENTRE BOBINA E CARCAÇA 2 E 5' },
        { description: 'FOTO 3: MEDIÇÃO ENTRE BOBINA E CARCAÇA 3 E 6' },
        { description: 'FOTO 4: MEDIÇÃO ENTRE BOBINAS 1 E 2' },
        { description: 'FOTO 5: MEDIÇÃO ENTRE BOBINAS 1 E 3' },
        { description: 'FOTO 6: MEDIÇÃO ENTRE BOBINAS 2 E 3' },
    ],
    pecas_atuais: [
        { description: 'FOTO 1: TAMPA DA CAIXA DE LIGAÇÃO TRASEIRA' },
        { description: 'FOTO 2: TAMPA DA CAIXA DE LIGAÇÃO DIANTEIRA' },
        { description: 'FOTO 3: ESTATOR' },
        { description: 'FOTO 4: ESTATOR' },
        { description: 'FOTO 5: CAIXA DE LIGAÇÃO' },
        { description: 'FOTO 6: ROTOR' },
        { description: 'FOTO 7: ROLAMENTO DIANTEIRO' },
        { description: 'FOTO 8: ROLAMENTO TRASEIRO' },
        { description: 'FOTO 9: TAMPA DIANTEIRA' },
        { description: 'FOTO 10: TAMPA DIANTEIRA' },
        { description: 'FOTO 11: TAMPA TRASEIRA' },
        { description: 'FOTO 12: TAMPA TRASEIRA' },
        { description: 'FOTO 13: VENTOINHA TRASEIRA' },
        { description: 'FOTO 14: VENTOINHA DIANTEIRA' },
        { description: 'FOTO 15: PARAFUSO' },
        { description: 'FOTO 16: TAMPA DEFLETORA' },
    ],
};

function CreateReportForm() {
    const [step, setStep] = useState(1);
    
    // Nomes dos campos alinhados com o backend (snake_case)
    const [formData, setFormData] = useState({
        os_numero: '', numero_rte: '', titulo_relatorio: '', cliente_nome: '', cliente_cnpj: '', responsavel: '', cliente_endereco: '', cliente_bairro: '', cliente_cidade: '', cliente_estado: '', cliente_cep: '', data_inicio: '', data_fim: '', data_emissao: '', objetivo: '', elaborado_por: '', checado_por: '', aprovado_por: '', causas_danos: '', conclusao: '', medicoes_isolamento: [], medicoes_batimento: [], pecas_atuais: [], art: '', descricao: ''
    });

    // --- ESTADOS PARA GESTÃO DE CLIENTES/AUTOCOMPLETE ---
    const [clientList, setClientList] = useState([]);
    const [searchClientQuery, setSearchClientQuery] = useState('');
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [isSearchingClients, setIsSearchingClients] = useState(false);
    
    // 🚨 ESTADOS pecasCotadas e servicosCotados REMOVIDOS
    // ------------------------------------------

    const [tipoRelatorio, setTipoRelatorio] = useState('');
    const [clienteLogo, setClienteLogo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [metodologiaPhotos, setMetodologiaPhotos] = useState([]);
    const [batimentoPhotos, setBatimentoPhotos] = useState([]);
    const [bobinaCarcaçaPhotos, setBobinaCarcaçaPhotos] = useState([]);
    const [pecasAtuaisPhotos, setPecasAtuaisPhotos] = useState([]);

    // ------------------------------------
    // LÓGICA DE FOTOS E VALIDAÇÃO (mantida)
    // ------------------------------------
    const getTotalPhotosTaken = () => {
        const allPhotos = [
            ...metodologiaPhotos,
            ...batimentoPhotos,
            ...bobinaCarcaçaPhotos,
            ...pecasAtuaisPhotos
        ];
        return allPhotos.filter(p => p.file).length;
    };

    const getTotalExpectedPhotos = () => {
        if (tipoRelatorio === 'Motor') {
            return (
                FIXED_PHOTO_SLOTS.metodologia.length +
                FIXED_PHOTO_SLOTS.batimento.length +
                FIXED_PHOTO_SLOTS.bobina_carcaca.length +
                FIXED_PHOTO_SLOTS.pecas_atuais.length
            );
        } else if (tipoRelatorio === 'Bomba') {
            return (
                FIXED_PHOTO_SLOTS.metodologia.length +
                FIXED_PHOTO_SLOTS.pecas_atuais.length
            );
        }
        return 0;
    };


    // ------------------------------------
    // LÓGICA DE AUTOCOMPLETE (mantida)
    // ------------------------------------
    const fetchClientsForSearch = useCallback(async (query) => {
        if (query.length < 3) {
            setClientList([]);
            return;
        }
        setIsSearchingClients(true);
        try {
            const response = await axios.get(API_ENDPOINTS.CLIENTES);

            const cleanedQuery = query.toLowerCase().replace(/\D/g, '');
            const filteredClients = response.data.filter(client => 
                (client.nome_fantasia && client.nome_fantasia.toLowerCase().includes(query.toLowerCase())) || 
                (client.cnpj && client.cnpj.includes(cleanedQuery))
            );
            setClientList(filteredClients);
        } catch (error) {
            logger.error('Error fetching autocomplete clients:', error);
            setClientList([]);
        } finally {
            setIsSearchingClients(false);
        }
    }, []);
    
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchClientsForSearch(searchClientQuery);
        }, 500); 

        return () => clearTimeout(delayDebounceFn);
    }, [searchClientQuery, fetchClientsForSearch]);

    const handleSelectClient = (client) => {
        setSelectedClientId(client.id);
        setSearchClientQuery(client.nome_fantasia); 
        setClientList([]);

        setFormData(prev => ({
            ...prev,
            cliente_nome: client.nome_fantasia || client.razao_social || '',
            cliente_cnpj: client.cnpj || '',
            responsavel: client.responsavel_contato || prev.responsavel,
            cliente_endereco: client.endereco || prev.cliente_endereco,
            cliente_bairro: client.bairro || prev.cliente_bairro,
            cliente_cidade: client.cidade || prev.cliente_cidade,
            cliente_estado: client.estado || prev.cliente_estado,
            cliente_cep: client.cep || prev.cliente_cep,
        }));
    };


    // ------------------------------------
    // LÓGICA DE FORMS (mantida)
    // ------------------------------------
    const handleChange = useCallback((e) => {
        const { id, value } = e.target;
        if (['data_inicio', 'data_fim', 'data_emissao'].includes(id) && value === '') {
            setFormData(prev => ({ ...prev, [id]: null }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    }, []);

    const handleTipoRelatorioChange = useCallback((e) => {
        setTipoRelatorio(e.target.value);
        setFormData(prevState => ({ ...prevState, medicoes_isolamento: [], medicoes_batimento: [], pecas_atuais: [] }));
    }, []);

    const handleMedicoesIsolamentoChange = useCallback((newMedicoes) => { setFormData(prevState => ({ ...prevState, medicoes_isolamento: newMedicoes })); }, []);
    const handleMedicoesBatimentoChange = useCallback((newMedicoes) => { setFormData(prevState => ({ ...prevState, medicoes_batimento: newMedicoes })); }, []);
    const handlePecasChange = useCallback((newPecas) => { setFormData(prevState => ({ ...prevState, pecas_atuais: newPecas })); }, []);
    const handleClienteLogoUpload = useCallback((e) => { const file = e.target.files[0]; setClienteLogo(file); }, []);
    
    const handleNextStep = useCallback(() => {
        if (!tipoRelatorio) { notifyError('Por favor, selecione o Tipo de Relatório.'); return; }
        if (!formData.os_numero) { notifyError('Por favor, preencha o campo "Número da O.S." (Obrigatório).'); return; }
        setStep(2);
    }, [tipoRelatorio, formData.os_numero]);

    const handlePreviousStep = useCallback(() => {
        setStep(1);
    }, []);

    // ------------------------------------
    // SUBMISSÃO (AJUSTADA: ORÇAMENTO REMOVIDO)
    // ------------------------------------
    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        if (!formData.os_numero) { notifyError('O Número da O.S. é obrigatório.'); return; }
        if (!tipoRelatorio) { notifyError('O Tipo de Relatório é obrigatório.'); return; }

        const taken = getTotalPhotosTaken();
        const expected = getTotalExpectedPhotos();
        if (taken < expected) {
            notifyError(`Faltam ${expected - taken} foto(s) obrigatória(s).`);
            return;
        }

        setIsLoading(true);

        try {
            const data = new FormData();

            // 1. PREPARAÇÃO DOS DADOS DO FORMULÁRIO
            Object.keys(formData).forEach(key => {
                const value = formData[key];
                if (Array.isArray(value)) {
                    data.append(key, JSON.stringify(value));
                } else if (typeof value === 'string') {
                    data.append(key, value);
                }
            });
            
            data.append('tipo_relatorio', tipoRelatorio);
            data.append('cliente_id', selectedClientId || ''); 

            // 🚨 REMOVIDA A ADIÇÃO DE pecas_cotadas e servicos_cotados AQUI

            // 2. ADICIONA O LOGO E FOTOS
            if (clienteLogo) {
                data.append('cliente_logo', clienteLogo, clienteLogo.name);
            }

            const allPhotos = [
                ...metodologiaPhotos,
                ...batimentoPhotos,
                ...bobinaCarcaçaPhotos,
                ...pecasAtuaisPhotos
            ].filter(p => p.file);

            const photoMetadata = [];

            allPhotos.forEach((photo) => {
                data.append(`photos`, photo.file);
                photoMetadata.push({
                    section: photo.section,
                    description: photo.description || '',
                    original_filename: photo.file.name
                });
            });

            data.append('photo_metadata', JSON.stringify(photoMetadata));

            // 3. ENVIO DOS DADOS
            const postUrl = API_ENDPOINTS.RELATORIOS; 
            const postResponse = await fetch(postUrl, {
                method: 'POST',
                body: data,
            });

            if (!postResponse.ok) {
                const errorText = await postResponse.text();
                throw new Error(`Erro ao criar Relatório. Status: ${postResponse.status}. Detalhe: ${errorText.substring(0, 100)}`);
            }

            const postResult = await postResponse.json();
            const pdfUrl = postResult.pdfUrl;

            if (!pdfUrl) {
                throw new Error('O servidor não retornou a URL do PDF (campo pdfUrl ausente).');
            }

            notifySuccess('Relatório gerado! Abrindo PDF em nova aba...');
            window.open(pdfUrl, '_blank');

        } catch (error) {
            logger.error('Erro ao gerar relatório:', error);
            let errorMessage = error.message || 'Ocorreu um erro desconhecido.';
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                errorMessage = 'Falha de conexão: Verifique se o servidor backend (porta 3001) está ativo e o CORS.';
            }
            notifyError(`Erro ao criar o relatório: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="container">
            <div className="header">
                <h1>Criar Novo Relatório Técnico</h1>
                <p>Preencha os dados abaixo para gerar o relatório.</p>
            </div>

            <form onSubmit={handleFinalSubmit}>
                {step === 1 && (
                    <div id="step-one">
                        <div className="section">
                            <h2>1. Dados do Cliente e da O.S.</h2>
                            <div className="form-group"><label htmlFor="os_numero">Número da O.S.:</label><input type="text" id="os_numero" value={formData.os_numero} onChange={handleChange} required /></div>
                            <div className="form-group"><label htmlFor="numero_rte">Número RTE:</label><input type="text" id="numero_rte" value={formData.numero_rte} onChange={handleChange} /></div>
                            <div className="form-group"><label htmlFor="titulo_relatorio">Título do Relatório:</label><input type="text" id="titulo_relatorio" value={formData.titulo_relatorio} onChange={handleChange} /></div>
                            
                            
                            {/* === BLOCO DE BUSCA DE CLIENTE === */}
                            <div className="form-group" style={{ marginBottom: clientList.length > 0 ? '150px' : '15px' }}>
                                <label htmlFor="search_client">Buscar Cliente Cadastrado (Nome/CNPJ):</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        id="search_client"
                                        value={searchClientQuery}
                                        onChange={(e) => setSearchClientQuery(e.target.value)}
                                        placeholder="Comece a digitar o nome ou CNPJ"
                                    />
                                    {isSearchingClients && <p style={{ color: '#4a90e2', fontSize: '10px', margin: '5px 0 0 0' }}>Buscando...</p>}
                                    
                                    {/* Dropdown de Sugestões */}
                                    {clientList.length > 0 && (
                                        <div style={{ 
                                            position: 'absolute', 
                                            zIndex: 100, 
                                            backgroundColor: '#333', 
                                            border: '1px solid #4a90e2', 
                                            width: '100%', 
                                            maxHeight: '200px', 
                                            overflowY: 'auto'
                                        }}>
                                            {clientList.map(client => (
                                                <div 
                                                    key={client.id} 
                                                    onClick={() => handleSelectClient(client)}
                                                    style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #444', color: '#ccc' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#444'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#333'}
                                                >
                                                    <strong>{client.nome_fantasia}</strong> ({client.cnpj})
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <h3 style={{ marginTop: clientList.length > 0 ? '15px' : '0' }}>Dados do Cliente (Preenchimento Automático)</h3>

                            {/* Campos preenchidos (mantidos para o usuário poder ajustar) */}
                            <div className="form-group">
                                <label htmlFor="cliente_nome">Nome/Razão Social:</label>
                                <input type="text" id="cliente_nome" value={formData.cliente_nome} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cliente_cnpj">CNPJ:</label>
                                <input type="text" id="cliente_cnpj" value={formData.cliente_cnpj} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="responsavel">Responsável:</label>
                                <input type="text" id="responsavel" value={formData.responsavel} onChange={handleChange} />
                            </div>
                            
                            {/* --- Restante do seu bloco step 1 --- */}

                            <div className="form-group"><label htmlFor="art">ART:</label><input type="text" id="art" value={formData.art} onChange={handleChange} /></div>
                            
                            <h3>1.1. Endereço do Cliente</h3>
                            <div className="form-row">
                                <div className="form-group"><label htmlFor="cliente_endereco">Endereço:</label><input type="text" id="cliente_endereco" value={formData.cliente_endereco} onChange={handleChange} /></div>
                                <div className="form-group"><label htmlFor="cliente_bairro">Bairro:</label><input type="text" id="cliente_bairro" value={formData.cliente_bairro} onChange={handleChange} /></div>
                            </div>
                            <div className="form-row">
                                <div className="form-group"><label htmlFor="cliente_cidade">Cidade:</label><input type="text" id="cliente_cidade" value={formData.cliente_cidade} onChange={handleChange} /></div>
                                <div className="form-group"><label htmlFor="cliente_estado">Estado:</label><input type="text" id="cliente_estado" value={formData.cliente_estado} onChange={handleChange} /></div>
                                <div className="form-group"><label htmlFor="cliente_cep">CEP:</label><input type="text" id="cliente_cep" value={formData.cliente_cep} onChange={handleChange} /></div>
                            </div>
                        </div>
                        <div className="section">
                            <h2>1.2. Logo do Cliente</h2>
                            <div className="form-group file-upload-wrapper"><label htmlFor="cliente_logo" className="file-upload-label">Escolher arquivo</label><input type="file" id="cliente_logo" accept="image/*" onChange={handleClienteLogoUpload} /><span className="file-upload-filename">{clienteLogo ? clienteLogo.name : 'Nenhum arquivo escolhido'}</span></div>
                        </div>
                        <div className="section">
                            <h2>2. Datas do Serviço</h2>
                            <div className="form-row">
                                <div className="form-group"><label htmlFor="data_inicio">Início:</label><input type="date" id="data_inicio" value={formData.data_inicio} onChange={handleChange} /></div>
                                <div className="form-group"><label htmlFor="data_fim">Fim:</label><input type="date" id="data_fim" value={formData.data_fim} onChange={handleChange} /></div>
                                <div className="form-group"><label htmlFor="data_emissao">Data de Emissão:</label><input type="date" id="data_emissao" value={formData.data_emissao} onChange={handleChange} /></div>
                            </div>
                        </div>
                        <div className="section">
                            <h2>3. Tipo de Relatório</h2>
                            <div className="form-group"><label htmlFor="tipo_relatorio">Tipo de Relatório:</label><select id="tipo_relatorio" value={tipoRelatorio} onChange={handleTipoRelatorioChange} required><option value="">Selecione...</option><option value="Motor">Motor</option><option value="Bomba">Bomba</option></select></div>
                        </div>
                        <button type="button" onClick={handleNextStep} disabled={!tipoRelatorio || !formData.os_numero}>Próximo</button>
                    </div>
                )}

                {step === 2 && (
                    <div id="step-two">
                        {/* === CONTADOR GLOBAL DE FOTOS === */}
                        <div style={{
                            backgroundColor: '#2c2c2c',
                            padding: '16px',
                            borderRadius: '8px',
                            marginBottom: '24px',
                            textAlign: 'center',
                            border: '1px solid #444',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                        }}>
                            <p style={{
                                margin: 0,
                                fontSize: '1.1em',
                                fontWeight: '600',
                                color: getTotalPhotosTaken() === getTotalExpectedPhotos() ? '#28a745' : '#4a90e2'
                            }}>
                                {getTotalPhotosTaken()} de {getTotalExpectedPhotos()} fotos tiradas
                            </p>
                            {getTotalPhotosTaken() === getTotalExpectedPhotos() && (
                                <p style={{ margin: '8px 0 0', fontSize: '0.9em', color: '#aaa' }}>
                                    Todas as fotos obrigatórias foram adicionadas!
                                </p>
                            )}
                        </div>

                        {tipoRelatorio === 'Motor' && (
                            <>
                                <DynamicPhotoSection
                                    title="4. METODOLOGIA"
                                    onPhotosChange={setMetodologiaPhotos}
                                    section="metodologia"
                                    fixedSlots={FIXED_PHOTO_SLOTS.metodologia}
                                />
                                <DynamicPhotoSection
                                    title="5. BATIMENTO RADIAL"
                                    onPhotosChange={setBatimentoPhotos}
                                    section="batimento"
                                    fixedSlots={FIXED_PHOTO_SLOTS.batimento}
                                />
                                <DynamicPhotoSection
                                    title="6. MEDIDA ENTRE BOBINA E CARCAÇA"
                                    onPhotosChange={setBobinaCarcaçaPhotos}
                                    section="bobina_carcaca"
                                    fixedSlots={FIXED_PHOTO_SLOTS.bobina_carcaca}
                                />
                                <DynamicPhotoSection
                                    title="7. PEÇAS ATUAIS"
                                    onPhotosChange={setPecasAtuaisPhotos}
                                    section="pecas_atuais"
                                    fixedSlots={FIXED_PHOTO_SLOTS.pecas_atuais}
                                />
                                <div className="section">
                                    <h2>8. Medições</h2>
                                    <h3>Medições de Resistência da Isolação</h3>
                                    <MedicoesResistencia onMedicoesChange={handleMedicoesIsolamentoChange} />
                                    <h3>Medições de Batimento Radial</h3>
                                    <MedicoesBatimento onMedicoesChange={handleMedicoesBatimentoChange} />
                                </div>
                            </>
                        )}

                        {tipoRelatorio === 'Bomba' && (
                            <>
                                <DynamicPhotoSection
                                    title="4. METODOLOGIA"
                                    onPhotosChange={setMetodologiaPhotos}
                                    section="metodologia"
                                    fixedSlots={FIXED_PHOTO_SLOTS.metodologia}
                                />
                                <DynamicPhotoSection
                                    title="5. PEÇAS ATUAIS"
                                    onPhotosChange={setPecasAtuaisPhotos}
                                    section="pecas_atuais"
                                    fixedSlots={FIXED_PHOTO_SLOTS.pecas_atuais}
                                />
                                <div className="section">
                                    <h2>6. Medições</h2>
                                    <h3>Peças Atuais</h3>
                                    <PecasAtuais onPecasChange={handlePecasChange} />
                                </div>
                            </>
                        )}
                        
                        {/* 🚨 SEÇÃO DE ORÇAMENTO (BudgetSection) REMOVIDA DAQUI 🚨 */}

                        {/* === SEÇÃO COMUM A AMBOS (Descrições) === */}
                        <div className="section">
                            {/* Renumerado de 11 para 9 */}
                            <h2 style={{marginTop: '40px'}}>9. Descrição Técnica</h2>
                            <div className="form-group">
                                <label htmlFor="descricao">Descrição:</label>
                                <textarea
                                    id="descricao"
                                    value={formData.descricao}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Descreva o serviço realizado..."
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="objetivo">Objetivo:</label>
                                <textarea
                                    id="objetivo"
                                    value={formData.objetivo}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Qual era o objetivo do serviço?"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="causas_danos">Causas dos Danos:</label>
                                <textarea
                                    id="causas_danos"
                                    value={formData.causas_danos}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Descreva as causas identificadas..."
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="conclusao">Conclusão:</label>
                                <textarea
                                    id="conclusao"
                                    value={formData.conclusao}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Conclusão final do relatório..."
                                />
                            </div>
                        </div>

                        <div className="section">
                            {/* Renumerado de 12 para 10 */}
                            <h2>10. Aprovação</h2>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="elaborado_por">Elaborado por:</label>
                                    <input
                                        type="text"
                                        id="elaborado_por"
                                        value={formData.elaborado_por}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="checado_por">Checado por:</label>
                                    <input
                                        type="text"
                                        id="checado_por"
                                        value={formData.checado_por}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="aprovado_por">Aprovado por:</label>
                                    <input
                                        type="text"
                                        id="aprovado_por"
                                        value={formData.aprovado_por}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* === BOTÕES DE NAVEGAÇÃO E SUBMISSÃO === */}
                        <div className="form-group" style={{ marginTop: '30px', display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
                            <button type="button" onClick={handlePreviousStep} className="btn-secondary">
                                Voltar
                            </button>
                            <button type="submit" disabled={isLoading} className="btn-primary">
                                {isLoading ? 'Gerando Relatório...' : 'Gerar Relatório e Abrir PDF'}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

export default CreateReportForm;