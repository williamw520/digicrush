/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

// The main entry point of unit tests.
import logger from "./util/logger.js";
import util from "/js/util/util.js";

import {Vec2} from "/js/engine/vec2.js";
import {BaseNode} from "/js/engine/basenode.js";
import {Engine} from "/js/engine/engine.js";
import {World} from "/js/game/world.js";


const L  = new logger.Logger("test");
const A  = console.assert;

L.info("Running tests");

L.info(new Vec2(3, 4).len);
L.info(new Vec2(1, 1).unit);
L.info(new Vec2(1, 1).radian);
L.info(new Vec2(1, 2).radian);
L.info(new Vec2(-1, 2).radian);
L.info(new Vec2(-1, -2).radian);
L.info(new Vec2(-1, 9).radian);
L.info(new Vec2(1, 1).scale(2));

L.info(new Vec2(1, 1).asUnit());
L.info(new Vec2(1, 1).asUnit().asUnit());


