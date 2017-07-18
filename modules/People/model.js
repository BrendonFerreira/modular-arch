const database = require( '../../config/database' )
const CONFIG = require( './config' )

module.exports = new Promise( ( resolve ) => {
  database.then( ( { db, schemaParser } ) => {
    resolve( db.model( CONFIG.name, schemaParser( CONFIG.schema ) ) )  
  } )
} )