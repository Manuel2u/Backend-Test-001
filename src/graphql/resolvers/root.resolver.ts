const { GraphQLScalarType, Kind } = require('graphql');

const phoneScalar = new GraphQLScalarType({
    name: 'Phone',
    description: 'A custom scalar to validate Ghanaian phone numbers with exactly 10 digits, starting with 0',
    serialize(value) {
        if (/^0[0-9]{9}$/.test(value)) {
            return value;
        }
        throw new Error('Invalid phone number format. Must start with 0 and be exactly 10 digits.');
    },
    parseValue(value) {
        if (/^0[0-9]{9}$/.test(value)) {
            return value;
        }
        throw new Error('Phone number must start with 0 and be exactly 10 digits.');
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING && /^0[0-9]{9}$/.test(ast.value)) {
            return ast.value;
        }
        throw new Error('Phone number must be a string starting with 0 and exactly 10 digits.');
    }
});

const rootResolver = {
    Phone: phoneScalar
};

export default rootResolver;
