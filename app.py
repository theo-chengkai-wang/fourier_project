from flask import Flask, request, jsonify
from flask_expects_json import expects_json
import exceptions
import schemas
import math_utils as mu
from datetime import datetime

app = Flask(__name__)


@app.errorhandler(exceptions.APIError)
def handle_generic_exception(err):
    response = {
        "error": err.description
    }
    if len(err.args) > 0:
        response["message"] = err.args[0]
    return jsonify(response), err.code


@app.errorhandler(exceptions.APIError)
def handle_generic_exception(err):
    response = {
        "error": err.description
    }
    print(datetime.now(), ": Error: ", response)
    if len(err.args) > 0:
        response["message"] = err.args[0]
    return jsonify(response), err.code


@app.route('/api/fourier', methods=['POST'])
@expects_json(schema=schemas.calc_fourier_from_time_samples_schema)
def calc_fourier_from_time_samples():
    if request.json is not None:
        time_series = [complex(c['real'], c['imag']) for c in request.json['path']]
        #print(time_series)
        if 'max_n' in request.json:
            print(datetime.now(), ": Request: with max_n = ", request.json['max_n'])
            fourier_coefs = mu.fourier_from_time_series(time_series, (0, 1), max_n = request.json['max_n'])
        else:
            print(datetime.now(), ": Request: with max_n = ", 50)
            fourier_coefs = mu.fourier_from_time_series(time_series, (0, 1))
        return {"fourier_coefs": [{"real": c.real, "imag": c.imag} for c in fourier_coefs]}
    else:
        raise exceptions.BadRequestError("Request is not in JSON format.")


if __name__ == '__main__':
    app.run()
