const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const connection = mongoose.connect('mongodb://localhost/myapp', {
  useMongoClient: true,
  /* other options */
})



const schemaParser = ( schema ) => {

  const TYPE_PARSER = {
    'string': String,
    'integer': Number,
    'float': Number,
    'json': mongoose.Schema.Types.Mixed,
    'array': mongoose.Schema.Types.Array,
    'data': mongoose.Schema.Types.Date,
    'id': mongoose.Schema.Types.ObjectId,
    'default': String
  }

  const getParserToObject = ( parser ) => ( previus, key ) => {
    previus[ key ] = parser[ schema[ key ] ] || parser[ 'default' ]
    return previus
  }

  return Object.keys( schema ).reduce( getParserToObject( TYPE_PARSER ), schema )
}

module.exports = new Promise( ( resolve ) => {
  connection.then( db => resolve({
    db,
    schemaParser
  }))
})