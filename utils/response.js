const successResponse = (data, message = "Success") => {
    return {
        success: true,
        message,
        data,
    };
};

const errorResponse = (error, statusCode = 500) => {
    return {
        success: false,
        error: error.message || "An error occurred",
        statusCode,
    };
};

module.exports = { successResponse, errorResponse };  