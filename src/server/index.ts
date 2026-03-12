import { createApp } from './http/create-app.js'
import { env } from './config/env.js'

const app = createApp()

app.listen(env.PORT, () => {
  console.log(`API listening on port ${env.PORT}`)
})
