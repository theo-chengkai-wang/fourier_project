import math
from svg.path import parse_path
from exceptions import MathematicalError


def integrate(f, interval=(0, 1), delta_t=0.01):
    assert interval[1] > interval[0]
    assert (interval[1] - interval[0]) / 2 >= delta_t > 0
    sum_integral = 0
    i = interval[0]
    while i <= interval[1]:
        # integral(f(t)dt) approx= sum(f(t)delta_t)
        sum_integral += f(i) * delta_t
        i += delta_t
    return sum_integral


# Computes the integral of some time series between an interval of time
# Assumes the time series is uniform, and is an array of numbers
def integrate_time_series(ts, interval=(0, 1)):
    if len(ts) <= 1:
        raise MathematicalError("Time series length too short, can't do anything meaningful")
    delta_t = (interval[1]-interval[0])/len(ts)
    sum_integral = 0
    for c in ts:
        # integral(f(t)dt) approx= sum(f(t)delta_t)
        sum_integral += c * delta_t
    return sum_integral


# Returns an array [c_0, c_1, c_{-1}, c_2, c_{-2}, ... c_50, c_{-50}...],
# where c_n is at position 2n-1, and c_-n at position 2n
def fourier(f, interval=(0, 1), max_n=50, delta_t=0.01):
    assert interval[1] > interval[0]
    fourier_coefficients = [0 for _ in range(2 * max_n + 1)]
    L = (interval[1] - interval[0]) / 2
    # c_0
    fourier_coefficients[0] = integrate(f, interval, delta_t) / (2 * L)
    # c_n and -n
    for n in range(1, max_n + 1):
        # c_n
        fourier_coefficients[2 * n - 1] = integrate(
            lambda t: f(t) * complex(math.cos(-n * math.pi * t / L), math.sin(-n * math.pi * t / L)),
            interval, delta_t) / (2 * L)
        # c_-n
        fourier_coefficients[2 * n] = integrate(
            lambda t: f(t) * complex(math.cos(n * math.pi * t / L), math.sin(n * math.pi * t / L)),
            interval, delta_t) / (2 * L)
    return fourier_coefficients


# Computes fourier series for a time series
def fourier_from_time_series(ts, interval=(0, 1), max_n=50):
    assert interval[1] > interval[0]
    if len(ts) <= 1:
        raise MathematicalError("Time series length too short, can't do anything meaningful")
    fourier_coefficients = [0 for _ in range(2 * max_n + 1)]
    L = (interval[1] - interval[0]) / 2
    # c_0
    fourier_coefficients[0] = integrate_time_series(ts, interval=interval) / (2 * L)
    time_stamps = [interval[0]+(i*2*L/len(ts)) for i in range(len(ts))]
    # c_n and -n
    for n in range(1, max_n + 1):
        # c_n
        fourier_coefficients[2 * n - 1] = integrate_time_series(
            list(map(lambda f, t: f * complex(math.cos(-n * math.pi * t / L), math.sin(-n * math.pi * t / L)),
                     ts, time_stamps)),
            interval) / (2 * L)
        # c_-n
        fourier_coefficients[2 * n] = integrate_time_series(
            list(map(lambda f, t: f * complex(math.cos(n * math.pi * t / L), math.sin(n * math.pi * t / L)),
                     ts, time_stamps)),
            interval) / (2 * L)
    return fourier_coefficients


# Computes the fourier series from an SVG path string
def svg_fourier(svg_path, max_n=50, delta=0.01):
    path = parse_path(svg_path)
    fourier_coefficients = fourier(path.point, max_n=max_n, delta_t=delta)
    return fourier_coefficients


if __name__ == '__main__':
    print(fourier(math.cos, (-math.pi, math.pi), max_n=10, delta_t=0.01))
    print(fourier_from_time_series([math.cos(-math.pi+(2*math.pi*i)/628) for i in range(628)],
                                   (-math.pi, math.pi), max_n=10))
    print(fourier(math.cos, (0, math.pi), max_n=10, delta_t=0.01))
    print(fourier_from_time_series([math.cos((math.pi*i)/314) for i in range(314)],
                                   (0, math.pi), max_n=10))
    print(fourier(lambda _: 1, max_n=10, delta_t=0.01))
    print(fourier_from_time_series([1 for _ in range(100)], (0, 1), max_n=10))


# Note: can turn svg into fourier or draw path on front-end with samples every $delta_t$ second
