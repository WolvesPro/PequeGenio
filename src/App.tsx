import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Calculator,
  Award,
  PenTool,
  Volume2,
  Eraser,
  CheckCircle2,
  Star,
  Sparkles,
  RefreshCw,
  Clock,
  UserCheck,
  Flame,
  Calendar,
  HelpCircle
} from 'lucide-react';

// ==========================================
// TIPOS E INTERFACES ESTRICTAS
// ==========================================

type ModuleId = 'letters' | 'calendar' | 'reading' | 'numbers' | 'math' | 'quiz';

interface LetterItem {
  id: string;
  char: string;
  upper: string;
  name: string;
  word: string;
  emoji: string;
  isPriority: boolean;
  syllables: { id: string; text: string }[];
}

interface ReadingStory {
  id: string;
  title: string;
  focusInfo: string;
  sentences: { id: string; text: string }[];
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
}

interface VisualToken {
  id: string;
  emoji: string;
  value: number;
  label: string;
}

interface MathChallenge {
  id: string;
  numA: number;
  numB: number;
  operator: '+' | '-';
  answer: number;
  options: { id: string; value: number }[];
  emoji: string;
}

interface QuizQuestion {
  id: string;
  category: 'priority-letters' | 'calendar' | 'numbers' | 'math';
  promptText: string;
  spokenText: string;
  visualDisplay: string;
  options: { id: string; label: string; isCorrect: boolean }[];
}

interface DailyMissions {
  tracedPriorityLetter: boolean;
  tracedOwnName: boolean;
  practicedDate: boolean;
  completedReading: boolean;
  solvedMath: boolean;
  completedDailyQuiz: boolean;
}

interface UserProgress {
  childFullName: string;
  stars: number;
  streakDays: number;
  lastActiveDate: string;
  minutesToday: number;
  masteredIds: string[];
  quizScores: { id: string; date: string; score: number; total: number; type: 'diario' | 'semanal' }[];
  dailyMissions: DailyMissions;
}

// ==========================================
// ABECEDARIO COMPLETO EN ESPAÑOL (27 LETRAS A-Z + Ñ)
// ==========================================

const LETTERS_DATA: LetterItem[] = [
  {
    id: 'let-a',
    char: 'A a',
    upper: 'A',
    name: 'A',
    word: 'Abeja',
    emoji: '🐝',
    isPriority: false,
    syllables: [
      { id: 'syl-a1', text: 'a' },
      { id: 'syl-a2', text: 'al' },
      { id: 'syl-a3', text: 'am' },
      { id: 'syl-a4', text: 'an' },
      { id: 'syl-a5', text: 'ar' }
    ]
  },
  {
    id: 'let-b',
    char: 'B b',
    upper: 'B',
    name: 'Be',
    word: 'Ballena',
    emoji: '🐋',
    isPriority: false,
    syllables: [
      { id: 'syl-ba', text: 'ba' },
      { id: 'syl-be', text: 'be' },
      { id: 'syl-bi', text: 'bi' },
      { id: 'syl-bo', text: 'bo' },
      { id: 'syl-bu', text: 'bu' }
    ]
  },
  {
    id: 'let-c',
    char: 'C c',
    upper: 'C',
    name: 'Ce',
    word: 'Casa',
    emoji: '🏠',
    isPriority: false,
    syllables: [
      { id: 'syl-ca', text: 'ca' },
      { id: 'syl-ce', text: 'ce' },
      { id: 'syl-ci', text: 'ci' },
      { id: 'syl-co', text: 'co' },
      { id: 'syl-cu', text: 'cu' }
    ]
  },
  {
    id: 'let-d',
    char: 'D d',
    upper: 'D',
    name: 'De',
    word: 'Delfín',
    emoji: '🐬',
    isPriority: false,
    syllables: [
      { id: 'syl-da', text: 'da' },
      { id: 'syl-de', text: 'de' },
      { id: 'syl-di', text: 'di' },
      { id: 'syl-do', text: 'do' },
      { id: 'syl-du', text: 'du' }
    ]
  },
  {
    id: 'let-e',
    char: 'E e',
    upper: 'E',
    name: 'E',
    word: 'Elefante',
    emoji: '🐘',
    isPriority: false,
    syllables: [
      { id: 'syl-e1', text: 'e' },
      { id: 'syl-e2', text: 'el' },
      { id: 'syl-e3', text: 'em' },
      { id: 'syl-e4', text: 'en' },
      { id: 'syl-e5', text: 'es' }
    ]
  },
  {
    id: 'let-f',
    char: 'F f',
    upper: 'F',
    name: 'Efe',
    word: 'Foca',
    emoji: '🦭',
    isPriority: false,
    syllables: [
      { id: 'syl-fa', text: 'fa' },
      { id: 'syl-fe', text: 'fe' },
      { id: 'syl-fi', text: 'fi' },
      { id: 'syl-fo', text: 'fo' },
      { id: 'syl-fu', text: 'fu' }
    ]
  },
  {
    id: 'let-g',
    char: 'G g',
    upper: 'G',
    name: 'Ge',
    word: 'Gato',
    emoji: '🐱',
    isPriority: false,
    syllables: [
      { id: 'syl-ga', text: 'ga' },
      { id: 'syl-ge', text: 'ge' },
      { id: 'syl-gi', text: 'gi' },
      { id: 'syl-go', text: 'go' },
      { id: 'syl-gu', text: 'gu' }
    ]
  },
  {
    id: 'let-h',
    char: 'H h',
    upper: 'H',
    name: 'Hache (muda)',
    word: 'Helado',
    emoji: '🍦',
    isPriority: false,
    syllables: [
      { id: 'syl-ha', text: 'ha' },
      { id: 'syl-he', text: 'he' },
      { id: 'syl-hi', text: 'hi' },
      { id: 'syl-ho', text: 'ho' },
      { id: 'syl-hu', text: 'hu' }
    ]
  },
  {
    id: 'let-i',
    char: 'I i',
    upper: 'I',
    name: 'I',
    word: 'Iguana',
    emoji: '🦎',
    isPriority: false,
    syllables: [
      { id: 'syl-i1', text: 'i' },
      { id: 'syl-i2', text: 'il' },
      { id: 'syl-i3', text: 'im' },
      { id: 'syl-i4', text: 'in' },
      { id: 'syl-i5', text: 'is' }
    ]
  },
  {
    id: 'let-j',
    char: 'J j',
    upper: 'J',
    name: 'Jota',
    word: 'Jirafa',
    emoji: '🦒',
    isPriority: false,
    syllables: [
      { id: 'syl-ja', text: 'ja' },
      { id: 'syl-je', text: 'je' },
      { id: 'syl-ji', text: 'ji' },
      { id: 'syl-jo', text: 'jo' },
      { id: 'syl-ju', text: 'ju' }
    ]
  },
  {
    id: 'let-k',
    char: 'K k',
    upper: 'K',
    name: 'Ka',
    word: 'Koala',
    emoji: '🐨',
    isPriority: false,
    syllables: [
      { id: 'syl-ka', text: 'ka' },
      { id: 'syl-ke', text: 'ke' },
      { id: 'syl-ki', text: 'ki' },
      { id: 'syl-ko', text: 'ko' },
      { id: 'syl-ku', text: 'ku' }
    ]
  },
  {
    id: 'let-l',
    char: 'L l',
    upper: 'L',
    name: 'Ele',
    word: 'Luna',
    emoji: '🌙',
    isPriority: false,
    syllables: [
      { id: 'syl-la', text: 'la' },
      { id: 'syl-le', text: 'le' },
      { id: 'syl-li', text: 'li' },
      { id: 'syl-lo', text: 'lo' },
      { id: 'syl-lu', text: 'lu' }
    ]
  },
  {
    id: 'let-m',
    char: 'M m',
    upper: 'M',
    name: 'Eme',
    word: 'Mamá',
    emoji: '👩',
    isPriority: false,
    syllables: [
      { id: 'syl-ma', text: 'ma' },
      { id: 'syl-me', text: 'me' },
      { id: 'syl-mi', text: 'mi' },
      { id: 'syl-mo', text: 'mo' },
      { id: 'syl-mu', text: 'mu' }
    ]
  },
  {
    id: 'let-n',
    char: 'N n',
    upper: 'N',
    name: 'Ene',
    word: 'Nube',
    emoji: '☁️',
    isPriority: false,
    syllables: [
      { id: 'syl-na', text: 'na' },
      { id: 'syl-ne', text: 'ne' },
      { id: 'syl-ni', text: 'ni' },
      { id: 'syl-no', text: 'no' },
      { id: 'syl-nu', text: 'nu' }
    ]
  },
  {
    id: 'let-enie',
    char: 'Ñ ñ',
    upper: 'Ñ',
    name: 'Eñe',
    word: 'Ñandú',
    emoji: '🐦',
    isPriority: false,
    syllables: [
      { id: 'syl-nia', text: 'ña' },
      { id: 'syl-nie', text: 'ñe' },
      { id: 'syl-nii', text: 'ñi' },
      { id: 'syl-nio', text: 'ño' },
      { id: 'syl-niu', text: 'ñu' }
    ]
  },
  {
    id: 'let-o',
    char: 'O o',
    upper: 'O',
    name: 'O',
    word: 'Oso',
    emoji: '🐻',
    isPriority: false,
    syllables: [
      { id: 'syl-o1', text: 'o' },
      { id: 'syl-o2', text: 'ol' },
      { id: 'syl-o3', text: 'om' },
      { id: 'syl-o4', text: 'on' },
      { id: 'syl-o5', text: 'os' }
    ]
  },
  {
    id: 'let-p',
    char: 'P p',
    upper: 'P',
    name: 'Pe',
    word: 'Papá',
    emoji: '👨',
    isPriority: false,
    syllables: [
      { id: 'syl-pa', text: 'pa' },
      { id: 'syl-pe', text: 'pe' },
      { id: 'syl-pi', text: 'pi' },
      { id: 'syl-po', text: 'po' },
      { id: 'syl-pu', text: 'pu' }
    ]
  },
  {
    id: 'let-q',
    char: 'Q q',
    upper: 'Q',
    name: 'Cu',
    word: 'Queso',
    emoji: '🧀',
    isPriority: false,
    syllables: [
      { id: 'syl-que', text: 'que' },
      { id: 'syl-qui', text: 'qui' }
    ]
  },
  {
    id: 'let-r',
    char: 'R r',
    upper: 'R',
    name: 'Erre',
    word: 'Rana',
    emoji: '🐸',
    isPriority: false,
    syllables: [
      { id: 'syl-ra', text: 'ra' },
      { id: 'syl-re', text: 're' },
      { id: 'syl-ri', text: 'ri' },
      { id: 'syl-ro', text: 'ro' },
      { id: 'syl-ru', text: 'ru' }
    ]
  },
  {
    id: 'let-s',
    char: 'S s',
    upper: 'S',
    name: 'Ese',
    word: 'Sol',
    emoji: '☀️',
    isPriority: true,
    syllables: [
      { id: 'syl-sa', text: 'sa' },
      { id: 'syl-se', text: 'se' },
      { id: 'syl-si', text: 'si' },
      { id: 'syl-so', text: 'so' },
      { id: 'syl-su', text: 'su' }
    ]
  },
  {
    id: 'let-t',
    char: 'T t',
    upper: 'T',
    name: 'Te',
    word: 'Tortuga',
    emoji: '🐢',
    isPriority: true,
    syllables: [
      { id: 'syl-ta', text: 'ta' },
      { id: 'syl-te', text: 'te' },
      { id: 'syl-ti', text: 'ti' },
      { id: 'syl-to', text: 'to' },
      { id: 'syl-tu', text: 'tu' }
    ]
  },
  {
    id: 'let-u',
    char: 'U u',
    upper: 'U',
    name: 'U',
    word: 'Uvas',
    emoji: '🍇',
    isPriority: false,
    syllables: [
      { id: 'syl-u1', text: 'u' },
      { id: 'syl-u2', text: 'ul' },
      { id: 'syl-u3', text: 'um' },
      { id: 'syl-u4', text: 'un' },
      { id: 'syl-u5', text: 'us' }
    ]
  },
  {
    id: 'let-v',
    char: 'V v',
    upper: 'V',
    name: 'Uve',
    word: 'Vaca',
    emoji: '🐮',
    isPriority: false,
    syllables: [
      { id: 'syl-va', text: 'va' },
      { id: 'syl-ve', text: 've' },
      { id: 'syl-vi', text: 'vi' },
      { id: 'syl-vo', text: 'vo' },
      { id: 'syl-vu', text: 'vu' }
    ]
  },
  {
    id: 'let-w',
    char: 'W w',
    upper: 'W',
    name: 'Doble Uve',
    word: 'Waffle',
    emoji: '🧇',
    isPriority: false,
    syllables: [
      { id: 'syl-wa', text: 'wa' },
      { id: 'syl-we', text: 'we' },
      { id: 'syl-wi', text: 'wi' },
      { id: 'syl-wo', text: 'wo' }
    ]
  },
  {
    id: 'let-x',
    char: 'X x',
    upper: 'X',
    name: 'Equis',
    word: 'Xilófono',
    emoji: '🎼',
    isPriority: false,
    syllables: [
      { id: 'syl-xa', text: 'xa' },
      { id: 'syl-xe', text: 'xe' },
      { id: 'syl-xi', text: 'xi' },
      { id: 'syl-xo', text: 'xo' },
      { id: 'syl-xu', text: 'xu' }
    ]
  },
  {
    id: 'let-y',
    char: 'Y y',
    upper: 'Y',
    name: 'Ye',
    word: 'Yoyo',
    emoji: '🪀',
    isPriority: false,
    syllables: [
      { id: 'syl-ya', text: 'ya' },
      { id: 'syl-ye', text: 'ye' },
      { id: 'syl-yi', text: 'yi' },
      { id: 'syl-yo', text: 'yo' },
      { id: 'syl-yu', text: 'yu' }
    ]
  },
  {
    id: 'let-z',
    char: 'Z z',
    upper: 'Z',
    name: 'Zeta',
    word: 'Zapato',
    emoji: '👟',
    isPriority: false,
    syllables: [
      { id: 'syl-za', text: 'za' },
      { id: 'syl-ze', text: 'ze' },
      { id: 'syl-zi', text: 'zi' },
      { id: 'syl-zo', text: 'zo' },
      { id: 'syl-zu', text: 'zu' }
    ]
  }
];

