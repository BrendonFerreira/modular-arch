const express = require('express')
const app = express()

const MODULES = [
  require('./modules/People')
]

Promise.all( MODULES ).then( resolvedModules => {
  app.use( '/people', resolvedModules[0] )
  app.use( (req, res) => res.end() )
  app.listen( 3000 )
} )