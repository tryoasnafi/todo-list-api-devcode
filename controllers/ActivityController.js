const db = require("../database/connection");
const Responses = require("../helpers/response");

const ActivityController = {
  all: async function (_, reply) {
    const connection = await db.getConnection();
    const [activities] = await connection.query('SELECT * FROM activities');
    connection.release();
    return reply.code(200).send(Responses.SUCCESS(activities))
  },

  getById: async function (request, reply) {
    const id = request.params.id;

    const connection = await db.getConnection();
    const [activities] = await connection.query('SELECT * FROM activities WHERE activities.id = ?  LIMIT 1', [id]);
    connection.release();

    if (activities.length === 0) {
      return reply.code(404).send(Responses.NOT_FOUND(`Activity with ID ${id} Not Found`));
    }

    return reply.code(200).send(Responses.SUCCESS(activities[0]));
  },

  create: async function (request, reply) {
    const { title, email } = request.body;

    if (!title || title.trim() === '') {
      return reply.code(400).send(Responses.BAD_REQUEST("title cannot be null"));
    }

    const connection = await db.getConnection();
    const [result] = await connection.query('INSERT INTO activities (title, email) VALUES (?, ?)', [title, email]);
    connection.release();

    reply.code(201).send(Responses.SUCCESS({
      "id": result.insertId,
      "title": title,
      "email": email,
      "created_at": new Date(),
      "updated_at": new Date()
    }));
  },

  update: async function (request, reply) {
    const id = request.params.id;
    const { title, email } = request.body || {};

    if (!title) {
      return reply.code(400).send(Responses.BAD_REQUEST("title cannot be null"));
    }

    const connection = await db.getConnection();
    const [activities] = await connection.query('SELECT id FROM activities WHERE activities.id = ?  LIMIT 1', [id]);

    if (activities.length === 0) {
      connection.release();
      return reply.code(404).send(Responses.NOT_FOUND(`Activity with ID ${id} Not Found`));
    }

    const updateData = { title, updated_at: new Date() }
    if (email) updateData.email = email;

    await db.query('UPDATE activities SET ? WHERE activities.id = ?', [updateData, id]);
    const [updatedActivities] = await connection.query('SELECT * FROM activities WHERE activities.id = ?  LIMIT 1', [id]);
    connection.release();

    return reply.code(200).send(Responses.SUCCESS(updatedActivities[0]));
  },

  delete: async function (request, reply) {
    const id = request.params.id;

    const connection = await db.getConnection();
    const [activities] = await connection.query('SELECT id FROM activities WHERE activities.id = ?  LIMIT 1', [id]);

    if (activities.length === 0) {
      connection.release();
      return reply.code(404).send(Responses.NOT_FOUND(`Activity with ID ${id} Not Found`));
    }

    connection.query('DELETE FROM activities WHERE activities.id = ?', [id]);
    connection.release();

    return reply.code(200).send(Responses.SUCCESS({}));
  }
}

module.exports = ActivityController