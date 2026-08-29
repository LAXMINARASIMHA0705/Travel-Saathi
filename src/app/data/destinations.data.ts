export interface ItineraryItem {
  day: number;
  title: string;
  desc: string;
  done: boolean;
}

export interface Phrase {
  original: string;
  pronounce: string;
  meaning: string;
  langCode: string;
  fallbackDevanagari?: string;
  audioFile?: string;
}

export interface PathStep {
  spot: string;
  timeOfDay: string;
  tip: string;
}

export interface PathOptimizer {
  optimizedSequence: PathStep[];
  recommendedLocalMode: string;
  modeExplanation: string;
  estimatedDuration: string;
  estimatedCost: string;
}

export interface WeatherInfo {
  temp: string;
  condition: string;
  bestSeason: string;
  lat?: number;
  lng?: number;
  windSpeed?: string;
  humidity?: string;
  climateType?: string;
  clothingTip?: string;
  liveFetched?: boolean;
}

export interface LocalAttraction {
  name: string;
  desc: string;
  type: string;
}

export interface LocalDish {
  name: string;
  desc: string;
  veg: boolean;
  famousAt?: string;
  imageEmoji?: string;
}

export interface Destination {
  id: string;
  title: string;
  location: string;
  image: string;
  gallery?: string[];
  rating: number;
  category: string;
  region?: 'North' | 'South' | 'East' | 'West' | 'North-East' | 'Islands';
  tags: string[];
  description: string;
  spots: string[];
  localAttractions?: LocalAttraction[];
  mustTryDishes?: LocalDish[];
  itinerary: ItineraryItem[];
  phrases: Phrase[];
  pathOptimizer: PathOptimizer;
  weather: WeatherInfo;
  mapCoords: { x: number; y: number };
}

