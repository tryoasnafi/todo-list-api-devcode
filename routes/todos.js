'use strict'

const TodoController = require("../controllers/TodoController");

module.exports = async function (fastify, opts) {
  fastify.get('/todo-items', TodoController.all);
  fastify.get('/todo-items/:id', TodoController.getById);
  fastify.post('/todo-items', TodoController.create);
  fastify.patch('/todo-items/:id', TodoController.update);
  fastify.delete('/todo-items/:id', TodoController.delete);
}
