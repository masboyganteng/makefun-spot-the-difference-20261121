// The scenes in play order, grouped into sets by each scene's own set number.
// Adding a scene means one new file in scenes/ and one line here.

import { harborScene } from './scenes/harbor.js';
import { glasshouseScene } from './scenes/glasshouse.js';
import { marketScene } from './scenes/market.js';
import { rooftopsScene } from './scenes/rooftops.js';
import { reefScene } from './scenes/reef.js';
import { observatoryScene } from './scenes/observatory.js';

export const SCENES = [harborScene, glasshouseScene, marketScene, rooftopsScene, reefScene, observatoryScene];