// ==========================================
// DATOS DE DÍAS, MESES Y AÑOS (CALENDARIO)
// ==========================================

const DAYS_OF_WEEK = [
  { id: 'day-1', name: 'Lunes', emoji: '🌙', clue: 'Empieza con L de Luna' },
  { id: 'day-2', name: 'Martes', emoji: '🔨', clue: 'Empieza con M y termina con S' },
  { id: 'day-3', name: 'Miércoles', emoji: '🍯', clue: 'Empieza con M y termina con S' },
  { id: 'day-4', name: 'Jueves', emoji: '🦒', clue: 'Empieza con J y termina con S' },
  { id: 'day-5', name: 'Viernes', emoji: '🎉', clue: 'Empieza con V y termina con S' },
  { id: 'day-6', name: 'Sábado', emoji: '☀️', clue: '⭐ Empieza con la letra S' },
  { id: 'day-7', name: 'Domingo', emoji: '🎈', clue: 'Día de descanso en familia' }
];

const MONTHS_OF_YEAR = [
  { id: 'mon-1', number: 1, name: 'Enero', emoji: '⛄' },
  { id: 'mon-2', number: 2, name: 'Febrero', emoji: '❤️' },
  { id: 'mon-3', number: 3, name: 'Marzo', emoji: '🌷' },
  { id: 'mon-4', number: 4, name: 'Abril', emoji: '🌧️' },
  { id: 'mon-5', number: 5, name: 'Mayo', emoji: '🌸' },
  { id: 'mon-6', number: 6, name: 'Junio', emoji: '☀️' },
  { id: 'mon-7', number: 7, name: 'Julio', emoji: '🏖️' },
  { id: 'mon-8', number: 8, name: 'Agosto', emoji: '🪁' },
  { id: 'mon-9', number: 9, name: 'Septiembre', emoji: '🇲🇽' },
  { id: 'mon-10', number: 10, name: 'Octubre', emoji: '🎃' },
  { id: 'mon-11', number: 11, name: 'Noviembre', emoji: '🕯️' },
  { id: 'mon-12', number: 12, name: 'Diciembre', emoji: '🎄' }
];

const YEARS_LIST = [
  { id: 'yr-2025', value: '2025', spoken: 'Dos mil veinticinco' },
  { id: 'yr-2026', value: '2026', spoken: 'Dos mil veintiséis' },
  { id: 'yr-2027', value: '2027', spoken: 'Dos mil veintisiete' }
];

// ==========================================
// BIBLIOTECA DE 7 CUENTOS DE LECTURA GUIADA
// ==========================================

const STORIES_DATA: ReadingStory[] = [
  {
    id: 'story-tito-susi',
    title: '1. La Tortuga Tito y el Sol',
    focusInfo: 'Refuerzo especial: Letras T y S',
    sentences: [
      { id: 's1-1', text: 'La tortuga Tito sale a pasear.' },
      { id: 's1-2', text: 'Tito toma el sol con su amiga Susi.' },
      { id: 's1-3', text: 'Susi salta la soga y toma té.' },
      { id: 's1-4', text: '¡Tito y Susi son muy buenos amigos!' }
    ],
    question: '¿Qué toma Susi mientras juega con Tito?',
    options: [
      { id: 'st1-opt1', text: 'Toma té 🍵', isCorrect: true },
      { id: 'st1-opt2', text: 'Toma sopa 🍲', isCorrect: false },
      { id: 'st1-opt3', text: 'Toma jugo 🧃', isCorrect: false }
    ]
  },
  {
    id: 'story-sapo-tomate',
    title: '2. El Sapo Samuel y su Tomate',
    focusInfo: 'Refuerzo especial: Sílabas SA, SE, SI y TA, TE, TI',
    sentences: [
      { id: 's2-1', text: 'El sapo Samuel vive en la selva.' },
      { id: 's2-2', text: 'Samuel tiene seis tomates rojos.' },
      { id: 's2-3', text: 'Su tía Tita prepara una sopa rica.' },
      { id: 's2-4', text: 'Samuel se sienta en su silla a comer.' }
    ],
    question: '¿Cuántos tomates tiene el sapo Samuel?',
    options: [
      { id: 'st2-opt1', text: 'Seis tomates 🍅', isCorrect: true },
      { id: 'st2-opt2', text: 'Tres tomates 🍅', isCorrect: false },
      { id: 'st2-opt3', text: 'Diez tomates 🍅', isCorrect: false }
    ]
  },
  {
    id: 'story-sabado-siete',
    title: '3. Un Sábado con Siete Tortugas',
    focusInfo: 'Días de la semana y refuerzo T / S',
    sentences: [
      { id: 's3-1', text: 'Hoy es sábado diecisiete de octubre.' },
      { id: 's3-2', text: 'Sara sale temprano a caminar al parque.' },
      { id: 's3-3', text: 'En el pasto cuenta siete tortugas pequeñas.' },
      { id: 's3-4', text: 'El domingo volverá con su tío Tomás.' }
    ],
    question: '¿Qué día de la semana salió Sara al parque?',
    options: [
      { id: 'st3-opt1', text: 'El sábado ☀️', isCorrect: true },
      { id: 'st3-opt2', text: 'El lunes 🌙', isCorrect: false },
      { id: 'st3-opt3', text: 'El jueves 🦒', isCorrect: false }
    ]
  },
  {
    id: 'story-oso-mimi',
    title: '4. La Osa Mimí y la Luna',
    focusInfo: 'Lectura de vocales, M, P y L',
    sentences: [
      { id: 's4-1', text: 'La osa Mimí mira la luna.' },
      { id: 's4-2', text: 'Su papá le lee un cuento bonito.' },
      { id: 's4-3', text: 'Mimí se tapa con su tela suave.' },
      { id: 's4-4', text: '¡Buenas noches, pequeña osa Mimí!' }
    ],
    question: '¿Qué mira la osa Mimí en el cielo?',
    options: [
      { id: 'st4-opt1', text: 'La luna 🌙', isCorrect: true },
      { id: 'st4-opt2', text: 'Un avión ✈️', isCorrect: false },
      { id: 'st4-opt3', text: 'Una nube ☁️', isCorrect: false }
    ]
  },
  {
    id: 'story-tren-sofia',
    title: '5. El Tren de Sofía y Tomás',
    focusInfo: 'Palabras con T y S en oraciones completas',
    sentences: [
      { id: 's5-1', text: 'Sofía y Tomás suben a un tren rojo.' },
      { id: 's5-2', text: 'El tren toca su silbato: ¡tuuu, tuuu!' },
      { id: 's5-3', text: 'Sofía saluda a todos desde su asiento.' },
      { id: 's5-4', text: 'En la tarde llegan a la casa de su abuela.' }
    ],
    question: '¿En qué viajan Sofía y Tomás?',
    options: [
      { id: 'st5-opt1', text: 'En un tren rojo 🚂', isCorrect: true },
      { id: 'st5-opt2', text: 'En un barco ⛵', isCorrect: false },
      { id: 'st5-opt3', text: 'En bicicleta 🚲', isCorrect: false }
    ]
  },
  {
    id: 'story-cien-estrellas',
    title: '6. El Búho Beto Cuenta hasta Cien',
    focusInfo: 'Números hasta el 100 y letras B, C, N',
    sentences: [
      { id: 's6-1', text: 'El búho Beto despierta cuando sale la noche.' },
      { id: 's6-2', text: 'Primero cuenta veinte estrellas brillantes.' },
      { id: 's6-3', text: 'Después cuenta cincuenta y llega hasta cien.' },
      { id: 's6-4', text: '¡A Beto le encanta aprender los números!' }
    ],
    question: '¿Hasta qué número logró contar el búho Beto?',
    options: [
      { id: 'st6-opt1', text: 'Hasta el Cien (100) 💯', isCorrect: true },
      { id: 'st6-opt2', text: 'Hasta el Cinco (5) 🖐️', isCorrect: false },
      { id: 'st6-opt3', text: 'Hasta el Diez (10) 🔟', isCorrect: false }
    ]
  },
  {
    id: 'story-meses-rana',
    title: '7. La Rana Rita y los Meses del Año',
    focusInfo: 'Meses del año, R, M y comprensión',
    sentences: [
      { id: 's7-1', text: 'En enero la rana Rita se pone su bufanda.' },
      { id: 's7-2', text: 'En mayo mira muchas flores de colores.' },
      { id: 's7-3', text: 'En octubre salta sobre las hojas secas.' },
      { id: 's7-4', text: 'Y en diciembre celebra con toda su familia.' }
    ],
    question: '¿En qué mes ve muchas flores la rana Rita?',
    options: [
      { id: 'st7-opt1', text: 'En mayo 🌸', isCorrect: true },
      { id: 'st7-opt2', text: 'En enero ⛄', isCorrect: false },
      { id: 'st7-opt3', text: 'En diciembre 🎄', isCorrect: false }
    ]
  }
];

