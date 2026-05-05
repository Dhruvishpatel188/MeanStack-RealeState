// zodValidationMiddleware --> validates req.body against a zod schema
// usage: router.post("/route", zodValidationMiddleware(schemaObject), controller.fn)

const zodValidationMiddleware = (schema) => {
    return (req, res, next) => {
        try {
            const result = schema.safeParse(req.body)
            if (!result.success) {
                // format zod errors into readable messages
                const errors = result.error.errors.map((e) => ({
                    field: e.path.join("."),
                    message: e.message,
                }))
                return res.status(400).json({
                    message: "Validation failed..",
                    errors: errors,
                })
            }
            // validation passed --> attach parsed data to req.body
            req.body = result.data
            next()
        } catch (err) {
            res.status(500).json({
                message: "Error in validation middleware..",
                err: err.message,
            })
        }
    }
}

module.exports = zodValidationMiddleware
