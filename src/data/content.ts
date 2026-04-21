export interface LearningArea {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  areaId: string;
  title: string;
  intro: string;
  xp: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  vizType: 'http' | 'neural' | 'bst';
  steps: LessonStep[];
}

export interface LessonStep {
  title: string;
  text: string;
}

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'special';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  tier: AchievementTier;
  condition: (state: { xp: number; streak: number; completedLessons: string[]; selectedAreas: string[] }) => boolean;
}

// ── Learning Areas ────────────────────────────────────────────────────────────

export const LEARNING_AREAS: LearningArea[] = [
  {
    id: 'web',
    name: 'Web Development',
    icon: '🌐',
    description: 'HTTP, DOM, CSS, APIs & more',
    color: '#E53E3E',
    lessons: [
      {
        id: 'http-basics',
        areaId: 'web',
        title: 'How HTTP Works',
        intro: 'Every time you visit a website, your browser and a server exchange messages. HTTP is the language they speak — a simple request-response protocol that powers the entire web.',
        xp: 30,
        difficulty: 'beginner',
        vizType: 'http',
        steps: [
          { title: 'The Request', text: 'Your browser sends an HTTP request to the server. It includes a method (GET, POST...), a URL, and headers that describe what you want and who you are.' },
          { title: 'Server Processing', text: 'The server receives your request, processes it — maybe reading from a database — and prepares a response. This can happen in milliseconds.' },
          { title: 'The Response', text: 'The server sends back an HTTP response with a status code (200 OK, 404 Not Found...) and the actual content — HTML, JSON, or images.' },
        ],
      },
      {
        id: 'dom-basics',
        areaId: 'web',
        title: 'The DOM Explained',
        intro: 'The Document Object Model is how browsers represent HTML as a tree of objects. JavaScript uses the DOM to read and change what you see on screen in real time.',
        xp: 30,
        difficulty: 'beginner',
        vizType: 'http',
        steps: [
          { title: 'HTML to Tree', text: 'When a browser loads HTML, it parses it into a tree structure. Every element becomes a "node" — body, headings, paragraphs all become objects in memory.' },
          { title: 'JavaScript Access', text: 'JavaScript can traverse this tree with methods like document.querySelector(). It can read attributes, text content, and styles dynamically.' },
          { title: 'Live Updates', text: 'When JS changes a DOM node — updating text, adding a class, removing an element — the browser instantly re-renders the affected part of the page.' },
        ],
      },
      {
        id: 'css-cascade',
        areaId: 'web',
        title: 'CSS Cascade & Specificity',
        intro: 'Why does one CSS rule override another? The cascade is an algorithm that decides which style wins when multiple rules apply to the same element.',
        xp: 40,
        difficulty: 'intermediate',
        vizType: 'http',
        steps: [
          { title: 'Origin & Importance', text: 'CSS rules come from user-agent, user, and author stylesheets. The !important declaration breaks the normal cascade and takes highest priority.' },
          { title: 'Specificity Score', text: 'Each selector gets a score: inline styles (1,0,0,0), IDs (0,1,0,0), classes (0,0,1,0), elements (0,0,0,1). The highest score wins.' },
          { title: 'Source Order', text: 'If two rules have equal specificity, the one that appears later in the stylesheet wins. This is the "cascade" — styles flow down and later rules override earlier ones.' },
        ],
      },
    ],
  },
  {
    id: 'ai',
    name: 'AI & Machine Learning',
    icon: '🧠',
    description: 'Neural Networks, Transformers, LLMs',
    color: '#E53E3E',
    lessons: [
      {
        id: 'neural-network',
        areaId: 'ai',
        title: 'How Neural Networks Learn',
        intro: 'Neural networks are inspired by the human brain — layers of connected nodes that process information and learn patterns from data through repeated exposure and correction.',
        xp: 40,
        difficulty: 'beginner',
        vizType: 'neural',
        steps: [
          { title: 'Input Layer', text: 'Data enters through the input layer. Each node represents one feature — for an image, each pixel might be a node. Values are numbers between 0 and 1.' },
          { title: 'Hidden Layers', text: 'Hidden layers transform the data through weighted connections. Each connection has a weight that amplifies or dampens the signal. The network learns by adjusting these weights.' },
          { title: 'Output & Learning', text: 'The output layer gives a prediction. If it\'s wrong, backpropagation adjusts all weights slightly to do better next time. Repeat millions of times and you get a trained model.' },
        ],
      },
      {
        id: 'transformers',
        areaId: 'ai',
        title: 'Transformers & Attention',
        intro: 'Transformers are the architecture behind GPT, BERT, and most modern AI. Their secret weapon: attention — the ability to relate any word to any other word in a sequence.',
        xp: 60,
        difficulty: 'intermediate',
        vizType: 'neural',
        steps: [
          { title: 'Tokens & Embeddings', text: 'Text is split into tokens (words or sub-words). Each token becomes a high-dimensional vector — a list of numbers capturing its meaning in context.' },
          { title: 'Self-Attention', text: 'For each token, the model computes how much "attention" to pay to every other token. "The bank near the river" — "bank" attends heavily to "river" for disambiguation.' },
          { title: 'Parallel Processing', text: 'Unlike RNNs that read sequentially, Transformers process all tokens in parallel. This makes them faster and better at capturing long-range dependencies.' },
        ],
      },
    ],
  },
  {
    id: 'cs',
    name: 'Computer Science',
    icon: '⚡',
    description: 'Algorithms, Data Structures, Big O',
    color: '#E53E3E',
    lessons: [
      {
        id: 'binary-search',
        areaId: 'cs',
        title: 'Binary Search',
        intro: 'Binary search finds a value in a sorted list by repeatedly cutting the search space in half. It turns an O(n) problem into O(log n) — finding one item in a billion needs only 30 comparisons.',
        xp: 35,
        difficulty: 'beginner',
        vizType: 'bst',
        steps: [
          { title: 'Start in the Middle', text: 'Instead of checking each element from left to right, binary search starts at the middle. Is the target smaller or larger than the middle element?' },
          { title: 'Eliminate Half', text: 'If the target is smaller, we discard the right half entirely. If larger, we discard the left. With one comparison we\'ve eliminated 50% of possibilities.' },
          { title: 'Repeat Until Found', text: 'We repeat on the remaining half. Each step halves the remaining candidates. A list of 1,000,000 items needs at most 20 comparisons — that\'s O(log n).' },
        ],
      },
      {
        id: 'big-o',
        areaId: 'cs',
        title: 'Big O Notation',
        intro: 'Big O notation describes how an algorithm\'s time or space grows as input size grows. It\'s how we compare algorithms without worrying about hardware or implementation details.',
        xp: 40,
        difficulty: 'beginner',
        vizType: 'bst',
        steps: [
          { title: 'O(1) — Constant', text: 'An algorithm is O(1) if it takes the same time regardless of input size. Looking up a dictionary entry by key is O(1) — it doesn\'t matter if there are 10 or 10 million entries.' },
          { title: 'O(n) — Linear', text: 'O(n) means time grows proportionally with input. Finding a name in an unsorted list requires checking each entry — twice the names means twice the time.' },
          { title: 'O(n²) vs O(log n)', text: 'Bubble sort is O(n²) — terrible for large inputs. Binary search is O(log n) — incredibly efficient. At n=1,000,000, that\'s 10¹² vs just 20 operations.' },
        ],
      },
    ],
  },
  {
    id: 'security',
    name: 'Cybersecurity',
    icon: '🔐',
    description: 'HTTPS, Encryption, Authentication',
    color: '#E53E3E',
    lessons: [
      {
        id: 'https',
        areaId: 'security',
        title: 'How HTTPS Works',
        intro: 'HTTPS encrypts everything between your browser and a server. Nobody intercepting the traffic can read it — not even your ISP. It uses a handshake to establish a shared secret.',
        xp: 45,
        difficulty: 'beginner',
        vizType: 'http',
        steps: [
          { title: 'The TLS Handshake', text: 'Before any data flows, client and server negotiate encryption. The server presents a certificate proving its identity, verified by a trusted Certificate Authority.' },
          { title: 'Key Exchange', text: 'Using asymmetric encryption (public/private key pairs), client and server agree on a shared secret key — without ever sending it over the network. This is Diffie-Hellman.' },
          { title: 'Encrypted Channel', text: 'All data is now encrypted with that shared key using fast symmetric encryption (AES). Anyone intercepting sees only random noise. The S in HTTPS means Secure.' },
        ],
      },
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud & DevOps',
    icon: '☁️',
    description: 'Containers, Docker, CI/CD Pipelines',
    color: '#E53E3E',
    lessons: [
      {
        id: 'docker',
        areaId: 'cloud',
        title: 'Containers & Docker',
        intro: 'Containers package an app with everything it needs to run — code, runtime, libraries. "It works on my machine" becomes irrelevant. Docker made containers mainstream.',
        xp: 40,
        difficulty: 'beginner',
        vizType: 'http',
        steps: [
          { title: 'The Problem', text: 'Software depends on specific versions of languages, libraries, and OS config. A server with different versions breaks your app. Containers solve this by bundling all dependencies.' },
          { title: 'Images & Layers', text: 'A Docker image is built from layers — each command in a Dockerfile adds a layer. Layers are cached and shared between images, making storage and builds efficient.' },
          { title: 'Container vs VM', text: 'VMs virtualize entire hardware including the OS — heavy and slow. Containers share the host OS kernel — lightweight, start in milliseconds, use far less memory.' },
        ],
      },
    ],
  },
  {
    id: 'appdev',
    name: 'App Development',
    icon: '📱',
    description: 'REST APIs, State Management, CI/CD',
    color: '#E53E3E',
    lessons: [
      {
        id: 'rest-api',
        areaId: 'appdev',
        title: 'REST APIs Explained',
        intro: 'REST is an architectural style for designing APIs. It uses standard HTTP methods and treats everything as a "resource" accessible via URLs. Nearly every app uses REST to communicate.',
        xp: 35,
        difficulty: 'beginner',
        vizType: 'http',
        steps: [
          { title: 'Resources & URLs', text: 'In REST, data is a "resource" with its own URL. /users is the collection of all users. /users/42 is user number 42. The URL describes what, the method describes the action.' },
          { title: 'HTTP Methods as Verbs', text: 'GET retrieves, POST creates, PUT/PATCH updates, DELETE removes. A REST blog API: GET /posts lists all, POST /posts creates one, DELETE /posts/5 removes it.' },
          { title: 'Stateless & Cacheable', text: 'REST APIs are stateless — each request contains all information needed, no server-side sessions. Responses can be cached, making REST APIs highly scalable.' },
        ],
      },
    ],
  },
];

// ── Achievements ──────────────────────────────────────────────────────────────
// Users start with "Radiant Starter" granted on signup.
// Others are earned by completing lessons.

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'radiant-starter',
    name: 'Radiant Starter',
    description: 'Welcome to Radiant. Your journey begins here.',
    tier: 'special',
    condition: () => true,
  },
  {
    id: 'first-lesson',
    name: 'First Step',
    description: 'Complete your very first lesson.',
    tier: 'bronze',
    condition: ({ completedLessons }) => completedLessons.length >= 1,
  },
  {
    id: 'five-lessons',
    name: 'Rising Scholar',
    description: 'Complete 5 lessons across any topic.',
    tier: 'bronze',
    condition: ({ completedLessons }) => completedLessons.length >= 5,
  },
  {
    id: 'ten-lessons',
    name: 'Dedicated',
    description: 'Complete 10 lessons. Real commitment.',
    tier: 'silver',
    condition: ({ completedLessons }) => completedLessons.length >= 10,
  },
  {
    id: 'all-lessons',
    name: 'Lesson Master',
    description: 'Complete every single lesson in Radiant.',
    tier: 'gold',
    condition: ({ completedLessons }) => completedLessons.length >= 13,
  },
  {
    id: 'streak-3',
    name: 'Streak Ignited',
    description: 'Keep a 3-day learning streak.',
    tier: 'bronze',
    condition: ({ streak }) => streak >= 3,
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak without breaking it.',
    tier: 'silver',
    condition: ({ streak }) => streak >= 7,
  },
  {
    id: 'streak-30',
    name: 'Unbreakable',
    description: 'A 30-day streak. Truly exceptional.',
    tier: 'platinum',
    condition: ({ streak }) => streak >= 30,
  },
  {
    id: 'xp-300',
    name: 'XP Collector',
    description: 'Accumulate 300 total XP.',
    tier: 'bronze',
    condition: ({ xp }) => xp >= 300,
  },
  {
    id: 'xp-1000',
    name: 'XP Elite',
    description: 'Reach 1000 XP. You are in rare company.',
    tier: 'gold',
    condition: ({ xp }) => xp >= 1000,
  },
  {
    id: 'explorer',
    name: 'Curious Mind',
    description: 'Study in 3 different topic areas.',
    tier: 'bronze',
    condition: ({ selectedAreas }) => selectedAreas.length >= 3,
  },
  {
    id: 'polymath',
    name: 'Polymath',
    description: 'Unlock all 6 learning areas. Mastery of everything.',
    tier: 'gold',
    condition: ({ selectedAreas }) => selectedAreas.length >= 6,
  },
];

// ── Level system ─────────────────────────────────────────────────────────────

export function getLevel(xp: number): { level: number; name: string; nextLevelXp: number; currentLevelXp: number } {
  const levels = [
    { xp: 0,    name: 'Curious'    },
    { xp: 50,   name: 'Learner'    },
    { xp: 150,  name: 'Thinker'    },
    { xp: 300,  name: 'Explorer'   },
    { xp: 500,  name: 'Specialist' },
    { xp: 800,  name: 'Expert'     },
    { xp: 1200, name: 'Master'     },
    { xp: 2000, name: 'Luminary'   },
  ];

  let level = 0;
  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].xp) level = i;
    else break;
  }

  const currentLevelXp = levels[level].xp;
  const nextLevelXp = levels[level + 1]?.xp ?? currentLevelXp + 1000;

  return { level: level + 1, name: levels[level].name, nextLevelXp, currentLevelXp };
}
