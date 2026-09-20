import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

import { config } from './config.js';

gsap.registerPlugin(CustomEase, ScrollTrigger, SplitText);

CustomEase.create('osmo', '0.625, 0.05, 0, 1');

gsap.defaults({
  ease: 'osmo',
  duration: config.durationDefault
});

export { gsap, CustomEase, ScrollTrigger, SplitText };