// ==========================================
// BANCO DE PREGUNTAS DEL QUIZ (DIARIO Y SEMANAL)
// ==========================================

const QUIZ_BANK: QuizQuestion[] = [
  {
    id: 'q-t1',
    category: 'priority-letters',
    promptText: '¿Con qué letra empieza la palabra TORTUGA?',
    spokenText: 'Escucha bien: Tortuga. ¿Con qué letra empieza Tortuga?',
    visualDisplay: '🐢 ___ortuga',
    options: [
      { id: 'q-t1-a', label: 'Letra T', isCorrect: true },
      { id: 'q-t1-b', label: 'Letra S', isCorrect: false },
      { id: 'q-t1-c', label: 'Letra M', isCorrect: false }
    ]
  },
  {
    id: 'q-s1',
    category: 'priority-letters',
    promptText: '¿Con qué letra empieza la palabra SOL y SÁBADO?',
    spokenText: 'Escucha el sonido sssss: Sol, Sábado. ¿Con qué letra empiezan?',
    visualDisplay: '☀️ ___ol / ___ábado',
    options: [
      { id: 'q-s1-a', label: 'Letra S', isCorrect: true },
      { id: 'q-s1-b', label: 'Letra T', isCorrect: false },
      { id: 'q-s1-c', label: 'Letra L', isCorrect: false }
    ]
  },
  {
    id: 'q-ts-syllable',
    category: 'priority-letters',
    promptText: '¿Con qué sílaba empieza la palabra TOMATE?',
    spokenText: 'To-ma-te. ¿Con qué sílaba empieza tomate?',
    visualDisplay: '🍅 ___mate',
    options: [
      { id: 'q-ts-a', label: 'TO', isCorrect: true },
      { id: 'q-ts-b', label: 'SO', isCorrect: false },
      { id: 'q-ts-c', label: 'MA', isCorrect: false }
    ]
  },
  {
    id: 'q-cal-1',
    category: 'calendar',
    promptText: '¿Qué día de la semana va después del Viernes y empieza con S?',
    spokenText: 'Lunes, Martes, Miércoles, Jueves, Viernes... ¿Qué día sigue?',
    visualDisplay: '📅 Viernes ➡️ ¿?',
    options: [
      { id: 'q-cal1-a', label: 'Sábado', isCorrect: true },
      { id: 'q-cal1-b', label: 'Martes', isCorrect: false },
      { id: 'q-cal1-c', label: 'Lunes', isCorrect: false }
    ]
  },
  {
    id: 'q-num-100',
    category: 'numbers',
    promptText: '¿Cuál es el número OCHENTA Y CINCO?',
    spokenText: 'Busca el número Ochenta y cinco.',
    visualDisplay: '🔢 Ochenta y cinco',
    options: [
      { id: 'q-n85-a', label: '85', isCorrect: true },
      { id: 'q-n85-b', label: '58', isCorrect: false },
      { id: 'q-n85-c', label: '35', isCorrect: false }
    ]
  },
  {
    id: 'q-cal-2',
    category: 'calendar',
    promptText: '¿En qué mes celebramos la Navidad y termina el año?',
    spokenText: '¿Cuál es el último mes del año?',
    visualDisplay: '🎄 Mes 12',
    options: [
      { id: 'q-cal2-a', label: 'Diciembre', isCorrect: true },
      { id: 'q-cal2-b', label: 'Enero', isCorrect: false },
      { id: 'q-cal2-c', label: 'Abril', isCorrect: false }
    ]
  },
  {
    id: 'q-num-30',
    category: 'numbers',
    promptText: '¿Cómo se escribe el número 30 (que empieza con T)?',
    spokenText: '¿Cuál de estas palabras dice Treinta?',
    visualDisplay: '3️⃣0️⃣',
    options: [
      { id: 'q-n30-a', label: 'Treinta', isCorrect: true },
      { id: 'q-n30-b', label: 'Sesenta', isCorrect: false },
      { id: 'q-n30-c', label: 'Setenta', isCorrect: false }
    ]
  },
  {
    id: 'q-num-60',
    category: 'numbers',
    promptText: '¿Cómo se escribe el número 60 (que empieza con S)?',
    spokenText: '¿Cuál de estas palabras dice Sesenta?',
    visualDisplay: '6️⃣0️⃣',
    options: [
      { id: 'q-n60-a', label: 'Sesenta', isCorrect: true },
      { id: 'q-n60-b', label: 'Treinta', isCorrect: false },
      { id: 'q-n60-c', label: 'Cien', isCorrect: false }
    ]
  },
  {
    id: 'q-math-1',
    category: 'math',
    promptText: 'Si tienes 5 estrellas y ganas 4 más, ¿cuántas tienes?',
    spokenText: 'Cinco más cuatro. ¿Cuánto es 5 más 4?',
    visualDisplay: '⭐⭐⭐⭐⭐ + ⭐⭐⭐⭐',
    options: [
      { id: 'q-m1-a', label: '9 (Nueve)', isCorrect: true },
      { id: 'q-m1-b', label: '7 (Siete)', isCorrect: false },
      { id: 'q-m1-c', label: '8 (Ocho)', isCorrect: false }
    ]
  },
  {
    id: 'q-math-2',
    category: 'math',
    promptText: 'Tienes 10 manzanas y te comes 4. ¿Cuántas quedan?',
    spokenText: 'A diez manzanas le quitamos cuatro. ¿Cuántas quedan?',
    visualDisplay: '🍎x10 - 4',
    options: [
      { id: 'q-m2-a', label: '6 (Seis)', isCorrect: true },
      { id: 'q-m2-b', label: '4 (Cuatro)', isCorrect: false },
      { id: 'q-m2-c', label: '8 (Ocho)', isCorrect: false }
    ]
  }
];

const STORAGE_KEY = 'pequegenio_progress_v2';

// ==========================================
// CONVERSOR DE NÚMEROS (1 AL 100) A TEXTO EN ESPAÑOL
// ==========================================

function numberToSpanishWord(num: number): string {
  const exactWords: Record<number, string> = {
    1: 'Uno',
    2: 'Dos',
    3: 'Tres',
    4: 'Cuatro',
    5: 'Cinco',
    6: 'Seis',
    7: 'Siete',
    8: 'Ocho',
    9: 'Nueve',
    10: 'Diez',
    11: 'Once',
    12: 'Doce',
    13: 'Trece',
    14: 'Catorce',
    15: 'Quince',
    16: 'Dieciséis',
    17: 'Diecisiete',
    18: 'Dieciocho',
    19: 'Diecinueve',
    20: 'Veinte',
    21: 'Veintiuno',
    22: 'Veintidós',
    23: 'Veintitrés',
    24: 'Veinticuatro',
    25: 'Veinticinco',
    26: 'Veintiséis',
    27: 'Veintisiete',
    28: 'Veintiocho',
    29: 'Veintinueve',
    30: 'Treinta',
    40: 'Cuarenta',
    50: 'Cincuenta',
    60: 'Sesenta',
    70: 'Setenta',
    80: 'Ochenta',
    90: 'Noventa',
    100: 'Cien'
  };

  if (exactWords[num]) {
    return exactWords[num];
  }

  const tens = Math.floor(num / 10) * 10;
  const units = num % 10;
  const tensWord = exactWords[tens] ?? '';
  const unitsWord = (exactWords[units] ?? '').toLowerCase();

  return `${tensWord} y ${unitsWord}`;
}

// ==========================================
// FUNCIONES AUXILIARES PURAS
// ==========================================

function getTodayIsoDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0] ?? '2026-10-17';
}

