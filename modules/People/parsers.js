const searchQuery = ( request ) => ({
  search : request.query.query
})

const getPaginationLimit = ( request ) => ({
  limit: getCompatiblePagination( request )
})

const getCompatiblePagination = ( request ) => {
  const limit = request.query.limit
  return ( limit > 30 )
    ? 30
    : ( limit < 1 )
      ? 1
      : limit
}

const pagination = ( request ) => {
  return {
    query: searchQuery( request ).search,
    pagination: { page: request.query.page, limit: getPaginationLimit( request ) }
  }
}

module.exports = {
  list: {
    request: pagination
  }
}