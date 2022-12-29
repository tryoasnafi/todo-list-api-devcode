'use strict'

const ActivityController = require("../controllers/ActivityController");

module.exports = async function (fastify, opts) {
  fastify.get('/activity-groups', ActivityController.all);
  fastify.get('/activity-groups/:id', ActivityController.getById);
  fastify.post('/activity-groups', ActivityController.create);
  fastify.patch('/activity-groups/:id', ActivityController.update);
  fastify.delete('/activity-groups/:id', ActivityController.delete);
}
