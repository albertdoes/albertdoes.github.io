const nCrs: { [key: number]: number[] } = {};
function _nCrLazy(n: number, r: number) {
    nCrs[n] ??= [];
    nCrs[n][Math.min(r, n - r)] ??= _nCr(n, r);
    return nCrs[n][Math.min(r, n - r)];
}
function _nCr(n: number, r: number) {
    r = Math.min(r, n - r);
    let result = 1;
    for(let i = n; i > n - r; i--) result *= i;
    for(let i = r; i > 0; i--) result /= i;
    return result;
}

function _gradNumerical(f: (x: number) => number, x: number) {
    const epsilon = 10e-12;
    return Math.max((f(x + epsilon) - f(x - epsilon)) / (2 * epsilon), epsilon);
}

function _solveNewton(f: (x: number) => number, fAtX?: number) {
    fAtX ??= 0;
    let x = fAtX, iterations = 10;
    const F = (z: number) => (f(z) - (fAtX as number))
    do {
        x -= F(x) / _gradNumerical(F, x);
        iterations -= 1;
    } while (iterations > 0);
    return x;
}

function _bezier(points: number[], t: number) {
    const n = points.length - 1;
    let result = 0;
    for(let r = 0; r <= n; r++) {
        result += (
            _nCrLazy(n, r)
            * Math.pow(t, r)
            * Math.pow(1 - t, n - r)
            * points[r]
        );
    }
    return result;
}

function Bezier(points: number[]) {
    return (t: number) => _bezier(points, t);
}

function InverseBezier(points: number[]) {
    return (t: number) => _solveNewton(Bezier(points), t);
}

function CubicBezierEasing(points: number[]) {
    const cxi = InverseBezier([0, points[0], points[2], 1]);
    const cy = Bezier([0, points[1], points[3], 1]);
    return (t: number) => cy(cxi(t));
}

type CubicBezierEaseHandles = keyof typeof _cubicEaseHandleMap;

const _cubicEaseHandleMap = {
    "linear": [0, 0, 1, 1],
    "ease": [0.25, 0.1, 0.25, 1],
    "easeIn": [0.42, 0, 1, 1],
    "easeOut": [0, 0, 0.58, 1],
    "easeInOut": [0.42, 0, 0.58, 1],
    "easeInSine": [0.12, 0, 0.39, 0],
    "easeOutSine": [0.61, 1, 0.88, 1],
    "easeInOutSine": [0.37, 0, 0.63, 1],
    "easeInQuad": [0.11, 0, 0.5, 0],
    "easeOutQuad": [0.5, 1, 0.89, 1],
    "easeInOutQuad": [0.45, 0, 0.55, 1],
    "easeInCubic": [0.32, 0, 0.67, 0],
    "easeOutCubic": [0.33, 1, 0.68, 1],
    "easeInOutCubic": [0.65, 0, 0.35, 1],
    "easeInQuart": [0.5, 0, 0.75, 0],
    "easeOutQuart": [0.25, 1, 0.5, 1],
    "easeInOutQuart": [0.76, 0, 0.24, 1],
    "easeInQuint": [0.64, 0, 0.78, 0],
    "easeOutQuint": [0.22, 1, 0.36, 1],
    "easeInOutQuint": [0.83, 0, 0.17, 1],
    "easeInExpo": [0.7, 0, 0.84, 0],
    "easeOutExpo": [0.16, 1, 0.3, 1],
    "easeInOutExpo": [0.87, 0, 0.13, 1],
    "easeInCirc": [0.55, 0, 1, 0.45],
    "easeOutCirc": [0, 0.55, 0.45, 1],
    "easeInOutCirc": [0.85, 0, 0.15, 1],
}

function flowEasing(handles: CubicBezierEaseHandles | number[]) {
    return _cubicEaseHandleMap[handles as CubicBezierEaseHandles] ?? handles;
}

export type { CubicBezierEaseHandles };
export { Bezier, InverseBezier, CubicBezierEasing, flowEasing }