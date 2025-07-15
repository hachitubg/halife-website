const express = require('express')
const path = require('path')
const history = require('connect-history-api-fallback')

const app = express()
const port = process.env.PORT || 3000

// Handle client-side routing
app.use(history({
  index: '/index.html'
}))

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')))

// Handle any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`)
})