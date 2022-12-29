const migrate = async () => {
  // migrate from file init.sql
  try {
    const fs = require('fs')
    const path = require('path')
    const pool = require('./connection')
    const queries = fs.readFileSync(path.join(__dirname, 'init.sql')).toString()
      .replace(/(\r\n|\n|\r)/gm, " ") // remove newlines
      .replace(/\s+/g, ' ') // excess white space
      .split(";") // split into all statements
      .map(Function.prototype.call, String.prototype.trim)
      .filter(function (el) { return el.length != 0 });
    queries.forEach((sql) => pool.query(sql))
  } catch (error) {
    console.log(error)
  }
}

module.exports = migrate