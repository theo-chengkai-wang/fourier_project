class APIError(Exception):
    code = 500
    description = "Internal server error"


class BadRequestError(APIError):
    code = 400
    description = "Bad request"


class MathematicalError(APIError):
    code = 400
    description = "Encountered an error doing maths"

