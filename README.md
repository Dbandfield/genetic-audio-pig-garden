# GENETIC AUDIO PIG GARDEN

![Audio Pigs in Love](/screenshots/1.png?raw=true "Audio Pigs in Love")

## What is this madness?

This is a 3D virtual world available to explore online here:\
http://danielbandfield.com/#worlds\

The world is full of pig-like creatures. They wander about, making music which is randomly
generated. When new audio-pigs are born their song is a combination of their parents 
with a small chance of mutation. Over time, the communal song **evolves** and becomes more
complex.

Video here:
<p><a href="https://vimeo.com/260160536">Genetic Audio Pigs</a></p>

## Prerequisites

- something to spin up a server. If you want to run this locally you need a way to run a server, 
because it loads local resources. I would suggest python as the easiest way to do this.
Python3:\
`python -m http.server`\
Then head over to localhost:8000

## Dependencies

- three.js (included). The version included here is one I have modified, because the original does not
support the oscillator functions from the webaudio API. Because the sound here is randomised,
these oscillators were important to me.





