// ── Learning Area types ───────────────────────────────────────────────────────

export interface LearningArea {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface LessonStep {
  title: string;
  text: string;
}

export interface Lesson {
  id: string;
  areaId: string;
  title: string;
  intro: string;
  xp: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type?: 'lesson' | 'quiz';
  vizType?: 'http' | 'neural' | 'bst';
  steps: LessonStep[];
  questions?: QuizQuestion[];
}

// ── Medal tier system ─────────────────────────────────────────────────────────

export type MedalTier =
  | 'iron' | 'bronze' | 'silver' | 'gold'
  | 'platinum' | 'diamond' | 'obsidian' | 'radiant';

export const MEDAL_TIERS: readonly MedalTier[] = [
  'iron', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'obsidian', 'radiant',
] as const;

// ── Achievement types ─────────────────────────────────────────────────────────

export interface StatsSnapshot {
  xp: number;
  streak: number;
  level: number;
  completedLessons: string[];
  selectedAreas: string[];
  achievementsRaw: string[]; // "id:tier" strings — for meta-achievements
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;            // drives the symbol inside the medal shape
  category: 'general' | 'area' | 'special';
  tiers: MedalTier[];      // ordered list of tiers this achievement can reach
  thresholds: number[];    // same length as tiers; tiers[i] unlocked when getValue >= thresholds[i]
  getValue: (s: StatsSnapshot) => number;
}

// Keep old type alias for backward compat with any leftover references
export type AchievementTier = MedalTier;

// ── Learning Areas ────────────────────────────────────────────────────────────

export const LEARNING_AREAS: LearningArea[] = [
  {
    id: 'web',
    name: 'Web Development',
    icon: 'globe',
    description: 'HTTP, DOM, CSS, APIs & more',
    color: '#E53E3E',
    lessons: [
      {
        id: 'http-basics',
        areaId: 'web',
        title: 'How HTTP Works',
        intro: 'Every time you visit a website, your browser and a server exchange messages. HTTP is the language they speak — a simple request-response protocol that powers the entire web.',
        xp: 12,
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
        xp: 12,
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
        xp: 12,
        difficulty: 'intermediate',
        vizType: 'http',
        steps: [
          { title: 'Origin & Importance', text: 'CSS rules come from user-agent, user, and author stylesheets. The !important declaration breaks the normal cascade and takes highest priority.' },
          { title: 'Specificity Score', text: 'Each selector gets a score: inline styles (1,0,0,0), IDs (0,1,0,0), classes (0,0,1,0), elements (0,0,0,1). The highest score wins.' },
          { title: 'Source Order', text: 'If two rules have equal specificity, the one that appears later in the stylesheet wins. This is the "cascade" — styles flow down and later rules override earlier ones.' },
        ],
      },
      {
        id: 'web-quiz',
        areaId: 'web',
        title: 'Web Fundamentals Quiz',
        intro: 'Test your knowledge of HTTP, the DOM, and CSS. Answer 3 questions to complete this chapter.',
        xp: 20,
        difficulty: 'intermediate',
        type: 'quiz',
        steps: [],
        questions: [
          {
            question: 'What does HTTP stand for?',
            options: [
              'HyperText Transfer Protocol',
              'High Transfer Text Protocol',
              'Hyperlink Transfer Protocol',
              'HyperText Transmission Protocol',
            ],
            correct: 0,
            explanation: 'HTTP = HyperText Transfer Protocol. It\'s the foundation of data communication on the web, used every time your browser loads a page.',
          },
          {
            question: 'Which HTTP status code means "Not Found"?',
            options: ['200', '301', '404', '500'],
            correct: 2,
            explanation: '404 means the server couldn\'t find the requested resource. 200 = OK, 301 = Redirect, 500 = Server Error.',
          },
          {
            question: 'In CSS specificity, which selector wins?',
            options: [
              'A class selector (.btn)',
              'An element selector (div)',
              'An ID selector (#header)',
              'They all have equal weight',
            ],
            correct: 2,
            explanation: 'ID selectors score (0,1,0,0), class selectors (0,0,1,0), elements (0,0,0,1). ID always wins unless !important is used.',
          },
        ],
      },
    ],
  },
  {
    id: 'ai',
    name: 'AI & Machine Learning',
    icon: 'nodes',
    description: 'Neural Networks, Transformers, LLMs',
    color: '#E53E3E',
    lessons: [
      {
        id: 'neural-network',
        areaId: 'ai',
        title: 'How Neural Networks Learn',
        intro: 'Neural networks are inspired by the human brain — layers of connected nodes that process information and learn patterns from data through repeated exposure and correction.',
        xp: 12,
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
        xp: 12,
        difficulty: 'intermediate',
        vizType: 'neural',
        steps: [
          { title: 'Tokens & Embeddings', text: 'Text is split into tokens (words or sub-words). Each token becomes a high-dimensional vector — a list of numbers capturing its meaning in context.' },
          { title: 'Self-Attention', text: 'For each token, the model computes how much "attention" to pay to every other token. "The bank near the river" — "bank" attends heavily to "river" for disambiguation.' },
          { title: 'Parallel Processing', text: 'Unlike RNNs that read sequentially, Transformers process all tokens in parallel. This makes them faster and better at capturing long-range dependencies.' },
        ],
      },
      {
        id: 'ai-quiz',
        areaId: 'ai',
        title: 'AI Foundations Quiz',
        intro: 'Test your understanding of neural networks and transformers. 3 questions to close out this chapter.',
        xp: 20,
        difficulty: 'intermediate',
        type: 'quiz',
        steps: [],
        questions: [
          {
            question: 'What role do "weights" play in a neural network?',
            options: [
              'They store the raw training data',
              'They control connection strength between neurons',
              'They define the number of layers',
              'They set the learning rate',
            ],
            correct: 1,
            explanation: 'Weights control how strongly neurons influence each other. Training adjusts these weights to improve the network\'s predictions.',
          },
          {
            question: 'What does "self-attention" do in a Transformer?',
            options: [
              'It speeds up GPU training',
              'It relates each token to every other token in the sequence',
              'It reduces the model\'s parameter count',
              'It controls the dropout rate',
            ],
            correct: 1,
            explanation: 'Self-attention lets the model weigh how relevant each word is to every other word — so "bank" can attend to "river" for disambiguation.',
          },
          {
            question: 'What is "backpropagation" in neural networks?',
            options: [
              'Feeding data forward through layers to get a prediction',
              'Adjusting weights by propagating error backward through the network',
              'Removing neurons that fire too frequently',
              'Splitting training data into mini-batches',
            ],
            correct: 1,
            explanation: 'Backpropagation calculates how much each weight contributed to the error, then nudges those weights to reduce future mistakes.',
          },
        ],
      },
    ],
  },
  {
    id: 'cs',
    name: 'Computer Science',
    icon: 'code',
    description: 'Algorithms, Data Structures, Big O',
    color: '#E53E3E',
    lessons: [
      {
        id: 'binary-search',
        areaId: 'cs',
        title: 'Binary Search',
        intro: 'Binary search finds a value in a sorted list by repeatedly cutting the search space in half. It turns an O(n) problem into O(log n) — finding one item in a billion needs only 30 comparisons.',
        xp: 12,
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
        xp: 12,
        difficulty: 'beginner',
        vizType: 'bst',
        steps: [
          { title: 'O(1) — Constant', text: 'An algorithm is O(1) if it takes the same time regardless of input size. Looking up a dictionary entry by key is O(1) — it doesn\'t matter if there are 10 or 10 million entries.' },
          { title: 'O(n) — Linear', text: 'O(n) means time grows proportionally with input. Finding a name in an unsorted list requires checking each entry — twice the names means twice the time.' },
          { title: 'O(n²) vs O(log n)', text: 'Bubble sort is O(n²) — terrible for large inputs. Binary search is O(log n) — incredibly efficient. At n=1,000,000, that\'s 10¹² vs just 20 operations.' },
        ],
      },
      {
        id: 'cs-quiz',
        areaId: 'cs',
        title: 'CS Algorithms Quiz',
        intro: 'Put your knowledge of binary search and Big O to the test. 3 questions to finish this chapter.',
        xp: 20,
        difficulty: 'intermediate',
        type: 'quiz',
        steps: [],
        questions: [
          {
            question: 'What is the time complexity of binary search?',
            options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
            correct: 2,
            explanation: 'Binary search is O(log n) — each comparison eliminates half the candidates. A list of 1 million items needs at most 20 comparisons.',
          },
          {
            question: 'What does O(1) mean?',
            options: [
              'Constant time — speed doesn\'t change with input size',
              'Linear time — grows proportionally with input',
              'Only one comparison is performed',
              'The optimal possible complexity',
            ],
            correct: 0,
            explanation: 'O(1) means the operation takes the same time regardless of input size — like looking up a hash map entry.',
          },
          {
            question: 'Bubble sort has which time complexity?',
            options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
            correct: 3,
            explanation: 'Bubble sort compares every pair of adjacent elements repeatedly — O(n²). It\'s very slow for large datasets. Quicksort or mergesort (O(n log n)) are much better.',
          },
        ],
      },
    ],
  },
  {
    id: 'security',
    name: 'Cybersecurity',
    icon: 'shield',
    description: 'HTTPS, Encryption, Authentication',
    color: '#E53E3E',
    lessons: [
      {
        id: 'https',
        areaId: 'security',
        title: 'How HTTPS Works',
        intro: 'HTTPS encrypts everything between your browser and a server. Nobody intercepting the traffic can read it — not even your ISP. It uses a handshake to establish a shared secret.',
        xp: 12,
        difficulty: 'beginner',
        vizType: 'http',
        steps: [
          { title: 'The TLS Handshake', text: 'Before any data flows, client and server negotiate encryption. The server presents a certificate proving its identity, verified by a trusted Certificate Authority.' },
          { title: 'Key Exchange', text: 'Using asymmetric encryption (public/private key pairs), client and server agree on a shared secret key — without ever sending it over the network. This is Diffie-Hellman.' },
          { title: 'Encrypted Channel', text: 'All data is now encrypted with that shared key using fast symmetric encryption (AES). Anyone intercepting sees only random noise. The S in HTTPS means Secure.' },
        ],
      },
      {
        id: 'security-quiz',
        areaId: 'security',
        title: 'Security Concepts Quiz',
        intro: 'Test your knowledge of HTTPS, TLS, and encryption. 3 questions to finish the chapter.',
        xp: 20,
        difficulty: 'intermediate',
        type: 'quiz',
        steps: [],
        questions: [
          {
            question: 'What does TLS do in an HTTPS connection?',
            options: [
              'Compresses data to speed up loading',
              'Encrypts all communication between browser and server',
              'Stores the SSL certificate locally',
              'Validates JavaScript on the page',
            ],
            correct: 1,
            explanation: 'TLS (Transport Layer Security) encrypts all traffic so interceptors only see random noise — not your passwords, cookies, or data.',
          },
          {
            question: 'What is a Certificate Authority (CA)?',
            options: [
              'A hacker group that tests websites',
              'A trusted organization that verifies server identity',
              'A type of symmetric encryption algorithm',
              'The web server itself',
            ],
            correct: 1,
            explanation: 'CAs (like Let\'s Encrypt, DigiCert) verify that a server\'s certificate is genuine, establishing trust in HTTPS connections.',
          },
          {
            question: 'What is Diffie-Hellman used for in TLS?',
            options: [
              'Storing passwords securely on the server',
              'Establishing a shared secret without sending it over the network',
              'Signing and verifying digital documents',
              'Compressing encrypted traffic',
            ],
            correct: 1,
            explanation: 'Diffie-Hellman lets two parties agree on a shared secret key over a public channel — the key is never transmitted, making interception useless.',
          },
        ],
      },
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud & DevOps',
    icon: 'cloud',
    description: 'Containers, Docker, CI/CD Pipelines',
    color: '#E53E3E',
    lessons: [
      {
        id: 'docker',
        areaId: 'cloud',
        title: 'Containers & Docker',
        intro: 'Containers package an app with everything it needs to run — code, runtime, libraries. "It works on my machine" becomes irrelevant. Docker made containers mainstream.',
        xp: 12,
        difficulty: 'beginner',
        vizType: 'http',
        steps: [
          { title: 'The Problem', text: 'Software depends on specific versions of languages, libraries, and OS config. A server with different versions breaks your app. Containers solve this by bundling all dependencies.' },
          { title: 'Images & Layers', text: 'A Docker image is built from layers — each command in a Dockerfile adds a layer. Layers are cached and shared between images, making storage and builds efficient.' },
          { title: 'Container vs VM', text: 'VMs virtualize entire hardware including the OS — heavy and slow. Containers share the host OS kernel — lightweight, start in milliseconds, use far less memory.' },
        ],
      },
      {
        id: 'cloud-quiz',
        areaId: 'cloud',
        title: 'Cloud & Containers Quiz',
        intro: 'Test your understanding of Docker and containers. 3 questions to close this chapter.',
        xp: 20,
        difficulty: 'intermediate',
        type: 'quiz',
        steps: [],
        questions: [
          {
            question: 'What is the key difference between a container and a VM?',
            options: [
              'Containers are always slower than VMs',
              'Containers share the host OS kernel; VMs emulate full hardware',
              'VMs use less memory than containers',
              'Containers can only run on Linux',
            ],
            correct: 1,
            explanation: 'Containers share the host OS kernel — lightweight and fast. VMs emulate full hardware with their own OS — heavier but more isolated.',
          },
          {
            question: 'What is a Docker image?',
            options: [
              'A running instance of an application',
              'A snapshot of a container\'s live state',
              'A layered, read-only blueprint for creating containers',
              'A cloud hosting service from Docker Inc.',
            ],
            correct: 2,
            explanation: 'A Docker image is a layered, read-only blueprint. When you run an image, Docker creates a writable container on top of those layers.',
          },
          {
            question: 'Why are Docker image layers cached?',
            options: [
              'To improve container security',
              'To reduce rebuild time and storage by reusing unchanged layers',
              'To encrypt the container\'s filesystem',
              'To limit the memory a container can use',
            ],
            correct: 1,
            explanation: 'Unchanged layers are cached and reused across builds — if your dependencies don\'t change, Docker skips reinstalling them, saving time and storage.',
          },
        ],
      },
    ],
  },
  {
    id: 'appdev',
    name: 'App Development',
    icon: 'phone',
    description: 'REST APIs, State Management, CI/CD',
    color: '#E53E3E',
    lessons: [
      {
        id: 'rest-api',
        areaId: 'appdev',
        title: 'REST APIs Explained',
        intro: 'REST is an architectural style for designing APIs. It uses standard HTTP methods and treats everything as a "resource" accessible via URLs. Nearly every app uses REST to communicate.',
        xp: 12,
        difficulty: 'beginner',
        vizType: 'http',
        steps: [
          { title: 'Resources & URLs', text: 'In REST, data is a "resource" with its own URL. /users is the collection of all users. /users/42 is user number 42. The URL describes what, the method describes the action.' },
          { title: 'HTTP Methods as Verbs', text: 'GET retrieves, POST creates, PUT/PATCH updates, DELETE removes. A REST blog API: GET /posts lists all, POST /posts creates one, DELETE /posts/5 removes it.' },
          { title: 'Stateless & Cacheable', text: 'REST APIs are stateless — each request contains all information needed, no server-side sessions. Responses can be cached, making REST APIs highly scalable.' },
        ],
      },
      {
        id: 'appdev-quiz',
        areaId: 'appdev',
        title: 'REST API Quiz',
        intro: 'Test your knowledge of REST APIs and HTTP methods. 3 questions to complete the chapter.',
        xp: 20,
        difficulty: 'intermediate',
        type: 'quiz',
        steps: [],
        questions: [
          {
            question: 'In REST, which HTTP method retrieves data?',
            options: ['POST', 'DELETE', 'GET', 'PUT'],
            correct: 2,
            explanation: 'GET retrieves resources without modifying them. POST creates, PUT/PATCH updates, and DELETE removes resources.',
          },
          {
            question: 'What does "stateless" mean in REST APIs?',
            options: [
              'The API never modifies any data',
              'Each request must contain all needed information — no server-side sessions',
              'The API only handles GET requests',
              'All responses return identical data',
            ],
            correct: 1,
            explanation: 'Stateless means each request is self-contained. The server stores no session state between calls — making REST APIs scalable and cacheable.',
          },
          {
            question: 'Which URL pattern follows REST conventions?',
            options: [
              '/getUser?id=5',
              '/users/5',
              '/fetch-user/5',
              '/api?action=getUser&id=5',
            ],
            correct: 1,
            explanation: 'REST uses nouns as URLs: /users/5 = "user with ID 5". The HTTP method (GET, DELETE, etc.) describes the action, not the URL.',
          },
        ],
      },
    ],
  },
];

// ── Internal helpers ──────────────────────────────────────────────────────────

function countLessonsInArea(areaId: string, completedLessons: string[]): number {
  const area = LEARNING_AREAS.find(a => a.id === areaId);
  if (!area) return 0;
  return area.lessons.filter(l => completedLessons.includes(l.id)).length;
}

function maxLessonsInAnyArea(completedLessons: string[]): number {
  let max = 0;
  for (const area of LEARNING_AREAS) {
    const n = area.lessons.filter(l => completedLessons.includes(l.id)).length;
    if (n > max) max = n;
  }
  return max;
}

// ── Achievement definitions ───────────────────────────────────────────────────

export const ACHIEVEMENTS: Achievement[] = [
  // ── Special ──────────────────────────────────────────────────────────────
  {
    id: 'radiant-one',
    name: 'Radiant One',
    description: 'Welcome to Radiant. Your journey begins here.',
    icon: 'radiant',
    category: 'special',
    tiers:      ['iron'],
    thresholds: [1],
    getValue: () => 1,
  },

  // ── Lesson milestones ─────────────────────────────────────────────────────
  {
    id: 'lesson-veteran',
    name: 'Lesson Veteran',
    description: 'Complete lessons across any topic to build mastery.',
    icon: 'star',
    category: 'general',
    tiers:      ['iron','bronze','silver','gold','platinum','diamond','obsidian','radiant'],
    thresholds: [1, 5, 25, 100, 250, 500, 1000, 2500],
    getValue: ({ completedLessons }) => completedLessons.length,
  },

  // ── XP milestones ─────────────────────────────────────────────────────────
  {
    id: 'xp-legend',
    name: 'XP Legend',
    description: 'Accumulate experience points through consistent learning.',
    icon: 'bolt',
    category: 'general',
    tiers:      ['iron','bronze','silver','gold','platinum','diamond','obsidian','radiant'],
    thresholds: [100, 500, 2000, 10000, 25000, 75000, 200000, 500000],
    getValue: ({ xp }) => xp,
  },

  // ── Streak milestones ─────────────────────────────────────────────────────
  {
    id: 'eternal-flame',
    name: 'Eternal Flame',
    description: 'Keep your daily learning streak burning without interruption.',
    icon: 'flame',
    category: 'general',
    tiers:      ['iron','bronze','silver','gold','platinum','diamond','obsidian','radiant'],
    thresholds: [3, 7, 30, 100, 200, 365, 500, 1000],
    getValue: ({ streak }) => streak,
  },

  // ── Level milestones ──────────────────────────────────────────────────────
  {
    id: 'rising-star',
    name: 'Rising Star',
    description: 'Level up through consistent and dedicated learning.',
    icon: 'crown',
    category: 'general',
    tiers:      ['iron','bronze','silver','gold','platinum','diamond','obsidian'],
    thresholds: [2, 3, 4, 5, 6, 7, 8],
    getValue: ({ level }) => level,
  },

  // ── Area milestones ───────────────────────────────────────────────────────
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Unlock topic areas to expand the breadth of your knowledge.',
    icon: 'compass',
    category: 'general',
    tiers:      ['iron','bronze','silver','gold','platinum','diamond'],
    thresholds: [1, 2, 3, 4, 5, 6],
    getValue: ({ selectedAreas }) => selectedAreas.length,
  },
  {
    id: 'area-conqueror',
    name: 'Area Conqueror',
    description: 'Complete lessons across multiple distinct topic areas.',
    icon: 'target',
    category: 'general',
    tiers:      ['iron','bronze','silver','gold','platinum','diamond'],
    thresholds: [1, 2, 3, 4, 5, 6],
    getValue: ({ completedLessons }) => {
      const areas = new Set<string>();
      for (const id of completedLessons) {
        for (const area of LEARNING_AREAS) {
          if (area.lessons.some(l => l.id === id)) { areas.add(area.id); break; }
        }
      }
      return areas.size;
    },
  },
  {
    id: 'polymath',
    name: 'Polymath',
    description: 'Fully clear all lessons in multiple topic areas.',
    icon: 'gem',
    category: 'general',
    tiers:      ['iron','bronze','silver','gold','platinum','diamond'],
    thresholds: [1, 2, 3, 4, 5, 6],
    getValue: ({ completedLessons }) => {
      const done = new Set(completedLessons);
      return LEARNING_AREAS.filter(a => a.lessons.every(l => done.has(l.id))).length;
    },
  },

  // ── Depth milestones ──────────────────────────────────────────────────────
  {
    id: 'deep-diver',
    name: 'Deep Diver',
    description: 'Go deep in a single topic area with relentless focus.',
    icon: 'book',
    category: 'general',
    tiers:      ['iron','bronze','silver','gold','platinum','diamond','obsidian','radiant'],
    thresholds: [1, 3, 5, 10, 25, 50, 100, 250],
    getValue: ({ completedLessons }) => maxLessonsInAnyArea(completedLessons),
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Work toward completing every lesson available in Radiant.',
    icon: 'check',
    category: 'general',
    tiers:      ['iron','bronze','silver','gold','platinum','diamond'],
    thresholds: [10, 25, 50, 75, 90, 100],
    getValue: ({ completedLessons }) => {
      const total = LEARNING_AREAS.flatMap(a => a.lessons).length;
      return total === 0 ? 0 : Math.floor((completedLessons.length / total) * 100);
    },
  },

  // ── Breadth: area × difficulty combos ────────────────────────────────────
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Study across diverse topics and all difficulty levels.',
    icon: 'trophy',
    category: 'general',
    tiers:      ['iron','bronze','silver','gold','platinum','diamond','obsidian'],
    thresholds: [1, 3, 6, 9, 12, 15, 18],
    getValue: ({ completedLessons }) => {
      const combos = new Set<string>();
      for (const lessonId of completedLessons) {
        for (const area of LEARNING_AREAS) {
          const lesson = area.lessons.find(l => l.id === lessonId);
          if (lesson) { combos.add(`${area.id}:${lesson.difficulty}`); break; }
        }
      }
      return combos.size;
    },
  },

