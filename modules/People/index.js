const CONFIG = require('./config')
const SCHEMA = Object.assign( {}, require('./schema') ) //////// PQ EU PRECISO DISSO???? ALGUEM ME EXPLICA
const MODEL = require('./model')
const express = require( 'express' )
const app = express()

const createRoutesAsync = ( MODEL, CONFIG ) => ( resolve ) => {
  if( isPromise( MODEL ) ){
    MODEL.then( model => { 
      const instantiatedRoutes = createRoutesInApp( app, CONFIG.routes, CONFIG.parsers, CONFIG.controller( model ) )
      resolve( instantiatedRoutes )
    })
  } else { 
    const instantiatedRoutes = createRoutesInApp( app, CONFIG.routes, CONFIG.parsers, CONFIG.controller( MODEL ) )
    instantiatedRoutes.get( '/info', ( z , res ) => responseJson( res )( { routes: CONFIG.routes, schema: SCHEMA } ) )
    resolve( instantiatedRoutes )
  }
}

const isParserDefined = ( action, option, parsers ) =>
  parsers && parsers[ action ] && parsers[ action ][ option ]

const getParser = ( action, option, parsers ) =>
  isParserDefined( action, option, parsers )
    ? parsers[ action ][ option ]
    : ( data ) => data
 

const responseJson = ( responseActioner ) => ( data ) => {
  responseActioner.set('Content-Type', 'application/json');
  responseActioner.send( JSON.stringify( data ) )
}

const injectResponseTransformer = ( parser, response ) =>
  Object.assign( response, {
    json: ( data ) => 
      responseJson( response )( parser( data ) )
  } )

const isPromise = ( object ) =>
  ( object.then )

const getControllerWithTransformers = ( routeName, parsers, controllerAction ) => 
  (request, response, next) => {
    const requestParser = getParser( routeName, 'request', parsers)
    const responseParser = getParser( routeName, 'response', parsers)
    const responseWithTransformer = injectResponseTransformer( responseParser, response )
    const requestTransformed = requestParser( request )
    const action = controllerAction( requestTransformed, responseWithTransformer, next)
  
    // console.log( action )
    /// if action reults in an promise, then resolve the promise
    if( isPromise( action ) ) {
      action.then( (result) => {
        responseWithTransformer.json( result )
      } ).catch( ( error ) => {
        responseWithTransformer.error( error )
      } )
    }

  }
  

const createRoutesInApp = ( app, routes, parsers, controller ) => {
  routes.map( ( route ) => {
    app[ route.method ]( route.path, getControllerWithTransformers( route.name, parsers, controller[ route.name ] ) )
  } )
  return app
}

module.exports = new Promise( createRoutesAsync( MODEL, CONFIG ) )