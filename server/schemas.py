calc_fourier_from_time_samples_schema = {
    'type': 'object',
    'properties': {
        'path': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'real': {'type': 'number'},
                    'imag': {'type': 'number'},
                }
            }
        },
        'max_n': {'type': 'number'}
    },
    'required': ['path']
}