  // ── Meta achievements ─────────────────────────────────────────────────────
  {
    id: 'achievement-hunter',
    name: 'Achievement Hunter',
    description: 'Unlock achievements across all disciplines of knowledge.',
    icon: 'chart',
    category: 'general',
    tiers:      ['iron','bronze','silver','gold','platinum','diamond','obsidian','radiant'],
    thresholds: [2, 4, 7, 10, 13, 16, 19, 20],
    getValue: ({ achievementsRaw }) =>
      new Set(achievementsRaw.map(a => a.split(':')[0])).size,
  },
  {
    id: 'overachiever',
    name: 'Overachiever',
    description: 'Reach gold tier or higher across many achievements.',
    icon: 'diamond',
    category: 'general',
    tiers:      ['iron','bronze','silver','gold','platinum','diamond','obsidian','radiant'],
    thresholds: [1, 2, 4, 6, 9, 12, 16, 20],
    getValue: ({ achievementsRaw }) => {
      const highTiers = new Set(['gold','platinum','diamond','obsidian','radiant']);
      return achievementsRaw.filter(a => highTiers.has(a.split(':')[1])).length;
    },
  },
  {
    id: 'grand-master',
    name: 'Grand Master',
    description: 'Accumulate tier points across every achievement category.',
    icon: 'shield',
    category: 'general',
    tiers:      ['iron','bronze','silver','gold','platinum','diamond','obsidian','radiant'],
    thresholds: [5, 15, 30, 55, 80, 110, 140, 160],
    getValue: ({ achievementsRaw }) =>
      achievementsRaw.reduce((sum, a) => {
        const tier = a.split(':')[1] as MedalTier;
        const idx = MEDAL_TIERS.indexOf(tier);
        return sum + (idx >= 0 ? idx + 1 : 0);
      }, 0),
  },

