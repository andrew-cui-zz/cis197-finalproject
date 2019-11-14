const express = require('express')
const path = require('path')
const app = express()
const db = require('../db/api')

// Install routers for all prefixes to certain routers
// app.use(require('/api', './server/routes/apirouter')(db))
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})
// Start server and create local port
app.listen(3000, () => console.log('listening on port 3000!'))