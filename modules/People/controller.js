const CONTROLLER = ( Model ) => {

  this.list = ( { query, pagination } ) => {
    console.log( 'Parser em ação:', query, pagination )
    return Model.find( query )
  }

  this.create = ( { body } ) => 
    Model.create( body )

  this.update = ( { id, body } ) => 
    Model.update( { id }, body )

  this.delete = ( { id }, response ) => 
    Model.delete( {id} )
  
  return this
}

module.exports = CONTROLLER