  // ── Area-specific ─────────────────────────────────────────────────────────
  {
    id: 'web-wizard',
    name: 'Web Wizard',
    description: 'Master Web Development — HTTP, DOM, CSS, and APIs.',
    icon: 'web',
    category: 'area',
    tiers:      ['iron','bronze','silver','gold','platinum','diamond','obsidian','radiant'],
    thresholds: [1, 2, 3, 5, 10, 25, 50, 100],
    getValue: ({ completedLessons }) => countLessonsInArea('web', completedLessons),
  },
  {
    id: 'ai-pioneer',
    name: 'AI Pioneer',
    description: 'Explore Artificial Intelligence — neural networks, transformers, LLMs.',
    icon: 'ai',
    category: 'area',
    tiers:      ['iron','bronze','silver','gold','platinum','diamond','obsidian','radiant'],
    thresholds: [1, 2, 3, 5, 10, 25, 50, 100],
    getValue: ({ completedLessons }) => countLessonsInArea('ai', completedLessons),
  },
  {
    id: 'algorithm-master',
    name: 'Algorithm Master',
    description: 'Conquer Computer Science — algorithms, data structures, Big O.',
    icon: 'code',
    category: 'area',
    tiers:      ['iron','bronze','silver','gold','platinum','diamond','obsidian','radiant'],
    thresholds: [1, 2, 3, 5, 10, 25, 50, 100],
    getValue: ({ completedLessons }) => countLessonsInArea('cs', completedLessons),
  },
  {
    id: 'security-guardian',
    name: 'Security Guardian',
    description: 'Defend the digital world — HTTPS, encryption, authentication.',
    icon: 'lock',
    category: 'area',
    tiers:      ['iron','bronze','silver','gold','platinum','diamond','obsidian','radiant'],
    thresholds: [1, 2, 3, 5, 10, 25, 50, 100],
    getValue: ({ completedLessons }) => countLessonsInArea('security', completedLessons),
  },
  {
    id: 'cloud-architect',
    name: 'Cloud Architect',
    description: 'Build and scale in the cloud — containers, Docker, CI/CD.',
    icon: 'cloud',
    category: 'area',
    tiers:      ['iron','bronze','silver','gold','platinum','diamond','obsidian','radiant'],
    thresholds: [1, 2, 3, 5, 10, 25, 50, 100],
    getValue: ({ completedLessons }) => countLessonsInArea('cloud', completedLessons),
  },
  {
    id: 'app-craftsman',
    name: 'App Craftsman',
    description: 'Build powerful applications — REST APIs, state management.',
    icon: 'phone',
    category: 'area',
    tiers:      ['iron','bronze','silver','gold','platinum','diamond','obsidian','radiant'],
    thresholds: [1, 2, 3, 5, 10, 25, 50, 100],
    getValue: ({ completedLessons }) => countLessonsInArea('appdev', completedLessons),
  },
];

