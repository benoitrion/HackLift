import boom from 'boom';
/**
 * This middleware must block all requests coming from unauthorized clients
 * If clients don't pass this header:
 * Authorization: Bearer U3VwZXIgc2VjcmV0IHRva2VuIGRvIG5vdCBkaXN0cmlidXRlIHBseg==
 * They must receive a 401 and the request should not propagate any further
 */
export const authMiddleware = (req, res, next) => {
    if(!req.header('Authorization')
        || req.header('Authorization') !== 'Bearer U3VwZXIgc2VjcmV0IHRva2VuIGRvIG5vdCBkaXN0cmlidXRlIHBseg==') {
        const boomed = boom.unauthorized('You must provide correct header to view this page.')
        res.status(boomed.output.statusCode).json(boomed.output.payload);
        next();
    }
    next();
};
