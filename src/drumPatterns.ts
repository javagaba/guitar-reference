import type { DrumSound } from './drumSynth';

export interface DrumPattern {
  name: string;
  // Steps per time signature:
  // x/4 = sixteenth-note grid (4 steps per beat): 4/4=16, 3/4=12, 2/4=8, 5/4=20
  // x/8 = eighth-note grid (1 step per beat): 6/8=6, 7/8=7
  patterns: {
    [timeSig: string]: DrumSound[][];
  };
}

// Helper to create patterns more readably
// K = kick, S = snare, H = hihat closed, O = hihat open
function parsePattern(kick: string, snare: string, hihat: string): DrumSound[][] {
  const steps: DrumSound[][] = [];
  for (let i = 0; i < kick.length; i++) {
    const sounds: DrumSound[] = [];
    if (kick[i] === 'x') sounds.push('kick');
    if (snare[i] === 'x') sounds.push('snare');
    if (hihat[i] === 'x') sounds.push('hihat');
    if (hihat[i] === 'o') sounds.push('hihatOpen');
    steps.push(sounds);
  }
  return steps;
}

export const DRUM_PATTERNS: DrumPattern[] = [
  {
    name: 'Rock',
    patterns: {
      //         1 e & a 2 e & a 3 e & a 4 e & a
      '4/4': parsePattern(
        'x...x...x...x...',
        '....x.......x...',
        'x.x.x.x.x.x.x.x.'
      ),
      //         1 e & a 2 e & a 3 e & a
      '3/4': parsePattern(
        'x.......x...',
        '....x.......',
        'x.x.x.x.x.x.'
      ),
      //         1 2 3 4 5 6  (compound: ONE-two-three-FOUR-five-six)
      '6/8': parsePattern(
        'x..x..',  // kick on 1 and 4
        '...x..',  // snare on 4 (backbeat)
        'x.xx.x'   // hi-hat emphasis on main beats
      ),
      //         1 e & a 2 e & a
      '2/4': parsePattern(
        'x...x...',
        '....x...',
        'x.x.x.x.'
      ),
      //         1 e & a 2 e & a 3 e & a 4 e & a 5 e & a
      '5/4': parsePattern(
        'x...x...x...x.......',
        '....x.......x.......',
        'x.x.x.x.x.x.x.x.x.x.'
      ),
      //         1 2 3 4 5 6 7
      '7/8': parsePattern(
        'x..x...',
        '...x..x',
        'xxxxxxx'
      ),
    },
  },
  {
    name: 'Pop',
    patterns: {
      '4/4': parsePattern(
        'x.....x.x.......',
        '....x.......x...',
        'x.x.x.x.x.x.x.x.'
      ),
      '3/4': parsePattern(
        'x.....x.....',
        '....x.......',
        'x.x.x.x.x.x.'
      ),
      //         1 2 3 4 5 6
      '6/8': parsePattern(
        'x....x',  // kick on 1, anticipate next 1
        '...x..',  // snare on 4
        'x.xx.x'   // hi-hat with compound feel
      ),
      '2/4': parsePattern(
        'x.....x.',
        '....x...',
        'x.x.x.x.'
      ),
      '5/4': parsePattern(
        'x.....x.x.....x.....',
        '....x.......x.......',
        'x.x.x.x.x.x.x.x.x.x.'
      ),
      //         1 2 3 4 5 6 7
      '7/8': parsePattern(
        'x..x...',
        '...x..x',
        'xxxxxxx'
      ),
    },
  },
  {
    name: 'Disco',
    patterns: {
      '4/4': parsePattern(
        'x...x...x...x...',
        '....x.......x...',
        'x.x.o.x.x.x.o.x.'
      ),
      '3/4': parsePattern(
        'x...x...x...',
        '....x.......',
        'x.x.o.x.x.x.'
      ),
      //         1 2 3 4 5 6  (driving 6/8)
      '6/8': parsePattern(
        'x..x..',  // kick on 1 and 4
        '...x..',  // snare on 4
        'xoxxox'   // open hi-hat on 2 and 5 for lift
      ),
      '2/4': parsePattern(
        'x...x...',
        '....x...',
        'x.x.o.x.'
      ),
      '5/4': parsePattern(
        'x...x...x...x...x...',
        '....x.......x.......',
        'x.x.o.x.x.x.o.x.x.x.'
      ),
      //         1 2 3 4 5 6 7
      '7/8': parsePattern(
        'x.xx...',
        '...x..x',
        'xoxxoxx'
      ),
    },
  },
  {
    name: 'Funk',
    patterns: {
      '4/4': parsePattern(
        'x..x..x...x.....',
        '....x..x....x..x',
        'x.x.x.x.x.x.x.x.'
      ),
      '3/4': parsePattern(
        'x..x..x.....',
        '....x....x..',
        'x.x.x.x.x.x.'
      ),
      //         1 2 3 4 5 6  (funk 6/8)
      '6/8': parsePattern(
        'x..x.x',  // syncopated kick with pickup
        '..x..x',  // ghost snares on 3 and 6
        'x.xx.x'   // hi-hat compound feel
      ),
      '2/4': parsePattern(
        'x..x..x.',
        '....x..x',
        'x.x.x.x.'
      ),
      '5/4': parsePattern(
        'x..x..x...x....x....',
        '....x..x....x..x....',
        'x.x.x.x.x.x.x.x.x.x.'
      ),
      //         1 2 3 4 5 6 7
      '7/8': parsePattern(
        'xx.xx..',
        '...x..x',
        'xxxxxxx'
      ),
    },
  },
  {
    name: 'Jazz',
    patterns: {
      '4/4': parsePattern(
        'x.....x.........',
        '....x.......x...',
        'x..x..x..x..x..x'
      ),
      '3/4': parsePattern(
        'x.....x.....',
        '....x.......',
        'x..x..x..x..'
      ),
      //         1 2 3 4 5 6  (jazz waltz feel)
      '6/8': parsePattern(
        'x.....',  // sparse kick on 1
        '...x..',  // snare/brush on 4
        'x..x.x'   // ride pattern emphasizing compound pulse
      ),
      '2/4': parsePattern(
        'x.....x.',
        '....x...',
        'x..x..x.'
      ),
      '5/4': parsePattern(
        'x.....x.....x.......',
        '....x.......x.......',
        'x..x..x..x..x..x..x.'
      ),
      //         1 2 3 4 5 6 7
      '7/8': parsePattern(
        'x..x...',
        '.x..x.x',
        'x.xx.xx'
      ),
    },
  },
  {
    name: 'Ballad',
    patterns: {
      '4/4': parsePattern(
        'x...........x...',
        '........x.......',
        'x...x...x...x...'
      ),
      '3/4': parsePattern(
        'x...........',
        '....x.......',
        'x...x...x...'
      ),
      //         1 2 3 4 5 6  (gentle 6/8)
      '6/8': parsePattern(
        'x..x..',  // soft kick on 1 and 4
        '......',  // no snare, very gentle
        'x..x..'   // minimal hi-hat on main beats only
      ),
      '2/4': parsePattern(
        'x.......',
        '....x...',
        'x...x...'
      ),
      '5/4': parsePattern(
        'x...............x...',
        '........x...........',
        'x...x...x...x...x...'
      ),
      //         1 2 3 4 5 6 7
      '7/8': parsePattern(
        'x......',
        '..x....',
        'x.xx.xx'
      ),
    },
  },
  {
    name: 'Latin',
    patterns: {
      '4/4': parsePattern(
        'x..x..x...x.x...',
        '......x.......x.',
        'x.x.x.x.x.x.x.x.'
      ),
      '3/4': parsePattern(
        'x..x..x.....',
        '......x.....',
        'x.x.x.x.x.x.'
      ),
      //         1 2 3 4 5 6  (Afro-Cuban 6/8 bell pattern)
      '6/8': parsePattern(
        'x..x.x',  // tumbao-style kick
        '..x...',  // snare/clave hit on 3
        'x.xx.x'   // bell pattern feel
      ),
      '2/4': parsePattern(
        'x..x..x.',
        '......x.',
        'x.x.x.x.'
      ),
      '5/4': parsePattern(
        'x..x..x...x.x..x....',
        '......x.......x.....',
        'x.x.x.x.x.x.x.x.x.x.'
      ),
      //         1 2 3 4 5 6 7
      '7/8': parsePattern(
        'x.xx.x.',
        '..x..x.',
        'xxxxxxx'
      ),
    },
  },
  {
    name: 'Reggae',
    patterns: {
      '4/4': parsePattern(
        '............x...',
        '....x.......x...',
        '..x...x...x...x.'
      ),
      '3/4': parsePattern(
        '........x...',
        '....x.......',
        '..x...x...x.'
      ),
      //         1 2 3 4 5 6  (one-drop 6/8)
      '6/8': parsePattern(
        '...x..',  // kick only on 4 (the "drop")
        '...x..',  // snare with kick on the drop
        '.x..x.'   // offbeat hi-hat on 2 and 5
      ),
      '2/4': parsePattern(
        '....x...',
        '....x...',
        '..x...x.'
      ),
      '5/4': parsePattern(
        '............x.......',
        '....x.......x.......',
        '..x...x...x...x...x.'
      ),
      //         1 2 3 4 5 6 7
      '7/8': parsePattern(
        '....x..',
        '...xx..',
        '.xx.xxx'
      ),
    },
  },
];

export function getPatternForTimeSig(pattern: DrumPattern, timeSig: string): DrumSound[][] | null {
  return pattern.patterns[timeSig] || null;
}
