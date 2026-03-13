import { createApp } from './create-app.js'
import { env } from '../core/config/env.js'

const app = createApp()

app.listen(env.PORT, () => {
  console.log(`API listening on port ${env.PORT}`)
})