export interface TransportOption {
  mode: 'train' | 'flight' | 'bus' | 'cab' | 'car';
  name: string;
  duration: string;
  cost: number;
  best: boolean;
  tip: string;
}

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: '1',
    title: 'Tirupati Balaji Temple',
    location: 'Tirumala, Andhra Pradesh, India',
    image: 'tirupati.png',
    rating: 5.0,
    category: 'temples',
    tags: ['Holy Shrine', 'Venkateswara', 'Pilgrimage'],
    description: "The world's most visited Hindu pilgrimage center atop seven sacred Tirumala hills, abode of Lord Sri Venkateswara (Balaji). Famous for its magnificent temples, holy waterfalls, and legendary Laddu prasadam.",
    spots: ['Sri Venkateswara Sanctum', 'Kapila Theertham Waterfalls', 'Srivari Mettu Trek Trail'],
    localAttractions: [
      { name: 'Sri Venkateswara Sanctum', desc: 'Sacred main shrine atop Tirumala Seven Hills dedicated to Lord Balaji.', type: 'Temple' },
      { name: 'Kapila Theertham Waterfalls', desc: 'Ancient Shiva cave temple and holy waterfall located right at the foot of Tirumala hills.', type: 'Waterfalls' },
      { name: 'Srivari Mettu Trek Trail', desc: 'Historic 3,550 stone step foot trail preferred by devotees climbing Tirumala hill.', type: 'Trek' },
      { name: 'Chandragiri Fort & Palace', desc: '11th-century Vijayanagara empire fort boasting sound-and-light evening shows.', type: 'Heritage' },
      { name: 'Silathoranam Natural Arch', desc: 'Rare pre-Cambrian natural rock arch formation millions of years old.', type: 'Nature' },
      { name: 'Tiruchanur Padmavathi Temple', desc: 'Sacred temple of Goddess Padmavathi, divine consort of Lord Venkateswara.', type: 'Temple' }
    ],
    mustTryDishes: [
      { name: 'Tirupati TTD Laddu Prasadam', desc: 'GI-tagged sacred pure ghee laddu made with roasted cashews, raisins, cardamom & saffron.', veg: true, famousAt: 'TTD Prasadam Counters', imageEmoji: '🧆' },
      { name: 'Tirupati Pulihora', desc: 'Tangy tamarind rice tempered with mustard seeds, curry leaves, roasted peanuts & chana dal.', veg: true, famousAt: 'Tirumala Annaprasadam', imageEmoji: '🍚' },
      { name: 'Andhra Avakaya Thali', desc: 'Traditional spicy Andhra thali served with hot rice, ghee, and fiery spicy raw mango pickle.', veg: true, famousAt: 'Local Messes', imageEmoji: '🍱' },
      { name: 'Tirumala Brass-Cup Filter Coffee', desc: 'Frothy aromatic South Indian filter coffee brewed with chicory and thick fresh milk.', veg: true, famousAt: 'Hill Top Stalls', imageEmoji: '☕' },
      { name: 'Sri Vari Vada Prasadam', desc: 'Crispy savory black gram donut fried in pure ghee offered as divine naivedyam.', veg: true, famousAt: 'Vada Counters', imageEmoji: '🍩' }
    ],
    itinerary: [
      { day: 1, title: 'Srivari Footsteps Trek', desc: 'Ascend the 3,550 stone steps up the sacred hill for special trekker darshan.', done: true },
      { day: 2, title: 'Tirumala Balaji Darshan', desc: 'Experience the divine darshan of Lord Venkateswara and receive famous GI-tagged Laddu Prasadam.', done: false },
      { day: 3, title: 'Sri Padmavathi Temple Visit', desc: 'Visit Goddess Padmavathi temple at Tiruchanur near hill base.', done: false }
    ],
    phrases: [
      { original: 'ఓం నమో వేంకటేశాయ', pronounce: 'Om Namo Venkatesaya', meaning: 'Salutations to Lord Venkateswara (Telugu)', langCode: 'te-IN', fallbackDevanagari: 'ॐ नमो वेङ्कटेशाय' },
      { original: 'స్వామివారి దర్శనం ఎప్పుడు?', pronounce: 'Swamivari darshanam eppudu?', meaning: 'When is Swami Darshan?', langCode: 'te-IN', fallbackDevanagari: 'स्वामीवारी दर्शनम एप्पुदु?' },
      { original: 'లడ్డూ ప్రసాదం కౌంటర్ ఎక్కడ ఉంది?', pronounce: 'Laddu Prasadam counter ekkada undi?', meaning: 'Where is the Laddu Prasadam counter?', langCode: 'te-IN', fallbackDevanagari: 'लड्डू प्रसादअम काउंटर एक्कड उन्दी?' }
    ],
    pathOptimizer: {
      optimizedSequence: [
        { spot: 'Srivari Mettu Trail', timeOfDay: '04:00 AM (Dawn Trek)', tip: 'Start climbing early to beat the afternoon sun heat on stone steps.' },
        { spot: 'Sri Venkateswara Sanctum', timeOfDay: '10:30 AM (Darshan Queue)', tip: 'Book TTD online Special Entry Darshan ₹300 tickets 3 months in advance.' },
        { spot: 'Kapila Theertham', timeOfDay: '04:00 PM (Hill Foot)', tip: 'Visit Shiva waterfall temple right at the foot of Tirumala hills.' }
      ],
      recommendedLocalMode: 'TTD Electric Bus Service',
      modeExplanation: 'Free eco-friendly TTD electric shuttle buses operate continuously across all Tirumala hill sectors.',
      estimatedDuration: 'Full Day (approx 12 hours)',
      estimatedCost: '₹500 - ₹1,000'
    },
    weather: { temp: '28°C', condition: 'Pleasant & Sunny', bestSeason: 'Sep – Mar' },
    mapCoords: { x: 48, y: 70 },
    gallery: ['tirupati.png', 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: '2',
    title: 'Golden Temple (Harmandir Sahib)',
    location: 'Amritsar, Punjab, India',
    image: 'goldentemple.png',
    rating: 5.0,
    category: 'temples',
    tags: ['Sikh Heritage', 'Holy Sarovar', 'Langar'],
    description: 'The holiest shrine of Sikhism with a pure gold-leaf sanctuary floating gracefully in the center of the sacred Amrit Sarovar pool. Renowned for spiritual harmony and mouth-watering Punjabi delicacies.',
    spots: ['Harmandir Sahib Sanctum', 'Amrit Sarovar Holy Pool', 'Guru ka Langar Hall'],
    localAttractions: [
      { name: 'Harmandir Sahib Sanctum', desc: 'Gilded gold sanctuary in the center of the holy Amrit Sarovar pool.', type: 'Temple' },
      { name: 'Jallianwala Bagh Memorial', desc: 'Historic martyr memorial park preserving bullet marks from 1919 massacre.', type: 'Heritage' },
      { name: 'Wagah Border Parade', desc: 'High-energy India-Pakistan border flag-lowering ceremony held every evening.', type: 'Culture' },
      { name: 'Partition Museum', desc: 'Heart-touching museum inside Town Hall building documenting the 1947 partition.', type: 'Museum' },
      { name: 'Gobindgarh Fort', desc: '18th-century military fort built by Maharaja Ranjit Singh featuring 7D sound shows.', type: 'Heritage' }
    ],
    mustTryDishes: [
      { name: 'Amritsari Stuffed Kulcha & Chole', desc: 'Crispy multi-layered tandoori flatbread stuffed with spiced potatoes & paneer, served with spicy chickpeas & dollops of white butter.', veg: true, famousAt: 'Brother\'s Dhaba / Kulcha Land', imageEmoji: '🫓' },
      { name: 'Guru Ka Langar Dal & Kheer', desc: 'World-famous free community kitchen meal featuring slow-cooked black dal, fresh rotis & sweet rice kheer.', veg: true, famousAt: 'Golden Temple Langar Hall', imageEmoji: '🍲' },
      { name: 'Ahuja\'s Malai Lassi', desc: 'Thick, velvety Punjabi sweet yogurt drink served in tall glasses topped with a thick slab of fresh malai.', veg: true, famousAt: 'Ahuja Milk Bhandar', imageEmoji: '🥛' },
      { name: 'Makki di Roti & Sarson da Saag', desc: 'Classic winter dish of pureed mustard greens simmered with garlic & ghee, served with yellow cornmeal flatbread.', veg: true, famousAt: 'Kesar Da Dhaba', imageEmoji: '🌽' },
      { name: 'Amritsari Fish Fry', desc: 'Crispy carom-seed (ajwain) spiced chickpea batter fried river fish served with green mint chutney.', veg: false, famousAt: 'Makhan Fish Corner', imageEmoji: '🐟' }
    ],
    itinerary: [
      { day: 1, title: 'Golden Temple Night View', desc: 'Witness the breathtaking gilded reflection on the moonlit water during Palki Sahib ceremony.', done: true },
      { day: 2, title: 'Mega Langar Seva', desc: "Participate in cooking or serving meals in the world's largest free community kitchen.", done: false },
      { day: 3, title: 'Wagah Border Ceremony', desc: 'Drive 28km to witness the energetic India-Pakistan border lowering of flags ceremony.', done: false }
    ],
    phrases: [
      { original: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ', pronounce: 'Sat Sri Akal', meaning: 'God is Eternal / Hello (Punjabi)', langCode: 'pa-IN' },
      { original: 'ਧੰਨਵਾਦ', pronounce: 'Dhanwaad', meaning: 'Thank you very much', langCode: 'pa-IN' }
    ],
    pathOptimizer: {
      optimizedSequence: [
        { spot: 'Harmandir Sahib Sanctum', timeOfDay: '04:00 AM (Amrit Vela)', tip: 'Experience the serene morning Gurbani hymns during early dawn hours.' },
        { spot: 'Guru ka Langar', timeOfDay: '12:30 PM (Langar Meal)', tip: 'Everyone regardless of faith sits side by side on carpets to partake in wholesome meals.' },
        { spot: 'Wagah Border', timeOfDay: '04:30 PM (Border Parade)', tip: 'Reach border stadium by 3:30 PM for good seating.' }
      ],
      recommendedLocalMode: 'E-Auto Rickshaw + Pedestrian Plaza Walk',
      modeExplanation: 'The entire heritage corridor surrounding the Golden Temple is marble paved and pedestrian-only.',
      estimatedDuration: 'Full Day (approx 10 hours)',
      estimatedCost: '₹400 - ₹800'
    },
    weather: { temp: '22°C', condition: 'Cool Breeze', bestSeason: 'Oct – Mar' },
    mapCoords: { x: 32, y: 24 },
    gallery: ['goldentemple.png', 'https://images.unsplash.com/photo-1514222709107-a180c68d72b4?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: '3',
    title: 'Kedarnath & Badrinath Char Dham',
    location: 'Garhwal Himalayas, Uttarakhand, India',
    image: 'kedarnath.png',
    rating: 4.9,
    category: 'temples',
    tags: ['Himalayan Dham', 'Jyotirlinga', 'Sacred Trek'],
    description: 'One of the highest Shiva Jyotirlingas surrounded by dramatic snow peaks of the Himalayas along the Mandakini river. Home to ancient mountain shrines and hearty Pahadi mountain cuisine.',
    spots: ['Kedarnath Shiva Temple', 'Bhairavnath Hilltop Temple', 'Vasuki Tal Glacial Lake'],
    localAttractions: [
      { name: 'Kedarnath Shiva Temple', desc: 'Ancient stone temple dedicated to Lord Shiva standing against Kedarnath mountain peak.', type: 'Temple' },
      { name: 'Bhairavnath Hilltop Lookout', desc: 'Trek 1km uphill for panoramic views of the entire Kedarnath valley & glacier.', type: 'Viewpoint' },
      { name: 'Vasuki Tal Glacial Lake', desc: 'High-altitude crystal clear blue glacial lake located 8km from Kedarnath.', type: 'Nature' },
      { name: 'Mana Village (Last Indian Village)', desc: 'Historic border village near Badrinath featuring Vyas Gufa cave & Saraswati river origin.', type: 'Heritage' },
      { name: 'Chorabari Tal (Gandhi Sarovar)', desc: 'Glacial lake at the foot of Kedarnath glacier where Mahatma Gandhi\'s ashes were immersed.', type: 'Nature' }
    ],
    mustTryDishes: [
      { name: 'Garhwali Kafuli', desc: 'Nutritious green spinach and fenugreek leaf curry thickened with rice paste and cooked in an iron kadai.', veg: true, famousAt: 'Pahadi Dhabas', imageEmoji: '🥬' },
      { name: 'Aloo ke Gutke', desc: 'Mountain baby potatoes tossed with spicy cumin, jakhiya (wild mustard) seeds & turmeric.', veg: true, famousAt: 'Trek Trail Tea Stalls', imageEmoji: '🥔' },
      { name: 'Almora Bal Mithai', desc: 'Traditional Uttarakhand roasted khoya sweet coated with crunchy white sugar balls.', veg: true, famousAt: 'Local Sweet Shops', imageEmoji: '🍬' },
      { name: 'Garhwali Chainsoo', desc: 'Roast black gram (kala chana) lentil stew cooked with aromatic garlic and Himalayan spices.', veg: true, famousAt: 'Local Garhwal Messes', imageEmoji: '🍲' },
      { name: 'Pahadi Rhododendron (Buransh) Tea', desc: 'Hot herbal pink tea brewed with wild red Buransh flower petals and ginger.', veg: true, famousAt: 'Base Camp Stalls', imageEmoji: '🫖' }
    ],
    itinerary: [
      { day: 1, title: 'Gaurikund to Kedarnath Trek', desc: 'Embark on the breathtaking 16km mountain trail along roaring mountain streams.', done: true },
      { day: 2, title: 'Kedarnath Dawn Aarti', desc: 'Attend morning Shiva Puja against the backdrop of Kedarnath snow peak.', done: false },
      { day: 3, title: 'Bhairavnath Lookout Point', desc: 'Trek 1km uphill for panoramic views of the entire Kedarnath temple valley.', done: false }
    ],
    phrases: [
      { original: 'जय भोलेनाथ', pronounce: 'Jai Bholenath', meaning: 'Hail Lord Shiva (Greeting)', langCode: 'hi-IN' },
      { original: 'हर हर महादेव', pronounce: 'Har Har Mahadev', meaning: 'Glory to Shiva the Supreme', langCode: 'hi-IN' }
    ],
    pathOptimizer: {
      optimizedSequence: [
        { spot: 'Gaurikund Base Camp', timeOfDay: '04:00 AM (Start Trek)', tip: 'Start climbing early to reach the valley before afternoon mountain fog.' },
        { spot: 'Kedarnath Sanctum', timeOfDay: '05:00 PM (Evening Aarti)', tip: 'Ring traditional bells as evening chants echo across glacier mountains.' },
        { spot: 'Bhairavnath Lookout', timeOfDay: '07:00 AM (Next Day)', tip: 'Early morning clear sky yields stunning photographs of snow peaks.' }
      ],
      recommendedLocalMode: 'Helicopter Shuttle or Pony/Palki Service',
      modeExplanation: 'Helicopters operate from Phata/Guptkashi for quick 10-minute valley flights.',
      estimatedDuration: '2 Days (approx 20 hours total)',
      estimatedCost: '₹3,000 - ₹7,000'
    },
    weather: { temp: '10°C', condition: 'Chilly Mountain Air', bestSeason: 'May – Oct' },
    mapCoords: { x: 42, y: 22 },
    gallery: ['kedarnath.png', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: '4',
    title: 'Madurai Meenakshi Temple',
    location: 'Madurai, Tamil Nadu, India',
    image: 'madurai.png',
    rating: 4.9,
    category: 'temples',
    tags: ['Dravidian Marvel', 'Gopurams', 'Historic'],
    description: 'A 2,500-year-old architectural masterpiece with 14 towering colorful Gopuram gateways covered in thousands of intricate stone sculptures. Legendary for historic Nayak heritage and iconic Tamil street food.',
    spots: ['Meenakshi Amman Shrine', 'Hall of 1000 Pillars', 'Golden Lotus Sacred Tank'],
    localAttractions: [
      { name: 'Meenakshi Amman Shrine', desc: 'Ancient Dravidian temple dedicated to Goddess Meenakshi & Lord Sundareswarar.', type: 'Temple' },
      { name: 'Hall of 1000 Pillars', desc: 'Architectural marvel featuring 985 carved granite columns and sound-resonant musical stone pillars.', type: 'Heritage' },
      { name: 'Thirumalai Nayakkar Palace', desc: '17th-century royal palace with massive white pillars blending Italian & Dravidian architecture.', type: 'Heritage' },
      { name: 'Vandiyur Mariamman Teppakulam', desc: 'Huge sacred temple pond housing a central Mandapam island palace.', type: 'Lake' },
      { name: 'Gandhi Memorial Museum', desc: 'Historic museum housing Mahatma Gandhi\'s blood-stained garment worn during assassination.', type: 'Museum' }
    ],
    mustTryDishes: [
      { name: 'Madurai Famous Jigarthanda', desc: 'Famous cooling dessert drink made with almond gum (badam pisin), sarsaparilla syrup, milk & cream ice cream.', veg: true, famousAt: 'Famous Jigarthanda Shop', imageEmoji: '🍨' },
      { name: 'Madurai Bun Parotta', desc: 'Soft, fluffy, round fried parotta resembling a bun, served with spicy salna gravy.', veg: true, famousAt: 'Madurai Hotel Bun Parotta', imageEmoji: '🫓' },
      { name: 'Madurai Kari Dosa', desc: 'Iconic three-layered crispy dosa topped with plain omelette and spicy minced mutton curry.', veg: false, famousAt: 'Simmakkal Konar Mess', imageEmoji: '🥞' },
      { name: 'Seena Ramu Soft Idlis', desc: 'Steaming piping-hot pillowy soft idlis served with 4 varieties of fresh coconut & tomato chutneys.', veg: true, famousAt: 'Murugan Idli Shop', imageEmoji: '⚪' },
      { name: 'Madurai Mutton Chukka', desc: 'Pan-roasted tender mutton cubes tossed with shallow fried onions, curry leaves & black pepper.', veg: false, famousAt: 'Amma Mess', imageEmoji: '🥩' }
    ],
    itinerary: [
      { day: 1, title: 'Gopuram Tower Exploration', desc: 'Marvel at the 170-foot southern Gopuram tower with painted mythical deities.', done: true },
      { day: 2, title: 'Thousand Pillar Museum', desc: 'Walk through 985 carved granite columns and sound-resonant musical pillars.', done: false },
      { day: 3, title: 'Night Bedchamber Ceremony', desc: 'Witness the evening ritual procession of Lord Sundareswarar to Goddess Meenakshi shrine.', done: false }
    ],
    phrases: [
      { original: 'வணக்கம்', pronounce: 'Vanakkam', meaning: 'Hello / Greetings (Tamil)', langCode: 'ta-IN' },
      { original: 'மீனாட்சி அம்மன் கோவில்', pronounce: 'Meenakshi Amman Kovil', meaning: 'Meenakshi Goddess Temple', langCode: 'ta-IN' },
      { original: 'நன்றி', pronounce: 'Nandri', meaning: 'Thank you', langCode: 'ta-IN' }
    ],
    pathOptimizer: {
      optimizedSequence: [
        { spot: 'Meenakshi Amman Shrine', timeOfDay: '06:00 AM (Early Darshan)', tip: 'Morning hours are peaceful and avoid afternoon stone floor heat.' },
        { spot: 'Hall of 1000 Pillars', timeOfDay: '11:00 AM (Museum Walk)', tip: 'Indoor granite art gallery showcasing ancient Chola and Nayak bronze statues.' },
        { spot: 'Golden Lotus Tank', timeOfDay: '05:30 PM (Sunset Walk)', tip: 'Reflections of illuminated colorful Gopurams on the holy tank water.' }
      ],
      recommendedLocalMode: 'Walking Tour + Local Auto-Rickshaw',
      modeExplanation: 'Madurai temple quadrangle is pedestrianized with shoe-counters at all 4 cardinal tower gates.',
      estimatedDuration: 'Full Day (approx 7 hours)',
      estimatedCost: '₹400 - ₹800'
    },
    weather: { temp: '31°C', condition: 'Warm & Tropical', bestSeason: 'Oct – Mar' },
    mapCoords: { x: 45, y: 84 },
    gallery: ['madurai.png', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: '5',
    title: 'Varanasi Sacred Ghats & Kashi Vishwanath',
    location: 'Varanasi, Uttar Pradesh, India',
    image: 'varanasi.png',
    rating: 4.7,
    category: 'temples',
    tags: ['Heritage', 'Spiritual', 'Culture'],
    description: "One of the world's oldest continuously inhabited cities. Experience spirituality along the banks of the sacred Ganges River with chanting oil lamps, street narrow alleys, and ancient sweet delicacies.",
    spots: ['Kashi Vishwanath Temple', 'Dashashwamedh Ghat', 'Sarnath Buddhist Stupa'],
    localAttractions: [
      { name: 'Kashi Vishwanath Temple', desc: 'Sacred golden spire Jyotirlinga temple standing beside the holy Ganges river.', type: 'Temple' },
      { name: 'Dashashwamedh Ghat', desc: 'Vibrant central ghat where the famous evening Ganga Aarti ceremony takes place.', type: 'Ghat' },
      { name: 'Assi Ghat & Manikarnika Ghat', desc: 'Historic ghats famous for sunrise yoga, Vedic chants, and sacred cremation rituals.', type: 'Ghat' },
      { name: 'Sarnath Buddhist Stupa', desc: 'Sacred Buddhist pilgrimage site where Lord Buddha delivered his first sermon.', type: 'Heritage' },
      { name: 'Ramnagar Fort & Museum', desc: '18th-century red sandstone fort on Ganges eastern bank displaying royal vintage cars.', type: 'Heritage' }
    ],
    mustTryDishes: [
      { name: 'Banarasi Malaiyyo', desc: 'Ethereal winter dessert of light foamy milk froth infused with saffron, green cardamom & pistachios.', veg: true, famousAt: 'Chowk Local Sweet Stalls', imageEmoji: '🍮' },
      { name: 'Kashi Tamatar Chaat', desc: 'Spicy tangy potato-tomato mash simmered with ghee, spices, hing & topped with crispy namkeen.', veg: true, famousAt: 'Kashi Chaat Bhandar', imageEmoji: '🍲' },
      { name: 'Banarasi Meetha Paan', desc: 'Iconic sweet betel leaf wrapped with gulkand, tutty-frutti, menthol & fragrant spices.', veg: true, famousAt: 'Keshav Tambool Bhandar', imageEmoji: '🍃' },
      { name: 'Chachi ki Kachori Jalebi', desc: 'Crispy fried urad-dal stuffed kachori paired with spicy aloo curry & hot crispy jalebis.', veg: true, famousAt: 'Pahalwan Lassi / Chachi Dukaan', imageEmoji: '🥟' },
      { name: 'Varanasi Blue Rabri Lassi', desc: 'Thick clay-pot sweet lassi loaded with Rabri, fresh fruit toppings & rose syrup.', veg: true, famousAt: 'Blue Lassi Shop', imageEmoji: '🥛' }
    ],
    itinerary: [
      { day: 1, title: 'Ganga Aarti Evening', desc: 'Witness the spectacular ritual prayer with fire and incense at Dashashwamedh Ghat.', done: true },
      { day: 2, title: 'Subah-e-Banaras Boat', desc: 'Take a serene sunrise boat ride on the holy Ganges River.', done: false },
      { day: 3, title: 'Buddhist Stupa Visit', desc: 'Drive to Sarnath where Lord Buddha preached his very first sermon.', done: false }
    ],
    phrases: [
      { original: 'काशी विश्वनाथ मंदिर किधर है?', pronounce: 'Kashi Vishwanath Mandir kidhar hai?', meaning: 'Where is the Kashi Vishwanath temple?', langCode: 'hi-IN' },
      { original: 'गंगा आरती कब शुरू होगी?', pronounce: 'Ganga Aarti kab shuru hogi?', meaning: 'When will the Ganga Aarti start?', langCode: 'hi-IN' }
    ],
    pathOptimizer: {
      optimizedSequence: [
        { spot: 'Kashi Vishwanath Temple', timeOfDay: '06:00 AM (Early Darshan)', tip: 'Beat the heavy crowds by booking online tickets and attending the morning Aarti ceremony.' },
        { spot: 'Sarnath Buddhist Stupa', timeOfDay: '11:00 AM (Day Trip)', tip: 'Take a 30-minute drive out of Varanasi city limits to enjoy the quiet archaeological parks.' },
        { spot: 'Dashashwamedh Ghat', timeOfDay: '05:30 PM (Evening Aarti)', tip: 'Hire a rowing boat on the Ganges. Watching the grand multi-lamp prayer from the water is mystical.' }
      ],
      recommendedLocalMode: 'Ghat Rowing Boat + Walking Tour Guide',
      modeExplanation: 'Varanasi lanes are extremely narrow, chaotic, and closed to cars. Walking is fastest. Boat rides let you bypass streets to transit between distant Ghats.',
      estimatedDuration: 'Full Day (approx 10 hours)',
      estimatedCost: '₹1,000 - ₹1,500'
    },
    weather: { temp: '25°C', condition: 'Hazy Sun', bestSeason: 'Nov – Feb' },
    mapCoords: { x: 58, y: 42 },
    gallery: ['varanasi.png', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: '6',
    title: 'Agra Wonders & Taj Mahal',
    location: 'Agra, Uttar Pradesh, India',
    image: 'tajmahal.png',
    rating: 4.9,
    category: 'heritage',
    tags: ['Heritage', 'Culture', 'Wonders'],
    description: 'Witness the iconic Taj Mahal, a monument of love built by Emperor Shah Jahan. Discover majestic forts, historical ruins, and legendary Mughal sweet delicacies.',
    spots: ['Taj Mahal Mausoleum', 'Agra Fort Walls', 'Mehtab Bagh Gardens'],
    localAttractions: [
      { name: 'Taj Mahal Mausoleum', desc: 'World famous white marble mausoleum built by Shah Jahan for Mumtaz Mahal.', type: 'Wonder' },
      { name: 'Agra Red Fort Walls', desc: 'Massive 16th-century Mughal red sandstone imperial palace & fortress complex.', type: 'Heritage' },
      { name: 'Mehtab Bagh Gardens', desc: 'Charbagh garden complex across Yamuna river providing perfect Taj Mahal sunset reflections.', type: 'Garden' },
      { name: 'Akbar\'s Tomb at Sikandra', desc: 'Architectural masterpiece combining Islamic, Hindu & Christian design motifs.', type: 'Heritage' },
      { name: 'Fatehpur Sikri Citadel', desc: 'UNESCO World Heritage royal ghost city featuring the giant Buland Darwaza gate.', type: 'Heritage' }
    ],
    mustTryDishes: [
      { name: 'Panchhi Authentic Agra Petha', desc: 'Famous sweet ash gourd confection available in Kesar, Angoori, Paan & Chocolate flavors.', veg: true, famousAt: 'Panchhi Petha Store Sadar', imageEmoji: '🍬' },
      { name: 'Agra Bedai & Aloo Sabzi', desc: 'Deep-fried crispy spiced lentil bread served with piping hot spicy potato curry & curds.', veg: true, famousAt: 'Deviram Sweets', imageEmoji: '🫓' },
      { name: 'Mughlai Chicken Korma', desc: 'Rich cream and cashew-based chicken gravy seasoned with saffron & whole aromatic cardamom.', veg: false, famousAt: 'Pinch of Spice', imageEmoji: '🍗' },
      { name: 'Sadar Bazaar Bhalla Chaat', desc: 'Crispy fried potato patty mashed and topped with sweet yogurt, tamarind chutney & pomegranate.', veg: true, famousAt: 'Agra Chat House', imageEmoji: '🍲' },
      { name: 'Shahi Tukda Dessert', desc: 'Fried bread slices soaked in saffron cardamon syrup and topped with thick Rabri & pistachio nuts.', veg: true, famousAt: 'Jahanpanah', imageEmoji: '🍞' }
    ],
    itinerary: [
      { day: 1, title: 'Taj Sunrise View', desc: 'Arrive at 5:30 AM to witness the white marble turn pink under the soft morning sun.', done: true },
      { day: 2, title: 'Agra Fort Exploration', desc: 'Walk inside the massive red sandstone fortress built by Akbar.', done: false },
      { day: 3, title: 'Yamuna River Sunset', desc: 'Watch the reflection of the Taj Mahal from Mehtab Bagh gardens across the river.', done: false }
    ],
    phrases: [
      { original: 'नमस्ते', pronounce: 'Namaste', meaning: 'Hello / Greetings', langCode: 'hi-IN' },
      { original: 'यह कितने का है?', pronounce: 'Yeh kitne ka hai?', meaning: 'How much does this cost?', langCode: 'hi-IN' },
      { original: 'धन्यवाद', pronounce: 'Dhanyavaad', meaning: 'Thank you', langCode: 'hi-IN' }
    ],
    pathOptimizer: {
      optimizedSequence: [
        { spot: 'Taj Mahal Mausoleum', timeOfDay: '05:30 AM (Sunrise)', tip: 'Arrive early to beat queues and capture the stunning sunrise colors over the white marble.' },
        { spot: 'Agra Fort Walls', timeOfDay: '11:00 AM (Midday)', tip: 'Walk through red sandstone palaces, fully shaded by historic fort walls during peak sun.' },
        { spot: 'Mehtab Bagh Gardens', timeOfDay: '05:30 PM (Sunset)', tip: 'Cross the Yamuna River to view the Taj Mahal sunset reflection without the crowds.' }
      ],
      recommendedLocalMode: 'Eco-Friendly E-Rickshaw Package',
      modeExplanation: 'Agra Trapeze Zone bans petrol vehicles within 500m of Taj Mahal. Hiring a local electric rickshaw for the day gets you direct door-to-door drops.',
      estimatedDuration: 'Full Day (approx 7.5 hours)',
      estimatedCost: '₹600 - ₹800'
    },
    weather: { temp: '24°C', condition: 'Sunny & Clear', bestSeason: 'Oct – Mar' },
    mapCoords: { x: 44, y: 36 },
    gallery: ['tajmahal.png', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: '7',
    title: 'Munnar Tea Hills',
    location: 'Munnar, Kerala, India',
    image: 'munnar.png',
    rating: 4.8,
    category: 'nature',
    tags: ['Nature', 'Mountains', 'Tea Gardens'],
    description: 'Soak in the mist-covered green hills, cascading waterfalls, and sprawling tea plantations of Munnar, a tranquil paradise in the Western Ghats with rich Malabar coastal flavors.',
    spots: ['Kolukkumalai Tea Estate', 'Eravikulam National Park', 'Mattupetty Dam'],
    localAttractions: [
      { name: 'Kolukkumalai Tea Estate', desc: 'Highest organic tea estate in the world boasting sunrise clouds below your feet.', type: 'Tea Garden' },
      { name: 'Eravikulam National Park', desc: 'Sanctuary for the rare endangered Nilgiri Tahr mountain goat amidst Neelakurinji hills.', type: 'Nature' },
      { name: 'Mattupetty Dam & Reservoir', desc: 'Scenic mountain lake popular for speedboating and wild elephant sightings.', type: 'Lake' },
      { name: 'Anamudi Mountain Peak', desc: 'Tallest peak in South India reaching 2,695 meters above sea level.', type: 'Viewpoint' },
      { name: 'Attukad Waterfalls', desc: 'Breathtaking cascading waterfall tucked inside dense tea hill ravines.', type: 'Waterfalls' }
    ],
    mustTryDishes: [
      { name: 'Kerala Sadya on Banana Leaf', desc: 'Grand traditional feast of 24 vegetarian delicacies served on fresh banana leaf with Red Rice & Payasam.', veg: true, famousAt: 'Saravana Bhavan / Local Messes', imageEmoji: '🍃' },
      { name: 'Kerala Parotta with Chicken Stew', desc: 'Flaky layered Kerala parotta served with aromatic coconut milk chicken stew.', veg: false, famousAt: 'Rapsy Restaurant', imageEmoji: '🫓' },
      { name: 'Kerala Fish Molee', desc: 'Tender fish fillet simmered gently in mild spiced coconut milk gravy with curry leaves.', veg: false, famousAt: 'Hotel Gurubhavan', imageEmoji: '🐟' },
      { name: 'Lacy Appam with Veg Stew', desc: 'Soft fermented rice crepe bowl with crispy lacy borders served with creamy vegetable stew.', veg: true, famousAt: 'Eastend Munnar', imageEmoji: '🥞' },
      { name: 'Shaken Kulukki Sarbath', desc: 'Refreshing Kerala chilled lemonade shaken with green chili, ginger & basil seeds (sabja).', veg: true, famousAt: 'Street Juice Stalls', imageEmoji: '🍹' }
    ],
    itinerary: [
      { day: 1, title: 'Tea Garden Stroll', desc: 'Walk through endless corridors of tea shrubs and visit the tea processing museum.', done: true },
      { day: 2, title: 'Nilgiri Tahr Spotting', desc: 'Trek inside Eravikulam to catch a glimpse of the endangered mountain goat.', done: false },
      { day: 3, title: 'Reservoir Speedboat', desc: 'Take a thrilling speedboat ride on the reservoir waters of Mattupetty.', done: false }
    ],
    phrases: [
      { original: 'നമസ്കാരം', pronounce: 'Namaskaram', meaning: 'Hello / Greetings', langCode: 'ml-IN', fallbackDevanagari: 'नमस्कारम' },
      { original: 'വഴി പറയാമോ?', pronounce: 'Vazhi parayamo?', meaning: 'Can you tell me the way?', langCode: 'ml-IN', fallbackDevanagari: 'வழி പറയുമോ' },
      { original: 'നന്ദി', pronounce: 'Nanni', meaning: 'Thank you', langCode: 'ml-IN', fallbackDevanagari: 'നന്ദി' }
    ],
    pathOptimizer: {
      optimizedSequence: [
        { spot: 'Kolukkumalai Tea Estate', timeOfDay: '04:30 AM (Dawn Trek)', tip: 'Requires a 4x4 rugged jeep climb in the dark to catch the famous sunrise above the cloud bed.' },
        { spot: 'Mattupetty Dam', timeOfDay: '11:30 AM (Morning Boating)', tip: 'Drive down for speedboating and catch glimpses of wild elephants drinking water near the shores.' },
        { spot: 'Eravikulam National Park', timeOfDay: '02:30 PM (Afternoon Trek)', tip: 'Take the national park forest shuttle up to spot the rare Nilgiri Tahr mountain goats.' }
      ],
      recommendedLocalMode: '4x4 Mountain Jeep + Local Taxi Combo',
      modeExplanation: "The road to Kolukkumalai is the world's highest organic tea estate trail, extremely bumpy and restricted to local 4x4 jeeps. Use a taxi for the rest of Munnar.",
      estimatedDuration: '1.5 Days (approx 14 hours total)',
      estimatedCost: '₹2,500 - ₹3,000'
    },
    weather: { temp: '19°C', condition: 'Misty & Refreshing', bestSeason: 'Sep – May' },
    mapCoords: { x: 42, y: 80 },
    gallery: ['munnar.png', 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: '8',
    title: 'Vizag Coastal Hills',
    location: 'Visakhapatnam, Andhra Pradesh, India',
    image: 'vizag.png',
    rating: 4.8,
    category: 'nature',
    tags: ['Coastal', 'Nature', 'Heritage'],
    description: 'Explore the spectacular meeting of hills and the Bay of Bengal. Ride the scenic Vistadome railway through Araku, walk RK beach, and sample famous coastal seafood delicacies.',
    spots: ['INS Kursura Submarine Museum', 'Araku Valley Tea Gardens', 'Borra Caves'],
    localAttractions: [
      { name: 'INS Kursura Submarine Museum', desc: 'Real decommissioned Russian-built submarine setup directly on RK beach sand.', type: 'Museum' },
      { name: 'Araku Valley & Chaparai Waterfalls', desc: 'Scenic valley hill station filled with organic coffee plantations & tribal waterfalls.', type: 'Nature' },
      { name: 'Borra Caves', desc: 'Million-year-old limestone caves featuring dramatic stalactites illuminated in multi-color lights.', type: 'Cave' },
      { name: 'Kailasagiri Hilltop Park', desc: 'Hilltop park reached via ropeway cable car overlooking the vast blue ocean.', type: 'Viewpoint' },
      { name: 'Rishikonda & Yarada Beaches', desc: 'Golden sand blue-flag beaches flanked by lush green Eastern Ghats mountains.', type: 'Beach' }
    ],
    mustTryDishes: [
      { name: 'Araku Tribal Bamboo Chicken', desc: 'Fresh chicken marinated with wild forest herbs cooked inside hollow green bamboo over charcoal.', veg: false, famousAt: 'Araku Valley Tribal Stalls', imageEmoji: '🎋' },
      { name: 'Vizag Royyala Iguru', desc: 'Spicy coastal Andhra prawn fry simmered with caramelized onions, curry leaves & green chilies.', veg: false, famousAt: 'Sea Inn (Raju Gaari Dhaba)', imageEmoji: '🦐' },
      { name: 'Madugula Halwa', desc: '100-year-old traditional wheat-milk dessert cooked slowly with ghee, cashews & cardamom.', veg: true, famousAt: 'Madugula Halwa Outlets', imageEmoji: '🍮' },
      { name: 'Hot RK Beach Punugulu', desc: 'Crispy fried small ball fritters made of fermented rice-urad batter served with ginger-coconut chutney.', veg: true, famousAt: 'RK Beach Stalls', imageEmoji: '🧆' },
      { name: 'Andhra Chepala Pulusu', desc: 'Tangy fish curry slow cooked in clay pots with tamarind juice, raw mango & fiery spices.', veg: false, famousAt: 'Kamat Restaurant', imageEmoji: '🍲' }
    ],
    itinerary: [
      { day: 1, title: 'Vistadome Valley Journey', desc: 'Board the early morning Vistadome train traversing through tunnels to Araku valley.', done: true },
      { day: 2, title: 'Borra Caves Expedition', desc: 'Walk inside the deepest natural cave structures in India with stalactite formations.', done: false },
      { day: 3, title: 'Coastline Submarine Visit', desc: 'Stroll on RK beach and tour the historic decommissioned INS Kursura submarine.', done: false }
    ],
    phrases: [
      { original: 'నమస్కారం', pronounce: 'Namaskaram', meaning: 'Hello / Greetings (Telugu)', langCode: 'te-IN', fallbackDevanagari: 'नमस्कारम' },
      { original: 'అరకు వెళ్లే రైలు ఎక్కడ ఆగుతుంది?', pronounce: 'Araku velle railu ekkada aaguthundi?', meaning: 'Where does the train to Araku stop?', langCode: 'te-IN', fallbackDevanagari: 'अरकु वेल्ले रैलు एक्कड आगुतुंदी' },
      { original: 'భోజనం చాలా బాగుంది', pronounce: 'Bhojanam chala baagundi', meaning: 'The food is very delicious', langCode: 'te-IN', fallbackDevanagari: 'भोजनम चाला बागुंदी' },
      { original: 'ధన్యవాదాలు', pronounce: 'Dhanyavaadalu', meaning: 'Thank you very much', langCode: 'te-IN', fallbackDevanagari: 'धन्यवादालु' }
    ],
    pathOptimizer: {
      optimizedSequence: [
        { spot: 'Araku Valley Tea Gardens', timeOfDay: '06:50 AM (Vistadome Train)', tip: 'Take the famous Vistadome glass-roof coach up the Ananthagiri ghat tunnels to Araku.' },
        { spot: 'Borra Caves', timeOfDay: '02:00 PM (Afternoon Stop)', tip: 'On the return journey from Araku by road, stop at the million-year-old limestone Borra caves.' },
        { spot: 'INS Kursura Submarine Museum', timeOfDay: '04:30 PM (Next Day Beach)', tip: 'Stroll RK beach and tour the interior chambers of the actual decommissioned cold-war submarine.' }
      ],
      recommendedLocalMode: 'Vistadome Scenic Rail + Private Return Cab',
      modeExplanation: 'Hills are 115km away. The train up is a lifetime experience. Booking a private cab to meet you at Araku and drive you back allows you to explore Borra caves easily.',
      estimatedDuration: '2 Days (approx 16 hours total)',
      estimatedCost: '₹3,500 - ₹4,200'
    },
    weather: { temp: '27°C', condition: 'Sunny Ocean Breeze', bestSeason: 'Oct – Mar' },
    mapCoords: { x: 62, y: 60 },
    gallery: ['vizag.png', 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: '9',
    title: 'Goa Beaches & Heritage',
    location: 'Panaji, Goa, India',
    image: 'goa.png',
    rating: 4.9,
    category: 'nature',
    tags: ['Beaches', 'Nightlife', 'Portuguese Heritage'],
    description: 'Golden sand beaches, historic Portuguese churches, vibrant beach shacks, and exhilarating water sports along the Arabian Sea paired with famous Goan seafood.',
    spots: ['Baga Beach Shoreline', 'Aguada Portuguese Fort', 'Basilica of Bom Jesus'],
    localAttractions: [
      { name: 'Baga & Calangute Beach', desc: 'Vibrant beaches renowned for parasailing, jet-skiing & lively evening beach shacks.', type: 'Beach' },
      { name: 'Aguada Fort & Lighthouse', desc: '17th-century cliffside Portuguese fortress offering panoramic ocean views.', type: 'Heritage' },
      { name: 'Basilica of Bom Jesus', desc: 'UNESCO World Heritage church holding the sacred relics of St. Francis Xavier.', type: 'Heritage' },
      { name: 'Dudhsagar Waterfalls', desc: 'Spectacular 4-tiered white water waterfall located inside Bhagwan Mahavir Wildlife Sanctuary.', type: 'Waterfalls' },
      { name: 'Anjuna Flea Market', desc: 'Famous coastal market selling bohemian clothes, souvenirs & local crafts.', type: 'Culture' }
    ],
    mustTryDishes: [
      { name: 'Goan Fish Curry Rice', desc: 'Classic staple of Kingfish simmered in coconut, tamarind & Kashmiri chili gravy served with steamed rice.', veg: false, famousAt: 'Fat Fish / Ritz Classic', imageEmoji: '🍛' },
      { name: 'Pork Vindaloo', desc: 'Fiery Goan Portuguese curry slow-cooked with palm vinegar, garlic, ginger & red chilies.', veg: false, famousAt: 'Mum\'s Kitchen', imageEmoji: '🥘' },
      { name: 'Goan Bebinca Dessert', desc: 'Traditional 7-layered Goan baked dessert made from coconut milk, ghee, sugar & egg yolks.', veg: false, famousAt: 'Martin\'s Corner', imageEmoji: '🍰' },
      { name: 'Goan Poi with Chorizo', desc: 'Local crusty sourdough bread pocket stuffed with spicy smoked Goan pork sausage.', veg: false, famousAt: 'Local Bakery Carts', imageEmoji: '🥪' },
      { name: 'Chilled Sol Kadhi', desc: 'Cooling pink digestif drink made with fresh kokum fruit extract, coconut milk & garlic.', veg: true, famousAt: 'Fisherman\'s Wharf', imageEmoji: '🍹' }
    ],
    itinerary: [
      { day: 1, title: 'North Goa Beach Hopping', desc: 'Visit Calangute and Baga beach, enjoy water sports and sunset beach shacks.', done: true },
      { day: 2, title: 'Old Goa Heritage Walk', desc: 'Explore the 16th-century Basilica of Bom Jesus and Se Cathedral.', done: false },
      { day: 3, title: 'Aguada Fort Sunset', desc: 'Watch sunset from the cliffside 17th-century lighthouse fort overlooking Mandovi river.', done: false }
    ],
    phrases: [
      { original: 'देव बरे करू', pronounce: 'Dev bare karum', meaning: 'Thank you / God bless (Konkani)', langCode: 'hi-IN' },
      { original: 'कसले खबर?', pronounce: 'Kasale khabar?', meaning: 'How are you?', langCode: 'hi-IN' }
    ],
    pathOptimizer: {
      optimizedSequence: [
        { spot: 'Aguada Portuguese Fort', timeOfDay: '09:00 AM (Morning)', tip: 'Visit early morning before heat peaks to take cliffside lighthouse photos.' },
        { spot: 'Basilica of Bom Jesus', timeOfDay: '01:00 PM (Midday)', tip: 'Air-conditioned ancient church interior holding saint relics.' },
        { spot: 'Baga Beach Shoreline', timeOfDay: '05:30 PM (Sunset)', tip: 'Relax at sunset beach shacks with fresh seafood and live acoustic music.' }
      ],
      recommendedLocalMode: 'Self-Drive Scooter Rental',
      modeExplanation: 'Renting a scooter for ₹400/day is the quintessential Goa experience for weaving through coastal palm roads.',
      estimatedDuration: 'Full Day (approx 8 hours)',
      estimatedCost: '₹800 - ₹1,200'
    },
    weather: { temp: '29°C', condition: 'Sunny Coastal', bestSeason: 'Nov – Feb' },
    mapCoords: { x: 30, y: 68 },
    gallery: ['goa.png', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: '10',
    title: 'Jaipur Pink City Palaces',
    location: 'Jaipur, Rajasthan, India',
    image: 'jaipur.png',
    rating: 4.8,
    category: 'heritage',
    tags: ['Palaces', 'Heritage', 'Forts'],
    description: 'The capital of Rajasthan renowned for pink sandstone architecture, grand hilltop forts, royal palaces, bustling handicraft bazaars, and mouthwatering Rajasthani thalis.',
    spots: ['Amber Palace Fort', 'Hawa Mahal Palace of Winds', 'City Palace Museum'],
    localAttractions: [
      { name: 'Amber Fort & Sheesh Mahal', desc: 'Majestic hilltop fort featuring the glittering palace of mirrors (Sheesh Mahal).', type: 'Fort' },
      { name: 'Hawa Mahal (Palace of Winds)', desc: '5-story honeycomb pink sandstone facade with 953 lattice windows.', type: 'Heritage' },
      { name: 'City Palace & Jantar Mantar', desc: 'Royal palace museum & UNESCO astronomical stone observatory.', type: 'Museum' },
      { name: 'Nahargarh Fort Sunset Point', desc: 'Hilltop fort overlooking the entire pink city rooftops during golden hour sunset.', type: 'Viewpoint' },
      { name: 'Jal Mahal Water Palace', desc: 'Architectural palace floating serenely in the middle of Man Sagar Lake.', type: 'Palace' }
    ],
    mustTryDishes: [
      { name: 'Jaipur Dal Baati Churma', desc: 'Hard baked wheat balls dipped in ghee, served with 5-lentil dal & sweet cardamom churma.', veg: true, famousAt: 'Chokhi Dhani / Laxmi Misthan Bhandar', imageEmoji: '🫓' },
      { name: 'Rawat Pyaaz Kachori', desc: 'Crispy fried pastry filled with spicy onion-potato masala, famous across India.', veg: true, famousAt: 'Rawat Mishthan Bhandar', imageEmoji: '🥟' },
      { name: 'Rajasthani Laal Maas', desc: 'Fiery slow-cooked tender mutton curry infused with smoky Mathania red chilies & garlic.', veg: false, famousAt: 'Handi Restaurant', imageEmoji: '🍲' },
      { name: 'Gatte ki Sabzi', desc: 'Tender gram flour (besan) cylindrical dumplings simmered in a spiced tangy yogurt curry.', veg: true, famousAt: 'Thali House', imageEmoji: '🍛' },
      { name: 'LMB Royal Saffron Ghevar', desc: 'Traditional disc-shaped honeycomb sweet soaked in saffron sugar syrup & topped with Rabri & almonds.', veg: true, famousAt: 'LMB Johari Bazaar', imageEmoji: '🍩' }
    ],
    itinerary: [
      { day: 1, title: 'Amber Fort Elephant Trail', desc: 'Ascend the majestic hill fort of Amer and explore the Mirror Palace (Sheesh Mahal).', done: true },
      { day: 2, title: 'Hawa Mahal & Johari Bazaar', desc: 'Photograph the honeycomb 953-window facade and shop Jaipur textiles.', done: false },
      { day: 3, title: 'Nahargarh Fort Sunset View', desc: 'Panoramic sunset view over the entire pink city from Nahargarh fort cafe.', done: false }
    ],
    phrases: [
      { original: 'खम्मा घणी', pronounce: 'Khamma Ghani', meaning: 'Royal Greetings / Hello (Rajasthani)', langCode: 'hi-IN' },
      { original: 'आभार', pronounce: 'Aabhar', meaning: 'Thank you very much', langCode: 'hi-IN' }
    ],
    pathOptimizer: {
      optimizedSequence: [
        { spot: 'Amber Palace Fort', timeOfDay: '08:00 AM (Morning)', tip: 'Avoid midday heat and long queue lines by starting at hilltop Amber fort.' },
        { spot: 'Hawa Mahal Palace of Winds', timeOfDay: '01:00 PM (Afternoon)', tip: 'Front view photo spot from Wind View Cafe across the street.' },
        { spot: 'Nahargarh Fort', timeOfDay: '05:30 PM (Sunset)', tip: 'Best sunset panorama of pink city rooftops.' }
      ],
      recommendedLocalMode: 'Auto-Rickshaw Day Booking',
      modeExplanation: 'Hiring a local auto-rickshaw for ₹700/day easily navigates tight bazaar alleys.',
      estimatedDuration: 'Full Day (approx 9 hours)',
      estimatedCost: '₹1,000 - ₹1,500'
    },
    weather: { temp: '26°C', condition: 'Sunny & Warm', bestSeason: 'Oct – Mar' },
    mapCoords: { x: 36, y: 38 },
    gallery: ['jaipur.png', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: '11',
    title: 'Leh Ladakh High Passes',
    location: 'Leh, Ladakh, India',
    image: 'ladakh.png',
    rating: 4.9,
    category: 'nature',
    tags: ['Himalayas', 'Adventure', 'High Passes'],
    description: 'High-altitude cold desert surrounded by snow-capped Himalayan peaks, crystal blue mountain lakes, ancient Buddhist monasteries, and comforting Himalayan noodle soups.',
    spots: ['Pangong Tso Blue Lake', 'Khardung La Pass (17,982 ft)', 'Thiksey Buddhist Monastery'],
    localAttractions: [
      { name: 'Pangong Tso Blue Lake', desc: 'Enchanting high-altitude salt lake changing colors from turquoise to deep purple.', type: 'Lake' },
      { name: 'Khardung La Pass (17,982 ft)', desc: 'Legendary mountain pass offering breathtaking Himalayan mountain views.', type: 'High Pass' },
      { name: 'Thiksey & Hemis Monasteries', desc: '12-story hilltop Tibetan Buddhist monastery housing a 49-foot Maitreya Buddha statue.', type: 'Monastery' },
      { name: 'Nubra Valley & Hunder Dunes', desc: 'High-altitude cold desert dunes featuring double-humped Bactrian camels.', type: 'Nature' },
      { name: 'Magnetic Hill & Confluence', desc: 'Gravity-defying hill spot and scenic confluence of Zanskar & Indus rivers.', type: 'Wonder' }
    ],
    mustTryDishes: [
      { name: 'Ladakhi Thukpa', desc: 'Hearty Himalayan noodle soup cooked with fresh garden vegetables, garlic & mountain herbs.', veg: true, famousAt: 'Leh Main Market Cafes', imageEmoji: '🍜' },
      { name: 'Steamed Tibetan Momos', desc: 'Handmade steamed dumplings filled with spiced vegetables or minced meat served with spicy red chili sauce.', veg: true, famousAt: 'Tibetan Kitchen Leh', imageEmoji: '🥟' },
      { name: 'Gur Gur Chai (Butter Tea)', desc: 'Traditional Himalayan warm tea churned with yak butter, salt & tea leaves.', veg: true, famousAt: 'Monastery Tea Houses', imageEmoji: '☕' },
      { name: 'Skyu Ladakhi Stew', desc: 'Traditional pasta stew with hand-rolled dough thumb-prints cooked with turnips, potatoes & broth.', veg: true, famousAt: 'Local Homestays', imageEmoji: '🍲' },
      { name: 'Chhurpi Yak Cheese', desc: 'Traditional hard-dried Himalayan yak cheese snack enjoyed while trekking.', veg: true, famousAt: 'Local Bakeries', imageEmoji: '🧀' }
    ],
    itinerary: [
      { day: 1, title: 'Leh Acclimatization Walk', desc: 'Rest and adapt to 11,500ft altitude. Stroll Leh local market in the evening.', done: true },
      { day: 2, title: 'Thiksey Monastery Sunrise', desc: 'Attend morning Buddhist prayers at 12-story Thiksey monastery.', done: false },
      { day: 3, title: 'Pangong Tso Excursion', desc: 'Drive across Chang La pass to witness the changing blue hues of Pangong Tso lake.', done: false }
    ],
    phrases: [
      { original: 'Julley', pronounce: 'Julley', meaning: 'Hello / Thank You / Goodbye (Ladakhi)', langCode: 'en-IN' }
    ],
    pathOptimizer: {
      optimizedSequence: [
        { spot: 'Thiksey Monastery', timeOfDay: '06:00 AM (Sunrise Prayers)', tip: 'Listen to monks blow traditional horns at dawn.' },
        { spot: 'Khardung La Pass', timeOfDay: '11:00 AM (Pass Crossing)', tip: 'Limit stay at top pass to 15 mins due to thin oxygen.' },
        { spot: 'Pangong Tso Lake', timeOfDay: '04:00 PM (Lake View)', tip: 'Stay overnight in lakeside eco-tents for stargazing.' }
      ],
      recommendedLocalMode: '4x4 Expedition SUV with Driver',
      modeExplanation: 'Mountain passes require sturdy 4WD vehicles driven by experienced Himalayan local drivers.',
      estimatedDuration: '3 Days (approx 28 hours travel)',
      estimatedCost: '₹8,000 - ₹12,000'
    },
    weather: { temp: '8°C', condition: 'Crisp Alpine Sun', bestSeason: 'May – Sep' },
    mapCoords: { x: 30, y: 15 },
    gallery: ['ladakh.png', 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: '12',
    title: 'Rishikesh Yoga & Ganga Ghats',
    location: 'Rishikesh, Uttarakhand, India',
    image: 'rishikesh.png',
    rating: 4.8,
    category: 'temples',
    tags: ['Yoga', 'Rafting', 'Spiritual', 'Ganges'],
    description: 'The World Capital of Yoga nestled at the Himalayan foothills where the emerald Ganges river emerges. Famous for whitewater rafting, evening Aarti, and healthy Sattvic food.',
    spots: ['Laxman Jhula Suspension Bridge', 'Shivpuri Rafting Rapids', 'Triveni Ghat Evening Aarti'],
    localAttractions: [
      { name: 'Laxman & Ram Jhula', desc: 'Historic suspension bridges spanning the emerald waters of the Ganges river.', type: 'Bridge' },
      { name: 'Shivpuri Rafting Launch', desc: 'Famous launch point for thrilling grade 3 & 4 whitewater rafting down Himalayan rapids.', type: 'Adventure' },
      { name: 'Beatles Ashram (Chaurasi Kutia)', desc: 'Peaceful dome ashram where The Beatles stayed, now filled with vibrant graffiti art.', type: 'Heritage' },
      { name: 'Triveni Ghat', desc: 'Sacred river confluence ghat famous for grand evening Ganga Aarti ceremonies.', type: 'Ghat' },
      { name: 'Neer Garh Waterfall', desc: 'Multi-tiered natural jungle waterfall trail with turquoise mountain pools for swimming.', type: 'Waterfalls' }
    ],
    mustTryDishes: [
      { name: 'Rishikesh Chole Bhature', desc: 'Fluffy golden puffed bhaturas served with spiced chickpea curry, pickled chilies & onion rings.', veg: true, famousAt: 'Chotiwala Restaurant', imageEmoji: '🫓' },
      { name: 'Chotiwala Aloo Puri Breakfast', desc: 'Classic temple-town breakfast of crispy puris served with hot spicy potato curry.', veg: true, famousAt: 'Chotiwala Swargashram', imageEmoji: '🥟' },
      { name: 'Ayurvedic Sattvic Thali', desc: 'Pure organic wholesome thali prepared without onion-garlic using fresh herbs & cow ghee.', veg: true, famousAt: 'Beatles Cafe / Organic Messes', imageEmoji: '🥗' },
      { name: 'Pahadi Ginger Cardamom Chai & Rusks', desc: 'Piping hot spiced tea paired with crunchy baked rusks at riverbank tea stalls.', veg: true, famousAt: 'Laxman Jhula Ghat Stalls', imageEmoji: '☕' },
      { name: 'Rishikesh Falafel & Hummus Wrap', desc: 'Popular fresh Israeli falafel pita pockets served with creamy tahini & hummus.', veg: true, famousAt: 'Freedom Cafe / Pyramids', imageEmoji: '🥙' }
    ],
    itinerary: [
      { day: 1, title: 'Ganga Whitewater Rafting', desc: 'Conquer grade 3 & 4 rapids down Shivpuri to Rishikesh shore.', done: true },
      { day: 2, title: 'Beatles Ashram Meditation', desc: 'Explore Maharishi Mahesh Yogi ashram graffiti ruins.', done: false },
      { day: 3, title: 'Triveni Ghat Ganga Aarti', desc: 'Witness floating oil diyas during evening prayer.', done: false }
    ],
    phrases: [
      { original: 'हर हर गंगे', pronounce: 'Har Har Gange', meaning: 'Hail Holy Ganges (Greeting)', langCode: 'hi-IN' }
    ],
    pathOptimizer: {
      optimizedSequence: [
        { spot: 'Shivpuri Rafting Base', timeOfDay: '08:00 AM (Rafting Launch)', tip: 'Wear dry-fit clothes and secure camera in waterproof bags.' },
        { spot: 'Beatles Ashram Ruins', timeOfDay: '02:00 PM (Ashram Walk)', tip: 'Peaceful dome ruins with colorful psychedelic murals.' },
        { spot: 'Triveni Ghat Aarti', timeOfDay: '06:00 PM (Evening Prayers)', tip: 'Reach ghat by 5:30 PM for front seating.' }
      ],
      recommendedLocalMode: 'Shared Auto + Walking Footbridges',
      modeExplanation: 'Laxman Jhula and Ram Jhula bridges are pedestrian only.',
      estimatedDuration: 'Full Day (approx 9 hours)',
      estimatedCost: '₹800 - ₹1,500'
    },
    weather: { temp: '21°C', condition: 'Breezy & Fresh', bestSeason: 'Sep – Jun' },
    mapCoords: { x: 38, y: 26 },
    gallery: ['rishikesh.png', 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80']
  }
];

export const TRANSPORT_DATABASE: Record<string, Record<string, TransportOption[]>> = {
  '1': {
    'delhi': [
      { mode: 'train', name: 'Gatimaan Express (12050)', duration: '1h 40m', cost: 1200, best: true, tip: 'Runs daily except Fridays. High-speed executive day train with breakfast served onboard.' },
      { mode: 'car', name: 'Yamuna Expressway Road Trip', duration: '3h 30m', cost: 3500, best: false, tip: 'Excellent 6-lane highway. Great for private car rentals or cabs.' }
    ],
    'mumbai': [
      { mode: 'flight', name: 'Flight to Delhi + Cab to Agra', duration: '5h 30m', cost: 6500, best: true, tip: 'Fastest way. Take a 2-hour flight to Delhi (DEL), then hire a prepaid highway cab.' },
      { mode: 'train', name: 'LTT Haridwar AC Superfast', duration: '18h 15m', cost: 2200, best: false, tip: 'Comfortable overnight sleeper option direct to Agra Cantt (AGC) station.' }
    ],
    'bengaluru': [
      { mode: 'flight', name: 'Flight to Delhi + Gatimaan Train', duration: '5h 45m', cost: 7500, best: true, tip: 'Fly to Delhi (DEL) early morning, then board the express train from Hazrat Nizamuddin.' },
      { mode: 'train', name: 'Karnataka Express (12627)', duration: '31h 50m', cost: 2800, best: false, tip: 'Direct train journey traversing across central India. Book AC 2 Tier class.' }
    ]
  }
};