function getDefaultProgress(): UserProgress {
  return {
    childFullName: 'VALENTINA GARCÍA LÓPEZ',
    stars: 0,
    streakDays: 1,
    lastActiveDate: getTodayIsoDate(),
    minutesToday: 0,
    masteredIds: [],
    quizScores: [],
    dailyMissions: {
      tracedPriorityLetter: false,
      tracedOwnName: false,
      practicedDate: false,
      completedReading: false,
      solvedMath: false,
      completedDailyQuiz: false
    }
  };
}

function loadSavedProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return getDefaultProgress();
    }
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    const today = getTodayIsoDate();
    const isSameDay = parsed.lastActiveDate === today;

    return {
      childFullName: parsed.childFullName ?? 'VALENTINA GARCÍA LÓPEZ',
      stars: parsed.stars ?? 0,
      streakDays: parsed.streakDays ?? 1,
      lastActiveDate: today,
      minutesToday: isSameDay ? (parsed.minutesToday ?? 0) : 0,
      masteredIds: parsed.masteredIds ?? [],
      quizScores: parsed.quizScores ?? [],
      dailyMissions:
        isSameDay && parsed.dailyMissions
          ? parsed.dailyMissions
          : getDefaultProgress().dailyMissions
    };
  } catch (error: unknown) {
    console.error('Error al cargar el progreso desde localStorage:', error);
    return getDefaultProgress();
  }
}

function speakSpanish(text: string): void {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Ajustes pedagógicos: un poco más lento para que vocalice mejor
    utterance.lang = 'es-MX';
    utterance.rate = 0.85; // Más lento y claro (por defecto es 1)
    utterance.pitch = 1.1; // Tono ligeramente más agudo/infantil
    
    // Buscar la mejor voz disponible en el dispositivo
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Prioridades de voces premium en español de México/Latino
      const preferredVoices = [
        'Paulina', // iOS / Mac (Excelente calidad)
        'Google español', // Android / Chrome
        'Sabina', // Windows
        'es-MX',
        'es-LA'
      ];
      
      let selectedVoice = null;
      for (const pref of preferredVoices) {
        selectedVoice = voices.find(v => v.name.includes(pref) || v.lang.includes(pref));
        if (selectedVoice) break;
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    // Bugfix para cargar voces en algunos navegadores (Chrome/Safari)
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        speakSpanish(text); // Reintenta cuando carguen las voces
      };
    } else {
      window.speechSynthesis.speak(utterance);
    }
  } catch (error: unknown) {
    console.error('Error al reproducir voz:', error);
  }
}
function triggerCelebration(): void {
  try {
    const animationPromise = confetti({
      particleCount: 70,
      spread: 65,
      origin: { y: 0.6 }
    });

    animationPromise?.catch((err: unknown) => {
      console.error('Error en animación de confeti:', err);
    });
  } catch (error: unknown) {
    console.error('Error al disparar confeti:', error);
  }
}

function buildTensAndUnitsTokens(numberValue: number): VisualToken[] {
  const tokens: VisualToken[] = [];
  const tensCount = Math.floor(numberValue / 10);
  const unitsCount = numberValue % 10;

  for (let i = 1; i <= tensCount; i += 1) {
    tokens.push({
      id: `ten-pack-${i}`,
      emoji: '🌟',
      value: 10,
      label: '+10'
    });
  }

  for (let j = 1; j <= unitsCount; j += 1) {
    tokens.push({
      id: `unit-item-${j}`,
      emoji: '🍓',
      value: 1,
      label: '+1'
    });
  }

  return tokens;
}

function buildSimpleMathTokens(count: number, prefix: string, emoji: string): { id: string; emoji: string }[] {
  const list: { id: string; emoji: string }[] = [];
  for (let i = 1; i <= count; i += 1) {
    list.push({ id: `${prefix}-${i}`, emoji });
  }
  return list;
}

function createRandomMathChallenge(): MathChallenge {
  const isAddition = Math.random() > 0.45;
  const emojis = ['🍎', '🍓', '⭐', '🐢', '🎈'];
  const randomIndex = Math.floor(Math.random() * emojis.length);
  const emoji = emojis[randomIndex] ?? '🍎';

  let numA = Math.floor(Math.random() * 10) + 2;
  let numB = Math.floor(Math.random() * 8) + 1;

  if (!isAddition && numB > numA) {
    const temp = numA;
    numA = numB;
    numB = temp;
  }

  const answer = isAddition ? numA + numB : numA - numB;
  const wrongA = answer + 1;
  const wrongB = answer > 1 ? answer - 1 : answer + 2;

  const rawOptions = [
    { id: `opt-correct-${answer}`, value: answer },
    { id: `opt-wrong1-${wrongA}`, value: wrongA },
    { id: `opt-wrong2-${wrongB}`, value: wrongB }
  ];

  rawOptions.sort((a, b) => a.value - b.value);

  return {
    id: `math-${Date.now()}`,
    numA,
    numB,
    operator: isAddition ? '+' : '-',
    answer,
    options: rawOptions,
    emoji
  };
}

function addMasteredIdToList(list: string[], newId: string): string[] {
  if (list.includes(newId)) {
    return list;
  }
  return [...list, newId];
}

// ==========================================
// COMPONENTE: PIZARRA TÁCTIL DE TRAZO
// ==========================================

interface DrawingBoardProps {
  guideText: string;
  subtitle: string;
  onCompleteTrace: () => void;
}

