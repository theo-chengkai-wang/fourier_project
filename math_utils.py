import math
from svg.path import parse_path


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


# Returns an array [c_0, c_1, c_{-1}, c_2, c_{-2}, ... c_50, c_{-50}...],
# where c_n is at position 2n-1, and c_-n at position 2n
def fourier(f, interval=(0, 1), max_n=50, delta_t=0.01):
    assert interval[1] > interval[0]
    fourier_factors = [0 for _ in range(2 * max_n + 1)]
    L = (interval[1] - interval[0]) / 2
    # c_0
    fourier_factors[0] = integrate(f, interval, delta_t) / (2 * L)
    # c_n and -n
    for n in range(1, max_n + 1):
        # c_n
        fourier_factors[2 * n - 1] = integrate(
            lambda t: f(t) * complex(math.cos(-n * math.pi * t / L), math.sin(-n * math.pi * t / L)),
            interval, delta_t) / (2 * L)
        # c_-n
        fourier_factors[2 * n] = integrate(
            lambda t: f(t) * complex(math.cos(n * math.pi * t / L), math.sin(n * math.pi * t / L)),
            interval, delta_t) / (2 * L)
    return fourier_factors


def svg_fourier(svg_path, max_n=50, delta=0.01):
    path = parse_path(svg_path)
    fourier_factors = fourier(path.point, max_n=max_n, delta_t=delta)
    return fourier_factors


if __name__ == '__main__':
    print(fourier(math.sin, (-math.pi, math.pi), max_n=10, delta_t=0.01))

# Note: can turn svg into fourier or draw path on front-end with samples every $delta_t$ second
