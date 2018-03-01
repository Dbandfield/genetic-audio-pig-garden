"use strict";

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

var parent1 = new Pig(null, null, audioCtx);
var parent2 = new Pig(null, null, audioCtx);
var child = null;

var p1Button = document.getElementById("p1");
var p2Button = document.getElementById("p2");
var cButton = document.getElementById("c");
var evoButton = document.getElementById("evo");
var nxtButton = document.getElementById("nxt");

p1Button.onclick = 
  function()
  {
    if(parent1)
    {
      parent1.play();
    }
  };

p2Button.onclick = 
  function()
  {
    if(parent2)
    {
      parent2.play();
    }
  };

cButton.onclick = 
  function()
  {
    if(child)
    {
      child.play();
    }
  };

evoButton.onclick = 
function()
{
  child = new Pig(parent1, parent2, audioCtx);
};

nxtButton.onclick =
function()
{
  parent1 = child;
  parent2 = new Pig(null, null, audioCtx);
  child = null;
};

