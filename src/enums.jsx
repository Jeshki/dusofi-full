/// src/enums.jsx

// Enum for geographical filtering (used in Filters.jsx)
// Keys are used internally, values are displayed in the UI and stored in App state
export const GeographicalOrderEnum = {
  // Individual countries
  GREECE: 'Greece',
  ROME: 'Rome',
  GERMANY: 'Germany',
  FRANCE: 'France',
  ITALY: 'Italy',
  BRITISH_ISLES: 'British',
  EUROPE: 'Europe',
  NORTH_AMERICA: 'America',
  NORTH_AFRICA: 'Africa',
  INDIA: 'India',
  EAST: 'East',
};

// Enum for ideological group filtering
export const IdeologicalGroups = {
  "Christian Philosophy": [
    'Christian Neoplatonism',
    'Scholasticism',
    'Reformation',
    'Reformation Theology',
    'Christian Humanism',
    'Christian Apologetics',
    'Christian Existentialism',
    'Medieval Christian Thought'
  ],
  "Materialists": [
    'Marxism',
    'Socialism',
    'Atomism'
  ],
  "Idealist": [
    'Idealism',
    'German Idealism'
  ],
  "Empiricism/Realism": [
    'Empiricism',
    'Political Realism'
  ],
  "Rationalism/Dualism": [
    'Rationalism',
  ],
  "Critical/Existentialism/Phenomenology": [
    'Existentialism',
    'Phenomenology',
    'Feminism'
  ],
  "Islamic Philosophy": [
    'Islamic Philosophy',
    'Avicennism',
    'Islamic Theological Philosophy',
    'Historical Sociology'
  ],
  "Hinduism": [
    'Vedic Philosophy',
    'Vedanta',
    'Advaita Vedanta',
    'Qualified Non-Dualism',
    'Dvaita Vedanta',
    'Yoga Philosophy',
    'Integral Yoga'
  ],
  "Buddhism": [
    'Mahayana Buddhism',
    'Madhyamaka Buddhism',
    'Bodhisattva Path',
    'Buddhist Logic',
    'Gelugpa Buddhism'
  ],
  "Spirituality": [
    'Daoism',
    'Eastern Philosophy',
    'Mystical Humanism'
  ],
  "Ethics/Politics": [
    'Socratic Method',
    'Cynicism',
    'Epicureanism',
    'Pythagoreanism',
    'Roman Republicanism',
    'Liberalism',
    'Enlightenment',
    'Political Liberalism',
    'Deontological Ethics',
    'Confucionism',
  ],

  "Stoics": [
    'Stoicism',
  ]
};

// Enum for chronological order filtering
export const ChronologicalOrderEnum = {
  ANCIENT: 'Ancient', // ~Before 500 BC
  CLASSICAL: 'Classical', // ~500 BC - 500 AD
  MEDIEVAL: 'Medieval', // ~500 AD - 1500 AD
  RENAISSANCE: 'Renaissance', // ~1400 - 1600 AD (overlaps)
  EARLY_MODERN: 'Early Modern', // ~1500 - 1800 AD
  MODERN: 'Modern', // ~1800 - 1950 AD
  CONTEMPORARY: 'Contemporary' // ~1950 AD - Present
};