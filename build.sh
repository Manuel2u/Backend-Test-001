rm -rf dist
tsc -p .
ls -l dist
mkdir -p dist/src/graphql/schemas/
mkdir -p dist/src/config/
mkdir -p dist/src/migrations/
cp src/graphql/schemas/*.graphql dist/src/graphql/schemas/
cp src/config/database.js dist/src/config/
cp src/migrations/* dist/src/migrations/