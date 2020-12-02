export default {
  "compilerOptions": {
    "module": "esnext",
    "noImplicitAny": false,
    "removeComments": false,
    "preserveConstEnums": true,
    "sourceMap": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "**/*.spec.ts",
    "**/*.test.ts"
  ],
  "paths": {
    "@config": ["./config"],
    "@config/*": ["./config/*"],
    "@db": ["./db"],
    "@db/*": ["./db/*"],
    "@generators": ["./src/generators"],
    "@generators/*": ["./src/generators/*"],
    }
}