// ── Helper functions ──────────────────────────────────────────────────────────

/** Parse "achievementId:tier" string. Returns null if malformed. */
export function parseAchievementString(s: string): { id: string; tier: MedalTier } | null {
  const colon = s.indexOf(':');
  if (colon === -1) return null;
  const id = s.slice(0, colon);
  const tier = s.slice(colon + 1) as MedalTier;
  if (!MEDAL_TIERS.includes(tier)) return null;
  return { id, tier };
}

/** Return the current (highest) tier for an achievement ID, or null if not yet earned. */
export function getCurrentTier(id: string, achievements: string[]): MedalTier | null {
  const entry = achievements.find(a => a.startsWith(`${id}:`));
  if (!entry) return null;
  return entry.split(':')[1] as MedalTier;
}

/** Compute the highest tier an achievement has reached based on a stats snapshot. */
export function computeEarnedTier(a: Achievement, s: StatsSnapshot): MedalTier | null {
  const val = a.getValue(s);
  let earned: MedalTier | null = null;
  for (let i = 0; i < a.tiers.length; i++) {
    if (val >= a.thresholds[i]) earned = a.tiers[i];
    else break;
  }
  return earned;
}

/** Build a StatsSnapshot from raw store state fields. */
export function buildStatsSnapshot(state: {
  xp: number;
  streak: number;
  completedLessons: string[];
  selectedAreas: string[];
  achievements: string[];
}): StatsSnapshot {
  return {
    xp: state.xp,
    streak: state.streak,
    level: getLevel(state.xp).level,
    completedLessons: state.completedLessons,
    selectedAreas: state.selectedAreas,
    achievementsRaw: state.achievements,
  };
}

