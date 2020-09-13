/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

// basenode module.

// Base Game Node
export class BaseNode {
    constructor() {
        this.nodes = [];    // child nodes.
        this.alive = true;
    }

    addChild(node) {
        this.nodes.push(node);
        return node;
    }

    // Derived class should call this super.onStart() to iterate through the child nodes.
    // This gives all game nodes a chance to do initialization at startup.
    onStart() {
        if (this.nodes.length > 0) {
            this.nodes.forEach( n => n.onStart() );
        }
    }

    // Derived class should call this super.onStop() to iterate through the child nodes.
    // This gives all game nodes a chance to do cleanup at shutdown.
    onStop() {
        if (this.nodes.length > 0) {
            this.nodes.forEach( n => n.onStop() );
        }
    }

    // Derived class should call this super.onUpdate() to iterate through the child nodes.
    onUpdate(time, delta, parent) {
        if (this.nodes.length > 0) {
            this.nodes.forEach( n => n.onUpdate(time, delta, this) );
            let dead = this.nodes.reduce( (dead, n) => dead || !n.alive, false );
            if (dead)
                this.nodes = this.nodes.filter( node => node.alive );
        }
    }

    // Derived class should call this super.onDraw() to iterate through the child nodes.
    onDraw() {
        if (this.nodes.length > 0) {
            this.nodes.forEach( n => n.onDraw() );
        }
    }

}

