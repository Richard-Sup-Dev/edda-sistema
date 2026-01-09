import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios'; 
import "@/styles/App.css";
import { API_ENDPOINTS, logger } from "@/config/api";
import { notifySuccess, notifyError } from "@/utils/notifications";
import { 
    FileText, Calendar, User, MapPin, Building2, 
    Camera, Upload, CheckCircle2, AlertCircle,
    ClipboardList, DollarSign, FileCheck
} from 'lucide-react';
import MedicoesResistencia from "@/features/reports/components/MedicoesResistencia";
import MedicoesBatimento from "@/features/reports/components/MedicoesBatimento";
import PecasAtuais from "@/features/reports/components/PecasAtuais";
import DynamicPhotoSection from "@/components/ui/DynamicPhotoSection";
import BudgetSection from '@/features/finance/components/BudgetSection';

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
    
    // Estados para Orçamento (Peças e Serviços Cotados)
    const [pecasCotadas, setPecasCotadas] = useState([]);
    const [servicosCotados, setServicosCotados] = useState([]);

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
    
    // Handlers para Orçamento
    const handlePecasCotadasChange = useCallback((pecas) => { setPecasCotadas(pecas); }, []);
    const handleServicosCotadosChange = useCallback((servicos) => { setServicosCotados(servicos); }, []);
    
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

            // Adiciona Orçamento (Peças e Serviços Cotados)
            data.append('pecas_cotadas', JSON.stringify(pecasCotadas));
            data.append('servicos_cotados', JSON.stringify(servicosCotados));

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
        <div className="max-w-6xl mx-auto">
            {/* Header Profissional */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <FileText className="w-6 h-6 text-orange-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Criar Novo Relatório Técnico</h1>
                </div>
                <p className="text-gray-600 ml-14">Preencha os dados abaixo para gerar o relatório profissional em PDF</p>
                
                {/* Indicador de Progresso */}
                <div className="mt-6 flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                        step === 1 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    }`}>
                        {step === 1 ? (
                            <><ClipboardList className="w-4 h-4" /> <span className="font-semibold">Etapa 1: Dados Gerais</span></>
                        ) : (
                            <><CheckCircle2 className="w-4 h-4" /> <span className="font-semibold">Etapa 1 Concluída</span></>
                        )}
                    </div>
                    <div className="h-px flex-1 bg-gray-300" />
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                        step === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-400'
                    }`}>
                        <Camera className="w-4 h-4" />
                        <span className="font-semibold">Etapa 2: Detalhes Técnicos</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleFinalSubmit}>
                {step === 1 && (
                    <div id="step-one" className="space-y-6">
                        {/* Card: Dados da O.S. */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                                <FileText className="w-5 h-5 text-orange-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Identificação da Ordem de Serviço</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="form-group">
                                    <label htmlFor="os_numero" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <FileCheck className="w-4 h-4 text-orange-500" />
                                        Número da O.S. <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        id="os_numero" 
                                        value={formData.os_numero} 
                                        onChange={handleChange} 
                                        required 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Ex: OS-2024-001"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="numero_rte" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                        Número RTE
                                    </label>
                                    <input 
                                        type="text" 
                                        id="numero_rte" 
                                        value={formData.numero_rte} 
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Ex: RTE-001"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="titulo_relatorio" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <ClipboardList className="w-4 h-4 text-gray-500" />
                                        Título do Relatório
                                    </label>
                                    <input 
                                        type="text" 
                                        id="titulo_relatorio" 
                                        value={formData.titulo_relatorio} 
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Ex: Inspeção Preventiva"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Card: Busca de Cliente */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                                <Building2 className="w-5 h-5 text-orange-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Informações do Cliente</h2>
                            </div>
                            
                            {/* Busca de Cliente */}
                            <div className="form-group mb-6" style={{ marginBottom: clientList.length > 0 ? '150px' : '24px' }}>
                                <label htmlFor="search_client" className="text-sm font-medium text-gray-700 mb-2 block">
                                    🔍 Buscar Cliente Cadastrado (Nome ou CNPJ)
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        id="search_client"
                                        value={searchClientQuery}
                                        onChange={(e) => setSearchClientQuery(e.target.value)}
                                        placeholder="Digite pelo menos 3 caracteres para buscar..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                            
                            {/* Dados preenchidos automaticamente */}
                            <div className="space-y-4">
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <p className="text-sm text-blue-800 mb-3 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>Os campos abaixo são preenchidos automaticamente quando você seleciona um cliente acima</span>
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label htmlFor="cliente_nome" className="text-sm font-medium text-gray-700 mb-2 block">
                                            Nome/Razão Social <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            id="cliente_nome" 
                                            value={formData.cliente_nome} 
                                            onChange={handleChange} 
                                            required 
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="Nome do cliente"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="cliente_cnpj" className="text-sm font-medium text-gray-700 mb-2 block">
                                            CNPJ <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            id="cliente_cnpj" 
                                            value={formData.cliente_cnpj} 
                                            onChange={handleChange} 
                                            required 
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="00.000.000/0000-00"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="responsavel" className="text-sm font-medium text-gray-700 mb-2 block">
                                            Responsável
                                        </label>
                                        <input 
                                            type="text" 
                                            id="responsavel" 
                                            value={formData.responsavel} 
                                            onChange={handleChange} 
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="Nome do responsável"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="art" className="text-sm font-medium text-gray-700 mb-2 block">
                                            ART
                                        </label>
                                        <input 
                                            type="text" 
                                            id="art" 
                                            value={formData.art} 
                                            onChange={handleChange} 
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="Número da ART"
                                        />
                                    </div>
                                </div>
                                
                                {/* Endereço do Cliente */}
                                <div className="mt-6">
                                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-orange-600" />
                                        Endereço do Cliente
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-group md:col-span-2">
                                            <label htmlFor="cliente_endereco" className="text-sm font-medium text-gray-700 mb-2 block">
                                                Endereço
                                            </label>
                                            <input 
                                                type="text" 
                                                id="cliente_endereco" 
                                                value={formData.cliente_endereco} 
                                                onChange={handleChange} 
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Logradouro"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cliente_bairro" className="text-sm font-medium text-gray-700 mb-2 block">
                                                Bairro
                                            </label>
                                            <input 
                                                type="text" 
                                                id="cliente_bairro" 
                                                value={formData.cliente_bairro} 
                                                onChange={handleChange} 
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Bairro"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cliente_cidade" className="text-sm font-medium text-gray-700 mb-2 block">
                                                Cidade
                                            </label>
                                            <input 
                                                type="text" 
                                                id="cliente_cidade" 
                                                value={formData.cliente_cidade} 
                                                onChange={handleChange} 
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Cidade"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cliente_estado" className="text-sm font-medium text-gray-700 mb-2 block">
                                                Estado (UF)
                                            </label>
                                            <input 
                                                type="text" 
                                                id="cliente_estado" 
                                                value={formData.cliente_estado} 
                                                onChange={handleChange} 
                                                maxLength={2}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="SP"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cliente_cep" className="text-sm font-medium text-gray-700 mb-2 block">
                                                CEP
                                            </label>
                                            <input 
                                                type="text" 
                                                id="cliente_cep" 
                                                value={formData.cliente_cep} 
                                                onChange={handleChange} 
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="00000-000"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Card: Logo do Cliente */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                                <Upload className="w-5 h-5 text-orange-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Logo do Cliente</h2>
                            </div>
                            <div className="flex items-center gap-4">
                                <label htmlFor="cliente_logo" className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg cursor-pointer transition-colors flex items-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    Escolher Arquivo
                                </label>
                                <input 
                                    type="file" 
                                    id="cliente_logo" 
                                    accept="image/*" 
                                    onChange={handleClienteLogoUpload} 
                                    className="hidden"
                                />
                                <span className="text-sm text-gray-600">
                                    {clienteLogo ? `✓ ${clienteLogo.name}` : 'Nenhum arquivo escolhido'}
                                </span>
                            </div>
                        </div>
                        
                        {/* Card: Datas do Serviço */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                                <Calendar className="w-5 h-5 text-orange-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Datas do Serviço</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="form-group">
                                    <label htmlFor="data_inicio" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-orange-500" />
                                        Data de Início
                                    </label>
                                    <input 
                                        type="date" 
                                        id="data_inicio" 
                                        value={formData.data_inicio} 
                                        onChange={handleChange}
                                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                        min="2020-01-01"
                                        max="2030-12-31"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="data_fim" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-orange-500" />
                                        Data de Término
                                    </label>
                                    <input 
                                        type="date" 
                                        id="data_fim" 
                                        value={formData.data_fim} 
                                        onChange={handleChange}
                                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                        min="2020-01-01"
                                        max="2030-12-31"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="data_emissao" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-orange-500" />
                                        Data de Emissão
                                    </label>
                                    <input 
                                        type="date" 
                                        id="data_emissao" 
                                        value={formData.data_emissao} 
                                        onChange={handleChange}
                                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                        min="2020-01-01"
                                        max="2030-12-31"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Card: Tipo de Relatório */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                                <FileText className="w-5 h-5 text-orange-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Tipo de Relatório</h2>
                            </div>
                            <div className="form-group">
                                <label htmlFor="tipo_relatorio" className="text-sm font-medium text-gray-700 mb-2 block">
                                    Selecione o tipo <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    id="tipo_relatorio" 
                                    value={tipoRelatorio} 
                                    onChange={handleTipoRelatorioChange} 
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Motor">Motor</option>
                                    <option value="Bomba">Bomba</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Botão Próximo */}
                        <div className="flex justify-end">
                            <button 
                                type="button" 
                                onClick={handleNextStep} 
                                disabled={!tipoRelatorio || !formData.os_numero}
                                className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                Próximo <CheckCircle2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div id="step-two" className="space-y-6">
                        {/* Contador Global de Fotos - Card Melhorado */}
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300 rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Camera className="w-8 h-8 text-orange-600" />
                                    <div>
                                        <p className="text-lg font-bold text-gray-900">
                                            {getTotalPhotosTaken()} de {getTotalExpectedPhotos()} fotos obrigatórias
                                        </p>
                                        {getTotalPhotosTaken() === getTotalExpectedPhotos() ? (
                                            <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Todas as fotos foram adicionadas!
                                            </p>
                                        ) : (
                                            <p className="text-sm text-orange-700 mt-1">
                                                Faltam {getTotalExpectedPhotos() - getTotalPhotosTaken()} foto(s)
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-orange-600">
                                        {Math.round((getTotalPhotosTaken() / getTotalExpectedPhotos()) * 100)}%
                                    </div>
                                    <div className="text-xs text-gray-600">Completo</div>
                                </div>
                            </div>
                            {/* Barra de Progresso */}
                            <div className="mt-4 h-2 bg-white rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300"
                                    style={{ width: `${(getTotalPhotosTaken() / getTotalExpectedPhotos()) * 100}%` }}
                                />
                            </div>
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
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                                        <ClipboardList className="w-5 h-5 text-orange-600" />
                                        <h2 className="text-lg font-semibold text-gray-900">8. Medições</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="font-medium text-gray-900 mb-3">Medições de Resistência da Isolação</h3>
                                            <MedicoesResistencia onMedicoesChange={handleMedicoesIsolamentoChange} />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 mb-3">Medições de Batimento Radial</h3>
                                            <MedicoesBatimento onMedicoesChange={handleMedicoesBatimentoChange} />
                                        </div>
                                    </div>
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
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                                        <ClipboardList className="w-5 h-5 text-orange-600" />
                                        <h2 className="text-lg font-semibold text-gray-900">6. Medições</h2>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-3">Peças Atuais</h3>
                                        <PecasAtuais onPecasChange={handlePecasChange} />
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {/* === SEÇÃO DE ORÇAMENTO === */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                                <DollarSign className="w-5 h-5 text-orange-600" />
                                <h2 className="text-lg font-semibold text-gray-900">9. Orçamento</h2>
                            </div>
                            <BudgetSection 
                                onPecasCotadasChange={handlePecasCotadasChange}
                                onServicosCotadosChange={handleServicosCotadosChange}
                                initialPecas={[]}
                                initialServicos={[]}
                            />
                        </div>

                        {/* === SEÇÃO COMUM A AMBOS (Descrições) === */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                                <FileText className="w-5 h-5 text-orange-600" />
                                <h2 className="text-lg font-semibold text-gray-900">10. Descrição Técnica</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="form-group">
                                    <label htmlFor="descricao" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Descrição do Serviço
                                    </label>
                                    <textarea
                                        id="descricao"
                                        value={formData.descricao}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Descreva o serviço realizado..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="objetivo" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Objetivo
                                    </label>
                                    <textarea
                                        id="objetivo"
                                        value={formData.objetivo}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Qual era o objetivo do serviço?"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="causas_danos" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Causas dos Danos
                                    </label>
                                    <textarea
                                        id="causas_danos"
                                        value={formData.causas_danos}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Descreva as causas identificadas..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="conclusao" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Conclusão
                                    </label>
                                    <textarea
                                        id="conclusao"
                                        value={formData.conclusao}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Conclusão final do relatório..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                                <User className="w-5 h-5 text-orange-600" />
                                <h2 className="text-lg font-semibold text-gray-900">11. Aprovação</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="form-group">
                                    <label htmlFor="elaborado_por" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Elaborado por
                                    </label>
                                    <input
                                        type="text"
                                        id="elaborado_por"
                                        value={formData.elaborado_por}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Nome do elaborador"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="checado_por" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Checado por
                                    </label>
                                    <input
                                        type="text"
                                        id="checado_por"
                                        value={formData.checado_por}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Nome do revisor"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="aprovado_por" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Aprovado por
                                    </label>
                                    <input
                                        type="text"
                                        id="aprovado_por"
                                        value={formData.aprovado_por}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Nome do aprovador"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* === BOTÕES DE NAVEGAÇÃO E SUBMISSÃO === */}
                        <div className="flex items-center justify-between pt-6">
                            <button 
                                type="button" 
                                onClick={handlePreviousStep} 
                                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors flex items-center gap-2"
                            >
                                ← Voltar
                            </button>
                            <button 
                                type="submit" 
                                disabled={isLoading} 
                                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Gerando Relatório...
                                    </>
                                ) : (
                                    <>
                                        <FileCheck className="w-5 h-5" />
                                        Gerar Relatório PDF
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

export default CreateReportForm;