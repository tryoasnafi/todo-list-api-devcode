const db = require("../database/connection");
const Responses = require("../helpers/response");

const TodoController = {
  all: async function (request, reply) {
    const activityGroupId = request.query.activity_group_id;

    let query = 'SELECT * FROM todos';
    let values = [];

    if (activityGroupId) {
      query = 'SELECT * FROM todos WHERE activity_group_id = ?';
      values[0] = activityGroupId;
    }

    const connection = await db.getConnection();
    const [todos] = await connection.query(query, values);
    connection.release();

    return reply.code(200).send(Responses.SUCCESS(todos));
  },

  getById: async function (request, reply) {
    const id = request.params.id;

    const connection = await db.getConnection();
    const [todos] = await connection.query('SELECT * FROM todos WHERE todos.id = ? LIMIT 1', [id]);
    connection.release();

    if (todos.length === 0) {
      return reply.code(404).send(Responses.NOT_FOUND(`Todo with ID ${id} Not Found`));
    }

    return reply.code(200).send(Responses.SUCCESS(todos[0]));
  },

  create: async function (request, reply) {
    const { title, activity_group_id } = request.body || {};

    const is_active = request.body?.is_active ?? true;
    const priority = request.body?.priority ?? 'very-high';

    if (!title || title.trim() === '') {
      return reply.code(400).send(Responses.BAD_REQUEST("title cannot be null"));
    }

    if (!activity_group_id) {
      return reply.code(400).send(Responses.BAD_REQUEST("activity_group_id cannot be null"));
    }

    const connection = await db.getConnection();
    const [result] = await connection.query('INSERT INTO todos (activity_group_id, title, is_active, priority) VALUES (?, ?, ?, ?)', [activity_group_id, title, is_active, priority]);
    const [todos] = await connection.query('SELECT * FROM todos WHERE todos.id = ? LIMIT 1', [result.insertId]);
    connection.release();

    todos[0].is_active = todos[0].is_active ? true : false;

    return reply.code(201).send(Responses.SUCCESS(todos[0]));
  },

  update: async function (request, reply) {
    const id = request.params.id;
    const { activity_group_id, title, is_active, priority } = request.body || {};

    if (!request?.body) {
      return reply.code(400).send(Responses.BAD_REQUEST("Request body cannot be null"));
    }

    const connection = await db.getConnection();
    const [todos] = await connection.query('SELECT id FROM todos WHERE todos.id = ?  LIMIT 1', [id]);

    if (todos.length === 0) {
      connection.release();
      return reply.code(404).send(Responses.NOT_FOUND(`Todo with ID ${id} Not Found`));
    }

    const updateData = { updated_at: new Date() }
    if (activity_group_id) updateData.activity_group_id = activity_group_id;
    if (title) updateData.title = title;
    if (is_active) updateData.is_active = is_active;
    if (priority) updateData.priority = priority;

    await connection.query('UPDATE todos SET ? WHERE todos.id = ?', [updateData, id]);
    const [updatedTodos] = await connection.query('SELECT * FROM todos WHERE todos.id = ? LIMIT 1', [id]);
    connection.release();

    updatedTodos[0].is_active === 1 ? true : false;

    return reply.code(200).send(Responses.SUCCESS(updatedTodos[0]));
  },

  delete: async function (request, reply) {
    const id = request.params.id;

    const connection = await db.getConnection();
    const [todos] = await connection.query('SELECT id FROM todos WHERE todos.id = ?  LIMIT 1', [id]);

    if (todos.length === 0) {
      connection.release();
      return reply.code(404).send(Responses.NOT_FOUND(`Todo with ID ${id} Not Found`));
    }

    connection.query('DELETE FROM todos WHERE todos.id = ?', [id]);
    connection.release();

    return reply.code(200).send(Responses.SUCCESS({}));
  }
}

module.exports = TodoController