// src/middlewares/validateRequest.js
/**
 * Middleware genérico para validar requisições com Joi
 * Uso: validateRequest(clienteSchema) como middleware de rota
 */
export const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];
    
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errors = error.details.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));

      return res.status(400).json({
        erro: 'Validação falhou',
        detalhes: errors
      });
    }

    // Substitui o dados originais pelos dados validados
    req[source] = value;
    next();
  };
};

export default validateRequest;