/** Migrate old-format achievement strings to "id:tier" format. Safe to call repeatedly. */
const LEGACY_MAP: Record<string, string> = {
  'radiant-starter':     'radiant-one:iron',
  'radiant-one':         'radiant-one:iron', // handle bare ID
  'first-lesson':        'lesson-veteran:iron',
  'five-lessons':        'lesson-veteran:bronze',
  'ten-lessons':         'lesson-veteran:silver',
  'twenty-five-lessons': 'lesson-veteran:silver',
  'all-lessons':         'lesson-veteran:gold',
  'fifty-lessons':       'lesson-veteran:gold',
  'century-scholar':     'lesson-veteran:platinum',
  'streak-3':            'eternal-flame:iron',
  'streak-7':            'eternal-flame:bronze',
  'streak-30':           'eternal-flame:silver',
  'streak-100':          'eternal-flame:gold',
  'streak-365':          'eternal-flame:platinum',
  'xp-300':              'xp-legend:iron',
  'xp-500':              'xp-legend:iron',
  'xp-1000':             'xp-legend:bronze',
  'xp-2000':             'xp-legend:bronze',
  'xp-10000':            'xp-legend:silver',
  'explorer':            'explorer:iron',
  'polymath':            'polymath:iron',
};

export function migrateAchievements(raw: string[]): string[] {
  const best = new Map<string, number>(); // id → best MEDAL_TIERS index
  for (const s of raw) {
    let mapped = s;
    // If no colon, try legacy map
    if (!s.includes(':')) {
      mapped = LEGACY_MAP[s] ?? '';
    }
    if (!mapped.includes(':')) continue;
    const parsed = parseAchievementString(mapped);
    if (!parsed) continue;
    const idx = MEDAL_TIERS.indexOf(parsed.tier);
    if (idx === -1) continue;
    if (!best.has(parsed.id) || best.get(parsed.id)! < idx) best.set(parsed.id, idx);
  }
  return Array.from(best.entries()).map(([id, idx]) => `${id}:${MEDAL_TIERS[idx]}`);
}

// ── Level system ──────────────────────────────────────────────────────────────

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