# Digicrush

[Digicrush](https://williamw520.github.io/digicrush-dist/2020-09-13/ "Digicrush")
is a puzzle/action game that can be played in a web browser.  It has a tiny size, 
the zip version under 13K.  It is developed as a response to the challenge to 
create a HTML5 web game in 13K ([js13kgames entry](https://js13kgames.com/entries/digicrush)).

# Game Itself

## Story
The system in cyber space is being attacked.  Stop the attacking digital connection 
by crushing the digits in the incoming stream.

## Game Play
Duplicate digits can be crushed.  Pick the duplicate digits to eliminate them.

Consecutive digits can be fused into digital bombs, 3 digits into a small bomb, 
4 digits into a big bomb, and 5 digits into a super duper 404 bomb.  
A 404 bomb kills the entire digital connection.

## Controls
The number key 1 to 6 pick the duplicate digit to eliminate.

SPACE key moves forward in the level starting screen.

# Development

The project uses ES6 Javascript with heavy usage of WebGL.
The 3d mesh is generated since 3D models built with other tools are too big to fit into 13K.
A hidden 2D canvas is used to generate the image texture for the model.

See todo-digicrush.org for detail.  (note: this is an Emacs ORG file; might be best to view it as text file.)