const DrawingBoard: React.FC<DrawingBoardProps> = ({
  guideText,
  subtitle,
  onCompleteTrace
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasDrawnStrokes, setHasDrawnStrokes] = useState<boolean>(false);

  const clearCanvas = useCallback((): void => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnStrokes(false);
  }, []);

  useEffect(() => {
    clearCanvas();
  }, [guideText, clearCanvas]);

  const getCoordinates = (
    event: React.PointerEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ): { x: number; y: number } => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>): void => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    const coords = getCoordinates(event, canvas);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#7c3aed';
    setIsDrawing(true);
    setHasDrawnStrokes(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>): void => {
    if (!isDrawing) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    const coords = getCoordinates(event, canvas);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const handlePointerUp = (): void => {
    setIsDrawing(false);
  };

  const handleConfirmTrace = (): void => {
    if (!hasDrawnStrokes) {
      speakSpanish('Primero escribe sobre las letras o números con tu dedito.');
      return;
    }
    onCompleteTrace();
    clearCanvas();
  };

  let guideFontSizeClass = 'text-7xl md:text-8xl';
  if (guideText.length > 18) {
    guideFontSizeClass = 'text-2xl sm:text-4xl md:text-5xl tracking-wide';
  } else if (guideText.length > 8) {
    guideFontSizeClass = 'text-4xl sm:text-5xl md:text-6xl tracking-wider';
  }

  return (
    <div className="bg-white rounded-3xl p-4 md:p-6 shadow-lg border-4 border-purple-200">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h4 className="text-lg md:text-xl font-bold text-purple-900 flex items-center gap-2">
            <PenTool className="w-5 h-5 text-purple-600" />
            Pizarra Mágica para Escribir
          </h4>
          <p className="text-sm text-purple-600">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearCanvas}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-rose-100 text-rose-700 font-bold hover:bg-rose-200 active:scale-95 transition"
          >
            <Eraser className="w-5 h-5" />
            Borrar
          </button>
          <button
            type="button"
            onClick={handleConfirmTrace}
            className="flex items-center gap-1.5 px-5 py-2 rounded-2xl bg-emerald-500 text-white font-bold shadow-md hover:bg-emerald-600 active:scale-95 transition"
          >
            <CheckCircle2 className="w-5 h-5" />
            ¡Lo escribí!
          </button>
        </div>
      </div>

      <div className="relative w-full h-56 md:h-64 rounded-2xl bg-amber-50/70 border-4 border-dashed border-purple-300 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-x-0 top-1/2 border-b-2 border-dashed border-purple-200 pointer-events-none" />
        <span
          className={`font-bold text-purple-200/85 select-none pointer-events-none text-center px-3 leading-tight ${guideFontSizeClass}`}
        >
          {guideText}
        </span>

        <canvas
          ref={canvasRef}
          width={900}
          height={280}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL: APP
// ==========================================

export function App(): React.ReactElement {
  const [progress, setProgress] = useState<UserProgress>(() => loadSavedProgress());
  const [activeModule, setActiveModule] = useState<ModuleId>('letters');

  // Estado Módulo 1: Abecedario Completo + Nombre con Apellidos + Juego Identificar
  const [selectedLetterId, setSelectedLetterId] = useState<string>('let-t');
  const [lettersSubMode, setLettersSubMode] = useState<'alphabet' | 'fullname' | 'findgame'>('alphabet');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInputDraft, setNameInputDraft] = useState<string>(progress.childFullName);
  const [selectedNamePartIndex, setSelectedNamePartIndex] = useState<number>(-1); // -1 = Nombre completo
  const [targetFindLetter, setTargetFindLetter] = useState<LetterItem>(() => LETTERS_DATA[20] ?? LETTERS_DATA[0]);
  const [findGameFeedback, setFindGameFeedback] = useState<string>('');

  // Estado Módulo 2: Calendario y Fechas (Días, Meses, Años)
  const [selectedDayName, setSelectedDayName] = useState<string>('Sábado');
  const [selectedDayNum, setSelectedDayNum] = useState<number>(17);
  const [selectedMonthName, setSelectedMonthName] = useState<string>('Octubre');
  const [selectedYearVal, setSelectedYearVal] = useState<string>('2026');
  const [calendarTraceTarget, setCalendarTraceTarget] = useState<'day' | 'month' | 'year' | 'fulldate'>('fulldate');

  // Estado Módulo 3: Cuentos de Lectura
  const [selectedStoryId, setSelectedStoryId] = useState<string>('story-tito-susi');
  const [activeSentenceId, setActiveSentenceId] = useState<string>('');
  const [storyFeedback, setStoryFeedback] = useState<string>('');

  // Estado Módulo 4: Números del 1 al 100
  const [numberRangeStart, setNumberRangeStart] = useState<number>(1); // 1, 21, 41, 61, 81
  const [selectedNumberVal, setSelectedNumberVal] = useState<number>(1);
  const [tappedTokenIds, setTappedTokenIds] = useState<string[]>([]);
  const [accumulatedCount, setAccumulatedCount] = useState<number>(0);

  // Estado Módulo 5: Sumas y Restas
  const [mathChallenge, setMathChallenge] = useState<MathChallenge>(() =>
    createRandomMathChallenge()
  );
  const [mathFeedback, setMathFeedback] = useState<string>('');

  // Estado Módulo 6: Quiz Diario / Semanal
  const [quizMode, setQuizMode] = useState<'diario' | 'semanal'>('diario');
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Guardar progreso automáticamente
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error: unknown) {
      console.error('No se pudo guardar el progreso en localStorage:', error);
    }
  }, [progress]);

  // Temporizador de sesión de estudio (1 minuto cada 60s)
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setProgress((prev) => ({
        ...prev,
        minutesToday: prev.minutesToday + 1
      }));
    }, 60000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const currentLetter = useMemo((): LetterItem => {
    const found = LETTERS_DATA.find((item) => item.id === selectedLetterId);
    return found ?? LETTERS_DATA[0];
  }, [selectedLetterId]);

  const nameWords = useMemo((): string[] => {
    return progress.childFullName
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
  }, [progress.childFullName]);

  const currentStory = useMemo((): ReadingStory => {
    const found = STORIES_DATA.find((item) => item.id === selectedStoryId);
    return found ?? STORIES_DATA[0];
  }, [selectedStoryId]);

  const activeQuizQuestions = useMemo((): QuizQuestion[] => {
    if (quizMode === 'diario') {
      return QUIZ_BANK.slice(0, 5);
    }
    return QUIZ_BANK;
  }, [quizMode]);

  // ==========================================
  // MANEJADORES DE PROGRESO Y EVENTOS
  // ==========================================

  const awardProgress = useCallback(
    (starsToAdd: number, masteredItemId: string, missionKey?: keyof DailyMissions): void => {
      triggerCelebration();
      setProgress((prev) => {
        const updatedMastered = addMasteredIdToList(prev.masteredIds, masteredItemId);
        const updatedMissions = { ...prev.dailyMissions };
        if (missionKey) {
          updatedMissions[missionKey] = true;
        }
        return {
          ...prev,
          stars: prev.stars + starsToAdd,
          masteredIds: updatedMastered,
          dailyMissions: updatedMissions
        };
      });
    },
    []
  );

  const handleSaveChildFullName = (): void => {
    const cleaned = nameInputDraft.trim().toUpperCase();
    const validName = cleaned.length > 0 ? cleaned : 'VALENTINA GARCÍA LÓPEZ';
    setProgress((prev) => ({
      ...prev,
      childFullName: validName
    }));
    setNameInputDraft(validName);
    setSelectedNamePartIndex(-1);
    setIsEditingName(false);
    speakSpanish(`¡Hola ${validName}! Vamos a aprender hoy.`);
  };

  const pickRandomFindLetter = useCallback((): void => {
    // Damos mayor probabilidad a T y S para reforzar
    const priorityPool = LETTERS_DATA.filter((l) => l.isPriority);
    const usePriority = Math.random() < 0.35 && priorityPool.length > 0;
    const pool = usePriority ? priorityPool : LETTERS_DATA;
    const randomIdx = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIdx] ?? LETTERS_DATA[0];
    setTargetFindLetter(chosen);
    setFindGameFeedback('');
    speakSpanish(`Busca y toca la letra ${chosen.name}, de ${chosen.word}`);
  }, []);

  const handleTapLetterInFindGame = (item: LetterItem): void => {
    if (item.id === targetFindLetter.id) {
      setFindGameFeedback(`¡Excelente! Encontraste la letra ${item.name} de ${item.word}.`);
      speakSpanish(`¡Muy bien! Esa es la letra ${item.name} de ${item.word}.`);
      awardProgress(2, `find-${item.id}`, item.isPriority ? 'tracedPriorityLetter' : undefined);
      window.setTimeout(() => {
        pickRandomFindLetter();
      }, 1600);
    } else {
      setFindGameFeedback(`Esa es la letra ${item.name}. ¡Busca la letra ${targetFindLetter.name} de ${targetFindLetter.word}!`);
      speakSpanish(`Esa es la ${item.name}. Busca la letra ${targetFindLetter.name} de ${targetFindLetter.word}.`);
    }
  };

  const handleSelectNumber = (val: number): void => {
    const word = numberToSpanishWord(val);
    setSelectedNumberVal(val);
    setTappedTokenIds([]);
    setAccumulatedCount(0);
    speakSpanish(`Número ${val}, ${word}`);
  };

  const handleTapVisualToken = (token: VisualToken): void => {
    if (tappedTokenIds.includes(token.id)) {
      return;
    }
    const nextTotal = accumulatedCount + token.value;
    setTappedTokenIds((prev) => [...prev, token.id]);
    setAccumulatedCount(nextTotal);
    speakSpanish(`${nextTotal}`);
  };

  const handleAnswerStoryQuestion = (isCorrect: boolean): void => {
    if (!isCorrect) {
      setStoryFeedback('¡Casi! Escucha el cuento otra vez e inténtalo de nuevo.');
      speakSpanish('Casi. Inténtalo de nuevo.');
      return;
    }
    setStoryFeedback('¡Correcto! Leíste y comprendiste el cuento súper bien.');
    speakSpanish('¡Muy bien! Respuesta correcta.');
    awardProgress(3, currentStory.id, 'completedReading');
  };

  const handleAnswerMath = (selectedValue: number): void => {
    if (selectedValue !== mathChallenge.answer) {
      setMathFeedback('Cuenta los dibujos despacito con tu dedo e inténtalo otra vez.');
      speakSpanish('Cuenta los dibujos con tu dedito e inténtalo otra vez.');
      return;
    }
    setMathFeedback('¡Súper bien! Ganaste 2 estrellas.');
    speakSpanish(`¡Correcto! La respuesta es ${mathChallenge.answer}.`);
    awardProgress(2, mathChallenge.id, 'solvedMath');
    window.setTimeout(() => {
      setMathFeedback('');
      setMathChallenge(createRandomMathChallenge());
    }, 1500);
  };

  const handleAnswerQuizOption = (isCorrect: boolean): void => {
    const nextScore = isCorrect ? quizScore + 1 : quizScore;
    if (isCorrect) {
      speakSpanish('¡Excelente!');
    } else {
      speakSpanish('Sigue practicando, tú puedes.');
    }

    if (quizIndex + 1 < activeQuizQuestions.length) {
      setQuizScore(nextScore);
      setQuizIndex((prev) => prev + 1);
      return;
    }

    setQuizScore(nextScore);
    setQuizFinished(true);
    triggerCelebration();
    const recordId = `quiz-${Date.now()}`;
    setProgress((prev) => ({
      ...prev,
      stars: prev.stars + nextScore * 2,
      dailyMissions: {
        ...prev.dailyMissions,
        completedDailyQuiz: true
      },
      quizScores: [
        {
          id: recordId,
          date: getTodayIsoDate(),
          score: nextScore,
          total: activeQuizQuestions.length,
          type: quizMode
        },
        ...prev.quizScores.slice(0, 9)
      ]
    }));
  };

  const handleResetQuiz = (mode: 'diario' | 'semanal'): void => {
    setQuizMode(mode);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
  };

  // ==========================================
  // FUNCIONES DE RENDERIZADO POR MÓDULO
  // ==========================================

  const renderNameEditorBar = (): React.ReactElement => {
    if (isEditingName) {
      return (
        <div className="flex flex-wrap items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border-2 border-purple-300">
          <input
            type="text"
            value={nameInputDraft}
            onChange={(e) => setNameInputDraft(e.target.value)}
            maxLength={38}
            className="w-56 md:w-72 font-bold text-purple-900 uppercase focus:outline-none text-sm"
            placeholder="NOMBRE Y APELLIDOS"
          />
          <button
            type="button"
            onClick={handleSaveChildFullName}
            className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl"
          >
            Guardar Nombre Completo
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => setIsEditingName(true)}
        className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-900 px-3.5 py-1.5 rounded-2xl font-bold text-xs md:text-sm transition"
      >
        <UserCheck className="w-4 h-4 text-purple-700 shrink-0" />
        <span>{progress.childFullName} (Editar nombre y apellidos)</span>
      </button>
    );
  };

  const renderLettersAndNameModule = (): React.ReactElement => {
    const activeNameTextToTrace =
      selectedNamePartIndex === -1
        ? progress.childFullName
        : (nameWords[selectedNamePartIndex] ?? progress.childFullName);

    const drawingGuideText =
      lettersSubMode === 'fullname' ? activeNameTextToTrace : currentLetter.char;

    const drawingSubtitle =
      lettersSubMode === 'fullname'
        ? `Escribe "${activeNameTextToTrace}" siguiendo las letras guía.`
        : `Traza la letra ${currentLetter.name} de ${currentLetter.word} mientras repites su sonido.`;

    return (
      <div className="space-y-6">
        {/* Sub-navegación del Módulo 1 */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl shadow-sm border-2 border-amber-200">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setLettersSubMode('alphabet');
                speakSpanish('Explora todas las letras del abecedario de la A a la Zeta.');
              }}
              className={`px-4 py-2.5 rounded-2xl font-bold text-sm md:text-base transition ${
                lettersSubMode === 'alphabet'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              🔤 Todo el Abecedario (A-Z)
            </button>

            <button
              type="button"
              onClick={() => {
                setLettersSubMode('findgame');
                pickRandomFindLetter();
              }}
              className={`px-4 py-2.5 rounded-2xl font-bold text-sm md:text-base transition flex items-center gap-1.5 ${
                lettersSubMode === 'findgame'
                  ? 'bg-amber-400 text-amber-950 shadow-md'
                  : 'bg-amber-100 text-amber-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              Juego: Identifica la Letra
            </button>

            <button
              type="button"
              onClick={() => {
                setLettersSubMode('fullname');
                speakSpanish(`Vamos a escribir tu nombre completo: ${progress.childFullName}`);
              }}
              className={`px-4 py-2.5 rounded-2xl font-bold text-sm md:text-base transition ${
                lettersSubMode === 'fullname'
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-pink-100 text-pink-800'
              }`}
            >
              ✍️ Mi Nombre y Apellidos
            </button>
          </div>
        </div>

        {/* MODO JUEGO: IDENTIFICAR LA LETRA POR SONIDO */}
        {lettersSubMode === 'findgame' && (
          <div className="bg-amber-50 rounded-3xl p-6 border-4 border-amber-300 shadow-md space-y-4 text-center">
            <h3 className="text-2xl font-extrabold text-amber-950">
              🎧 Escucha y busca la letra en el abecedario de abajo:
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  speakSpanish(
                    `Busca la letra ${targetFindLetter.name}, como en la palabra ${targetFindLetter.word}`
                  )
                }
                className="inline-flex items-center gap-2 bg-purple-600 text-white font-extrabold px-6 py-3 rounded-2xl shadow hover:bg-purple-700 active:scale-95 transition text-lg"
              >
                <Volume2 className="w-6 h-6" />
                Escuchar qué letra buscar ({targetFindLetter.emoji} {targetFindLetter.word})
              </button>
              <button
                type="button"
                onClick={pickRandomFindLetter}
                className="inline-flex items-center gap-1.5 bg-white text-purple-800 font-bold px-4 py-3 rounded-2xl border-2 border-purple-200"
              >
                <RefreshCw className="w-4 h-4" />
                Otra letra
              </button>
            </div>
            {findGameFeedback.length > 0 && (
              <p className="font-extrabold text-lg text-purple-900 bg-white py-2.5 px-4 rounded-2xl inline-block shadow-sm">
                {findGameFeedback}
              </p>
            )}
          </div>
        )}

        {/* CUADRÍCULA DE LAS 27 LETRAS DEL ABECEDARIO */}
        {lettersSubMode !== 'fullname' && (
          <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
            {LETTERS_DATA.map((item) => {
              const isSelected = item.id === currentLetter.id && lettersSubMode === 'alphabet';
              const isMastered = progress.masteredIds.includes(item.id);
              const priorityStyle = item.isPriority
                ? 'ring-4 ring-amber-400 bg-amber-50'
                : 'bg-white';
              const activeStyle = isSelected
                ? 'bg-purple-600 text-white scale-105 shadow-lg'
                : `${priorityStyle} text-purple-900 hover:bg-purple-50`;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (lettersSubMode === 'findgame') {
                      handleTapLetterInFindGame(item);
                      return;
                    }
                    setSelectedLetterId(item.id);
                    speakSpanish(`Letra ${item.name}, de ${item.word}`);
                  }}
                  className={`relative p-2.5 rounded-2xl font-bold text-lg border-2 border-purple-200 transition flex flex-col items-center ${activeStyle}`}
                >
                  <span className="text-xl font-extrabold">{item.upper}</span>
                  <span className="text-base">{item.emoji}</span>
                  {item.isPriority && (
                    <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-amber-950 text-[10px] font-extrabold px-1.5 rounded-full">
                      ★
                    </span>
                  )}
                  {isMastered && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 absolute bottom-1 right-1" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* SECCIÓN DE NOMBRE COMPLETO CON APELLIDOS */}
        {lettersSubMode === 'fullname' && (
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase bg-white/20 px-3 py-1 rounded-full">
                  Mi Identidad: Nombre y Apellidos
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold mt-2">
                  {progress.childFullName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() =>
                  speakSpanish(`Mi nombre completo es ${progress.childFullName}`)
                }
                className="inline-flex items-center gap-2 bg-amber-300 text-amber-950 font-bold px-5 py-3 rounded-2xl shadow hover:bg-amber-200 transition"
              >
                <Volume2 className="w-5 h-5" />
                Escuchar mi nombre completo
              </button>
            </div>

            {/* Selector para practicar Nombre Completo o cada Apellido por separado */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-pink-100">
                👇 Elige si quieres practicar todo tu nombre junto o palabra por palabra (nombre y cada apellido):
              </p>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNamePartIndex(-1);
                    speakSpanish(progress.childFullName);
                  }}
                  className={`px-4 py-2.5 rounded-2xl font-extrabold text-sm md:text-base transition ${
                    selectedNamePartIndex === -1
                      ? 'bg-amber-300 text-amber-950 shadow-md scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  🌟 Nombre Completo
                </button>
                {nameWords.map((wordPart, idx) => {
                  const partRole =
                    idx === 0
                      ? 'Nombre'
                      : idx === 1
                        ? '1° Apellido'
                        : '2° Apellido';
                  return (
                    <button
                      key={`name-word-${wordPart}-${idx}`}
                      type="button"
                      onClick={() => {
                        setSelectedNamePartIndex(idx);
                        speakSpanish(`${partRole}: ${wordPart}`);
                      }}
                      className={`px-4 py-2.5 rounded-2xl font-extrabold text-sm md:text-base transition ${
                        selectedNamePartIndex === idx
                          ? 'bg-amber-300 text-amber-950 shadow-md scale-105'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {partRole}: {wordPart}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Deletreo interactivo letra por letra */}
            <div className="bg-white/15 rounded-2xl p-4">
              <p className="text-xs font-bold uppercase text-pink-100 mb-2">
                Toca cada letra para escuchar su sonido:
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from(activeNameTextToTrace).map((ch, idx) => {
                  if (ch === ' ') {
                    return <div key={`space-${idx}`} className="w-4" />;
                  }
                  return (
                    <button
                      key={`char-${ch}-${idx}`}
                      type="button"
                      onClick={() => speakSpanish(ch)}
                      className="w-11 h-12 md:w-12 md:h-14 rounded-xl bg-white text-purple-900 font-extrabold text-2xl shadow hover:scale-110 active:scale-95 transition flex items-center justify-center"
                    >
                      {ch}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TARJETA DE FONÉTICA Y SÍLABAS DE LA LETRA SELECCIONADA */}
        {lettersSubMode === 'alphabet' && (
          <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-purple-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-3xl bg-purple-100 flex items-center justify-center text-6xl shadow-inner">
                {currentLetter.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-extrabold text-purple-900">
                    {currentLetter.char}
                  </span>
                  {currentLetter.isPriority && (
                    <span className="bg-amber-200 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">
                      Refuerzo Especial T y S
                    </span>
                  )}
                </div>
                <p className="text-xl text-purple-700 font-semibold mt-1">
                  Letra <strong>{currentLetter.name}</strong> de{' '}
                  <strong className="underline decoration-amber-400">
                    {currentLetter.word}
                  </strong>
                </p>
                <button
                  type="button"
                  onClick={() =>
                    speakSpanish(
                      `Esta es la letra ${currentLetter.name}, como en la palabra ${currentLetter.word}.`
                    )
                  }
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 active:scale-95 transition"
                >
                  <Volume2 className="w-4 h-4" />
                  Escuchar letra y palabra
                </button>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <p className="text-xs font-bold uppercase text-purple-500 mb-2 text-center md:text-left">
                Toca las sílabas para pronunciarlas:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {currentLetter.syllables.map((syl) => (
                  <button
                    key={syl.id}
                    type="button"
                    onClick={() => speakSpanish(syl.text)}
                    className="px-4 py-3 rounded-2xl bg-amber-100 hover:bg-amber-300 text-amber-950 font-extrabold text-xl uppercase shadow-sm active:scale-95 transition"
                  >
                    {syl.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pizarra Mágica */}
        <DrawingBoard
          guideText={drawingGuideText}
          subtitle={drawingSubtitle}
          onCompleteTrace={() => {
            if (lettersSubMode === 'fullname') {
              speakSpanish(`¡Excelente! Escribiste ${activeNameTextToTrace} súper bien.`);
              awardProgress(3, `name-${activeNameTextToTrace}`, 'tracedOwnName');
              return;
            }
            speakSpanish(
              `¡Muy bien! Trazaste la letra ${currentLetter.name} de ${currentLetter.word}.`
            );
            awardProgress(
              2,
              currentLetter.id,
              currentLetter.isPriority ? 'tracedPriorityLetter' : undefined
            );
          }}
        />
      </div>
    );
  };

  // ==========================================
  // MÓDULO 2: DÍAS DE LA SEMANA, MESES Y AÑOS (FECHAS)
  // ==========================================

  const renderCalendarModule = (): React.ReactElement => {
    const fullDateString = `${selectedDayName} ${selectedDayNum} de ${selectedMonthName} de ${selectedYearVal}`;

    let calendarGuideText = fullDateString;
    if (calendarTraceTarget === 'day') {
      calendarGuideText = selectedDayName;
    } else if (calendarTraceTarget === 'month') {
      calendarGuideText = selectedMonthName;
    } else if (calendarTraceTarget === 'year') {
      calendarGuideText = selectedYearVal;
    }

    return (
      <div className="space-y-6">
        {/* Banner de Fecha Completa Interactiva */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase bg-white/20 px-3 py-1 rounded-full">
              📅 Hoy aprendo a escribir la fecha
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold mt-2">
              {fullDateString}
            </h3>
            <p className="text-sm text-teal-100 mt-1">
              Toca un día, un número, un mes y un año abajo para armar la fecha y escribirla.
            </p>
          </div>
          <button
            type="button"
            onClick={() => speakSpanish(`Hoy es ${fullDateString}`)}
            className="inline-flex items-center gap-2 bg-amber-300 text-amber-950 font-extrabold px-5 py-3 rounded-2xl shadow hover:bg-amber-200 transition shrink-0"
          >
            <Volume2 className="w-5 h-5" />
            Escuchar fecha completa
          </button>
        </div>

        {/* 1. Los 7 Días de la Semana */}
        <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-teal-200 space-y-3">
          <h4 className="text-lg font-extrabold text-teal-950">
            1. Los 7 Días de la Semana (toca uno para escucharlo):
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = day.name === selectedDayName;
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => {
                    setSelectedDayName(day.name);
                    setCalendarTraceTarget('day');
                    speakSpanish(`${day.name}. ${day.clue}`);
                  }}
                  className={`p-3 rounded-2xl font-bold text-center border-2 transition flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-700 scale-105 shadow-md'
                      : 'bg-teal-50/70 text-teal-950 border-teal-200 hover:bg-teal-100'
                  }`}
                >
                  <span className="text-2xl">{day.emoji}</span>
                  <span className="text-base font-extrabold">{day.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Los 12 Meses del Año */}
        <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-teal-200 space-y-3">
          <h4 className="text-lg font-extrabold text-teal-950">
            2. Los 12 Meses del Año:
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {MONTHS_OF_YEAR.map((month) => {
              const isSelected = month.name === selectedMonthName;
              return (
                <button
                  key={month.id}
                  type="button"
                  onClick={() => {
                    setSelectedMonthName(month.name);
                    setCalendarTraceTarget('month');
                    speakSpanish(`Mes ${month.number}: ${month.name}`);
                  }}
                  className={`p-3 rounded-2xl font-bold border-2 transition flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-700 scale-105 shadow-md'
                      : 'bg-emerald-50/60 text-emerald-950 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <span className="text-xl">{month.emoji}</span>
                  <span className="text-sm md:text-base font-extrabold">
                    {month.number}. {month.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Día del Mes y Años */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-teal-200 space-y-3">
            <h4 className="text-base font-extrabold text-teal-950">
              3. Número del Día ({selectedDayNum}):
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[1, 5, 10, 15, 17, 20, 25, 30].map((dNum) => (
                <button
                  key={`dnum-${dNum}`}
                  type="button"
                  onClick={() => {
                    setSelectedDayNum(dNum);
                    speakSpanish(`Día ${numberToSpanishWord(dNum)}`);
                  }}
                  className={`w-11 h-11 rounded-xl font-extrabold text-base border-2 transition ${
                    selectedDayNum === dNum
                      ? 'bg-teal-600 text-white border-teal-700'
                      : 'bg-teal-50 text-teal-900 border-teal-200'
                  }`}
                >
                  {dNum}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-teal-200 space-y-3">
            <h4 className="text-base font-extrabold text-teal-950">
              4. El Año Actual:
            </h4>
            <div className="grid grid-cols-3 gap-2.5">
              {YEARS_LIST.map((yr) => {
                const isSelected = yr.value === selectedYearVal;
                return (
                  <button
                    key={yr.id}
                    type="button"
                    onClick={() => {
                      setSelectedYearVal(yr.value);
                      setCalendarTraceTarget('year');
                      speakSpanish(`Año ${yr.spoken}`);
                    }}
                    className={`py-3 rounded-2xl font-extrabold text-xl border-2 transition ${
                      isSelected
                        ? 'bg-amber-400 text-amber-950 border-amber-500 shadow'
                        : 'bg-amber-50 text-amber-900 border-amber-200'
                    }`}
                  >
                    {yr.value}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selector de qué parte trazar en la pizarra */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border-2 border-purple-200">
          <span className="text-sm font-bold text-purple-900 mr-2">
            ¿Qué quieres practicar en la pizarra?
          </span>
          <button
            type="button"
            onClick={() => setCalendarTraceTarget('day')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-sm ${
              calendarTraceTarget === 'day'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-800'
            }`}
          >
            Día ({selectedDayName})
          </button>
          <button
            type="button"
            onClick={() => setCalendarTraceTarget('month')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-sm ${
              calendarTraceTarget === 'month'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-800'
            }`}
          >
            Mes ({selectedMonthName})
          </button>
          <button
            type="button"
            onClick={() => setCalendarTraceTarget('year')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-sm ${
              calendarTraceTarget === 'year'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-800'
            }`}
          >
            Año ({selectedYearVal})
          </button>
          <button
            type="button"
            onClick={() => setCalendarTraceTarget('fulldate')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-sm ${
              calendarTraceTarget === 'fulldate'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-800'
            }`}
          >
            Fecha Corta ({selectedDayName} {selectedDayNum} {selectedMonthName})
          </button>
        </div>

        <DrawingBoard
          guideText={
            calendarTraceTarget === 'fulldate'
              ? `${selectedDayName} ${selectedDayNum} ${selectedMonthName}`
              : calendarGuideText
          }
          subtitle="Traza el día, el mes, el año o la fecha con tu dedo."
          onCompleteTrace={() => {
            speakSpanish(`¡Muy bien! Aprendiste a escribir la fecha: ${fullDateString}`);
            awardProgress(3, `date-${selectedDayName}-${selectedMonthName}`, 'practicedDate');
          }}
        />
      </div>
    );
  };

  // ==========================================
  // MÓDULO 3: CUENTOS DE LECTURA (7 HISTORIAS)
  // ==========================================

  const renderReadingModule = (): React.ReactElement => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {STORIES_DATA.map((story) => {
            const isSelected = story.id === currentStory.id;
            const isMastered = progress.masteredIds.includes(story.id);
            return (
              <button
                key={story.id}
                type="button"
                onClick={() => {
                  setSelectedStoryId(story.id);
                  setStoryFeedback('');
                  speakSpanish(story.title);
                }}
                className={`p-3.5 rounded-2xl font-bold text-left transition border-2 flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                    : 'bg-white text-emerald-900 border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                <span className="text-sm md:text-base">📖 {story.title}</span>
                {isMastered && <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />}
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-emerald-200 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-emerald-100 pb-4">
            <div>
              <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                {currentStory.focusInfo}
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-emerald-950 mt-2">
                {currentStory.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                const fullText = currentStory.sentences.map((s) => s.text).join(' ');
                speakSpanish(fullText);
              }}
              className="flex items-center gap-2 bg-emerald-600 text-white font-bold px-5 py-3 rounded-2xl shadow hover:bg-emerald-700 active:scale-95 transition"
            >
              <Volume2 className="w-5 h-5" />
              Escuchar todo el cuento
            </button>
          </div>

          <p className="text-sm text-emerald-700 font-semibold">
            👉 Toca cada renglón con tu dedo para escucharlo y repetirlo en voz alta:
          </p>

          <div className="space-y-3">
            {currentStory.sentences.map((sentence) => {
              const isHighlighted = activeSentenceId === sentence.id;
              return (
                <button
                  key={sentence.id}
                  type="button"
                  onClick={() => {
                    setActiveSentenceId(sentence.id);
                    speakSpanish(sentence.text);
                  }}
                  className={`w-full text-left p-4 rounded-2xl text-xl md:text-2xl font-bold transition flex items-center justify-between ${
                    isHighlighted
                      ? 'bg-amber-200 text-amber-950 ring-4 ring-amber-400'
                      : 'bg-emerald-50/70 text-emerald-950 hover:bg-emerald-100'
                  }`}
                >
                  <span>{sentence.text}</span>
                  <Volume2 className="w-6 h-6 text-emerald-600 shrink-0 ml-2" />
                </button>
              );
            })}
          </div>

          <div className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-200 space-y-4">
            <h4 className="text-lg md:text-xl font-extrabold text-amber-950">
              🤔 Pregunta de Comprensión: {currentStory.question}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentStory.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleAnswerStoryQuestion(opt.isCorrect)}
                  className="p-4 rounded-2xl bg-white hover:bg-amber-200 text-amber-950 font-bold text-lg border-2 border-amber-300 shadow-sm active:scale-95 transition"
                >
                  {opt.text}
                </button>
              ))}
            </div>
            {storyFeedback.length > 0 && (
              <p className="font-bold text-emerald-800 bg-emerald-100 px-4 py-2 rounded-xl">
                {storyFeedback}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // MÓDULO 4: NÚMEROS DEL 1 AL 100
  // ==========================================

  const renderNumbersModule = (): React.ReactElement => {
    const rangeNumbers: number[] = [];
    for (let n = numberRangeStart; n < numberRangeStart + 20 && n <= 100; n += 1) {
      rangeNumbers.push(n);
    }

    const currentNumberWord = numberToSpanishWord(selectedNumberVal);
    const visualTokens = buildTensAndUnitsTokens(selectedNumberVal);
    const tensCount = Math.floor(selectedNumberVal / 10);
    const unitsCount = selectedNumberVal % 10;

    return (
      <div className="space-y-6">
        {/* Pestañas de bloques de 20 en 20 hasta el 100 */}
        <div className="flex flex-wrap gap-2 bg-white p-3 rounded-3xl border-2 border-sky-200">
          {[
            { start: 1, label: 'Del 1 al 20' },
            { start: 21, label: 'Del 21 al 40' },
            { start: 41, label: 'Del 41 al 60' },
            { start: 61, label: 'Del 61 al 80' },
            { start: 81, label: 'Del 81 al 100' }
          ].map((group) => (
            <button
              key={`range-${group.start}`}
              type="button"
              onClick={() => {
                setNumberRangeStart(group.start);
                handleSelectNumber(group.start);
              }}
              className={`flex-1 py-2.5 px-4 rounded-2xl font-extrabold text-sm md:text-base transition ${
                numberRangeStart === group.start
                  ? 'bg-sky-600 text-white shadow'
                  : 'bg-sky-50 text-sky-900 hover:bg-sky-100'
              }`}
            >
              🔢 {group.label}
            </button>
          ))}
        </div>

        {/* Botonera de los 20 números del bloque activo */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {rangeNumbers.map((numVal) => {
            const isSelected = numVal === selectedNumberVal;
            const isMastered = progress.masteredIds.includes(`num-${numVal}`);
            return (
              <button
                key={`num-btn-${numVal}`}
                type="button"
                onClick={() => handleSelectNumber(numVal)}
                className={`relative py-3 rounded-2xl font-extrabold text-2xl border-2 transition ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-700 scale-105 shadow-md'
                    : 'bg-white text-sky-900 border-sky-200 hover:bg-sky-50'
                }`}
              >
                {numVal}
                {isMastered && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute top-1 right-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tarjeta pedagógica de Decenas y Unidades */}
        <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-sky-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <span className="text-7xl font-extrabold text-sky-600">
              {selectedNumberVal}
            </span>
            <h3 className="text-3xl font-extrabold text-sky-950">
              {currentNumberWord}
            </h3>
            <p className="text-xs font-bold text-sky-700">
              {tensCount} decenas (de 10) y {unitsCount} unidades sueltas
            </p>
            <button
              type="button"
              onClick={() =>
                speakSpanish(
                  `Número ${selectedNumberVal}. Se escribe ${currentNumberWord}.`
                )
              }
              className="inline-flex items-center gap-2 bg-sky-600 text-white font-bold px-4 py-2 rounded-xl"
            >
              <Volume2 className="w-4 h-4" />
              Escuchar número
            </button>
          </div>

          <div className="flex-1 bg-sky-50 rounded-2xl p-4 border-2 border-sky-100 w-full">
            <p className="text-sm font-bold text-sky-900 mb-3">
              👆 Toca las cajas de 10 estrellas (🌟 +10) y las fresas (🍓 +1) para sumar hasta{' '}
              {selectedNumberVal}. Llevas: <strong>{accumulatedCount}</strong>
            </p>
            <div className="flex flex-wrap gap-2.5">
              {visualTokens.map((tok) => {
                const isCounted = tappedTokenIds.includes(tok.id);
                return (
                  <button
                    key={tok.id}
                    type="button"
                    onClick={() => handleTapVisualToken(tok)}
                    className={`px-3 py-2 rounded-2xl font-extrabold flex flex-col items-center justify-center transition ${
                      isCounted
                        ? 'bg-emerald-400 text-white scale-105 shadow'
                        : 'bg-white border-2 border-sky-200 hover:scale-105 text-sky-950'
                    }`}
                  >
                    <span className="text-2xl">{tok.emoji}</span>
                    <span className="text-xs">{tok.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pizarra para escribir el número y su nombre en letras */}
        <DrawingBoard
          guideText={`${selectedNumberVal} ${currentNumberWord}`}
          subtitle={`Escribe el número ${selectedNumberVal} (${currentNumberWord})`}
          onCompleteTrace={() => {
            speakSpanish(`¡Excelente! Escribiste el número ${currentNumberWord}.`);
            awardProgress(2, `num-${selectedNumberVal}`);
          }}
        />
      </div>
    );
  };

  // ==========================================
  // MÓDULO 5: SUMAS Y RESTAS VISUALES
  // ==========================================

  const renderMathModule = (): React.ReactElement => {
    const leftTokens = buildSimpleMathTokens(mathChallenge.numA, 'math-a', mathChallenge.emoji);
    const rightTokens = buildSimpleMathTokens(mathChallenge.numB, 'math-b', mathChallenge.emoji);
    const isAddition = mathChallenge.operator === '+';
    const operationExplanation = isAddition
      ? 'Suma: Junta los dos grupos y cuenta cuántos hay en total.'
      : `Resta: A ${mathChallenge.numA} quítale ${mathChallenge.numB} y cuenta cuántos quedan.`;

    return (
      <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-orange-200 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-2xl font-extrabold text-orange-950">
              🧮 Sumas y Restas Visuales
            </h3>
            <p className="text-sm font-semibold text-orange-700">
              {operationExplanation}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const opWord = isAddition ? 'más' : 'menos';
              speakSpanish(
                `¿Cuánto es ${mathChallenge.numA} ${opWord} ${mathChallenge.numB}?`
              );
            }}
            className="flex items-center gap-2 bg-orange-500 text-white font-bold px-4 py-2.5 rounded-2xl shadow"
          >
            <Volume2 className="w-5 h-5" />
            Escuchar operación
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-orange-50 p-6 rounded-3xl border-2 border-orange-200 text-center">
          <div className="space-y-2">
            <div className="text-6xl font-extrabold text-orange-900">
              {mathChallenge.numA}
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {leftTokens.map((item) => (
                <span key={item.id} className="text-3xl">
                  {item.emoji}
                </span>
              ))}
            </div>
          </div>

          <div className="text-6xl font-extrabold text-orange-600">
            {mathChallenge.operator}
          </div>

          <div className="space-y-2">
            <div className="text-6xl font-extrabold text-orange-900">
              {mathChallenge.numB}
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {rightTokens.map((item) => (
                <span key={item.id} className="text-3xl">
                  {item.emoji}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-center text-lg font-extrabold text-orange-950">
            Elige el resultado correcto:
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {mathChallenge.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleAnswerMath(opt.value)}
                className="py-5 rounded-3xl bg-amber-300 hover:bg-amber-400 text-amber-950 font-extrabold text-4xl shadow-md active:scale-95 transition"
              >
                {opt.value}
              </button>
            ))}
          </div>
        </div>

        {mathFeedback.length > 0 && (
          <p className="text-center font-bold text-lg text-emerald-800 bg-emerald-100 py-3 rounded-2xl">
            {mathFeedback}
          </p>
        )}
      </div>
    );
  };

  // ==========================================
  // MÓDULO 6: QUIZ DIARIO / SEMANAL
  // ==========================================

  const renderQuizModule = (): React.ReactElement => {
    if (quizFinished) {
      return (
        <div className="bg-white rounded-3xl p-8 shadow-lg border-4 border-amber-300 text-center space-y-5">
          <div className="text-7xl">🏆</div>
          <h3 className="text-3xl font-extrabold text-purple-950">
            ¡Felicidades, {progress.childFullName}!
          </h3>
          <p className="text-xl font-bold text-purple-700">
            Lograste {quizScore} de {activeQuizQuestions.length} respuestas correctas en tu
            Reto {quizMode === 'diario' ? 'Diario' : 'Semanal'}.
          </p>
          <button
            type="button"
            onClick={() => handleResetQuiz(quizMode)}
            className="inline-flex items-center gap-2 bg-purple-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:bg-purple-700 transition"
          >
            <RefreshCw className="w-5 h-5" />
            Jugar de nuevo
          </button>
        </div>
      );
    }

    const currentQ = activeQuizQuestions[quizIndex] ?? activeQuizQuestions[0];

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border-2 border-amber-200">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleResetQuiz('diario')}
              className={`px-4 py-2 rounded-2xl font-bold ${
                quizMode === 'diario'
                  ? 'bg-amber-400 text-amber-950 shadow'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              ☀️ Quiz Diario (5 preguntas)
            </button>
            <button
              type="button"
              onClick={() => handleResetQuiz('semanal')}
              className={`px-4 py-2 rounded-2xl font-bold ${
                quizMode === 'semanal'
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              🏅 Súper Reto Semanal (10 preguntas)
            </button>
          </div>
          <span className="font-extrabold text-purple-900">
            Pregunta {quizIndex + 1} de {activeQuizQuestions.length}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border-4 border-purple-200 text-center space-y-6">
          <div className="text-4xl md:text-6xl font-extrabold text-purple-900 bg-purple-50 py-6 rounded-3xl">
            {currentQ.visualDisplay}
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-purple-950">
              {currentQ.promptText}
            </h3>
            <button
              type="button"
              onClick={() => speakSpanish(currentQ.spokenText)}
              className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 font-bold px-4 py-2 rounded-xl"
            >
              <Volume2 className="w-5 h-5" />
              Escuchar pregunta
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {currentQ.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleAnswerQuizOption(opt.isCorrect)}
                className="p-5 rounded-3xl bg-amber-100 hover:bg-amber-300 text-amber-950 font-extrabold text-2xl border-2 border-amber-300 shadow-sm active:scale-95 transition"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderActiveSection = (): React.ReactElement => {
    switch (activeModule) {
      case 'letters': {
        return renderLettersAndNameModule();
      }
      case 'calendar': {
        return renderCalendarModule();
      }
      case 'reading': {
        return renderReadingModule();
      }
      case 'numbers': {
        return renderNumbersModule();
      }
      case 'math': {
        return renderMathModule();
      }
      case 'quiz': {
        return renderQuizModule();
      }
      default: {
        return renderLettersAndNameModule();
      }
    }
  };

  const completedMissionsCount = Object.values(progress.dailyMissions).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-purple-50 to-sky-50 text-slate-800 pb-12">
      {/* BARRA SUPERIOR INFANTIL */}
      <header className="bg-white/90 backdrop-blur border-b-4 border-amber-200 sticky top-0 z-20 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-purple-950 leading-none">
                PequeGenio
              </h1>
              <div className="mt-1">{renderNameEditorBar()}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-sky-100 text-sky-900 px-3 py-2 rounded-2xl font-bold text-xs md:text-sm">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>Hoy: {progress.minutesToday} / 45 min</span>
            </div>
            <div className="flex items-center gap-1.5 bg-orange-100 text-orange-900 px-3 py-2 rounded-2xl font-bold text-xs md:text-sm">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Misiones: {completedMissionsCount}/6</span>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-300 text-amber-950 px-3.5 py-2 rounded-2xl font-extrabold text-sm md:text-base shadow-sm">
              <Star className="w-5 h-5 fill-amber-600 text-amber-600" />
              <span>{progress.stars}</span>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 pt-5 space-y-6">
        {/* NAVEGACIÓN DE 6 MÓDULOS GRANDES PARA TABLETA */}
        <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <button
            type="button"
            onClick={() => setActiveModule('letters')}
            className={`p-3 rounded-3xl font-extrabold text-sm flex flex-col items-center gap-1 border-b-4 transition ${
              activeModule === 'letters'
                ? 'bg-purple-600 text-white border-purple-800 scale-105 shadow-md'
                : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-50'
            }`}
          >
            <PenTool className="w-6 h-6" />
            <span>1. A-Z y Nombre</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModule('calendar')}
            className={`p-3 rounded-3xl font-extrabold text-sm flex flex-col items-center gap-1 border-b-4 transition ${
              activeModule === 'calendar'
                ? 'bg-teal-600 text-white border-teal-800 scale-105 shadow-md'
                : 'bg-white text-teal-900 border-teal-200 hover:bg-teal-50'
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span>2. Días y Fechas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModule('reading')}
            className={`p-3 rounded-3xl font-extrabold text-sm flex flex-col items-center gap-1 border-b-4 transition ${
              activeModule === 'reading'
                ? 'bg-emerald-600 text-white border-emerald-800 scale-105 shadow-md'
                : 'bg-white text-emerald-900 border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <BookOpen className="w-6 h-6" />
            <span>3. 7 Cuentos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModule('numbers')}
            className={`p-3 rounded-3xl font-extrabold text-sm flex flex-col items-center gap-1 border-b-4 transition ${
              activeModule === 'numbers'
                ? 'bg-sky-600 text-white border-sky-800 scale-105 shadow-md'
                : 'bg-white text-sky-900 border-sky-200 hover:bg-sky-50'
            }`}
          >
            <span className="text-lg font-black leading-none">1-100</span>
            <span>4. Números 1-100</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModule('math')}
            className={`p-3 rounded-3xl font-extrabold text-sm flex flex-col items-center gap-1 border-b-4 transition ${
              activeModule === 'math'
                ? 'bg-orange-500 text-white border-orange-700 scale-105 shadow-md'
                : 'bg-white text-orange-900 border-orange-200 hover:bg-orange-50'
            }`}
          >
            <Calculator className="w-6 h-6" />
            <span>5. Sumas y Restas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModule('quiz')}
            className={`p-3 rounded-3xl font-extrabold text-sm flex flex-col items-center gap-1 border-b-4 transition ${
              activeModule === 'quiz'
                ? 'bg-amber-400 text-amber-950 border-amber-600 scale-105 shadow-md'
                : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-50'
            }`}
          >
            <Award className="w-6 h-6" />
            <span>6. Quiz Diario</span>
          </button>
        </nav>

        {/* CONTENIDO DEL MÓDULO ACTIVO */}
        <section>{renderActiveSection()}</section>
      </main>
    </div>
  );
}

export default App;