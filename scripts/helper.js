// Converts from degrees to radians.
function radians(degrees)
{
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
function degrees(radians)
{
  return radians * 180 / Math.PI;
};

function lerp(_a, _b, _f)
{
  return (_a * (1.0 - _f)) + (_b * _f);
}

function percent()
{
    return Math.random() * 100;
}

var NOTES =
{
    C : 261.63,
    D : 293.66,
    E : 329.63,
    F : 349.23,
    G : 392.00,
    A : 440.00,
    B : 493.88,
    noteArray : [261.63,
                293.66,
                329.63,
                349.23,
                392.00,
                440.00, 493.88]
};
