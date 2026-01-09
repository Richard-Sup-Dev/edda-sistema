/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       required:
 *         - cnpj
 *         - nome_fantasia
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-incrementado
 *         cnpj:
 *           type: string
 *           description: CNPJ do cliente
 *         nome_fantasia:
 *           type: string
 *           description: Nome fantasia
 *         razao_social:
 *           type: string
 *         endereco:
 *           type: string
 *         bairro:
 *           type: string
 *         cidade:
 *           type: string
 *         estado:
 *           type: string
 *         cep:
 *           type: string
 *         responsavel_contato:
 *           type: string
 *     
 *     Relatorio:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         os_numero:
 *           type: string
 *         cliente_id:
 *           type: integer
 *         tipo_relatorio:
 *           type: string
 *           enum: [Motor, Bomba]
 *         data_inicio:
 *           type: string
 *           format: date
 *         data_fim:
 *           type: string
 *           format: date
 *         descricao:
 *           type: string
 *         conclusao:
 *           type: string
 *     
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         error:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   - name: Autenticação
 *     description: Endpoints de autenticação
 *   - name: Clientes
 *     description: Gestão de clientes
 *   - name: Relatórios
 *     description: Gestão de relatórios técnicos
 *   - name: Peças
 *     description: Catálogo de peças
 *   - name: Serviços
 *     description: Catálogo de serviços
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Credenciais inválidas
 */

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Lista todos os clientes
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       201:
 *         description: Cliente criado
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /api/relatorios:
 *   get:
 *     summary: Lista todos os relatórios
 *     tags: [Relatórios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de relatórios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Relatorio'
 */
