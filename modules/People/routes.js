module.exports = [{ 
  path: '/',
  method: 'get',
  name: 'list'
}, {
  path: '/',
  method: 'post',
  name: 'create'
}, {
  path: '/:id',
  method: 'put',
  name: 'update'
}, {
  path: '/:id',
  method: 'delete',
  name: 'delete'
}]