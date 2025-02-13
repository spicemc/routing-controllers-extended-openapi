import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import { Express } from 'express'
import 'reflect-metadata'
import {
  createExpressServer,
  getMetadataArgsStorage,
} from 'routing-controllers-extended'
import { routingControllersToSpec } from 'routing-controllers-extended-openapi'
import * as swaggerUiExpress from 'swagger-ui-express'
import { UsersController } from './UsersController'

const { defaultMetadataStorage } = require('class-transformer/cjs/storage')

const routingControllersOptions = {
  controllers: [UsersController],
  routePrefix: '/api',
}
const app: Express = createExpressServer(routingControllersOptions)

// Parse class-validator classes into JSON Schema:
const schemas = validationMetadatasToSchemas({
  classTransformerMetadataStorage: defaultMetadataStorage,
  refPointerPrefix: '#/components/schemas/',
})

// Parse routing-controllers classes into OpenAPI spec:
const storage = getMetadataArgsStorage()
const spec = routingControllersToSpec(storage, routingControllersOptions, {
  components: {
    schemas,
    securitySchemes: {
      basicAuth: {
        scheme: 'basic',
        type: 'http',
      },
    },
  },
  info: {
    description: 'Generated with `routing-controllers-extended-openapi`',
    title: 'A sample API',
    version: '1.0.0',
  },
})

app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec))

// Render spec on root:
app.get('/', (_req, res) => {
  res.json(spec)
})

app.listen(3001)
console.log(
  'Express server is running on port 3001. Open http://localhost:3001/docs/'
)
