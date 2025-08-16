function CustomError(err) {
    const { message = '', statusCode = 500 } = err;

    return Object.freeze({
        handle: function () {
            return { statusCode, body: { message } };
        }
    });
}

module.exports = CustomError