declare module 'yup' {
    interface StringSchema<TType, TContext, TDefault, TFlags> {
        ObjectId(message?: string): StringSchema;
    }
}

export { }