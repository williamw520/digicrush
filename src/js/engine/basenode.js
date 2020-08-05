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
    }

    addChild(node) {
        this.nodes.push(node);
    }

    // Derived class should call this super.onUpdate() to iterate through the child nodes.
    onUpdate(delta) {
        if (this.nodes.length > 0) {
            this.nodes.forEach( n => n.onUpdate(delta) );
            let dead = this.nodes.reduce( (dead, n) => dead || !n.alive, false );
            if (dead)
                this.nodes = this.nodes.filter( node => node.alive );
        }
    }

    // Derived class should call this super.onDraw() to iterate through the child nodes.
    onDraw(ctx) {
        if (this.nodes.length > 0) {
            this.nodes.forEach( n => n.onDraw(ctx) );
        }
    }

}

