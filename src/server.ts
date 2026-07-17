import app from './app'
import 'dotenv/config'
import logger from './shared/lib/logger'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`)
})
