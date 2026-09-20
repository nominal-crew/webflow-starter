import '../css/main.css';

import './core/gsap.js';

import { initBrand } from './core/brand.js';
import { initWindowEvents } from './core/events.js';
import { initPageTransitions } from './transitions/engine.js';

initBrand();
initWindowEvents();
initPageTransitions();
