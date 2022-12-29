const Responses = {
  SUCCESS: (data) => ({
    status: "Success",
    message: "Success",
    data
  }),
  BAD_REQUEST: (message, data = {}) => ({
    status: "Bad Request",
    message,
    data
  }),
  NOT_FOUND: (message, data = {}) => ({
    status: "Not Found",
    message,
    data
  })
}

module.exports = Responses