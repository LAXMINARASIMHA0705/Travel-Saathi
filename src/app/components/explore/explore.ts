import { Component, signal, computed } from '@angular/core';

interface ItineraryItem {
  day: number;
  title: string;
  desc: string;
  done: boolean;
}

interface Phrase {
  original: string;
  pronounce: string;
  meaning: string;
  langCode: string;
  fallbackDevanagari?: string;
  audioFile?: string;
}

interface PathStep {
  spot: string;
  timeOfDay: string;
  tip: string;
}

interface PathOptimizer {
  optimizedSequence: PathStep[];
  recommendedLocalMode: string;
  modeExplanation: string;
  estimatedDuration: string;
  estimatedCost: string;
}

interface Destination {
  id: string;
  title: string;
  location: string;
  image: string;
  rating: number;
  category: string;
  tags: string[];
  description: string;
  spots: string[];
  itinerary: ItineraryItem[];
  phrases: Phrase[];
  pathOptimizer: PathOptimizer;
}

interface TransportOption {
  mode: 'train' | 'flight' | 'bus' | 'cab' | 'car';
  name: string;
  duration: string;
  cost: number;
  best: boolean;
  tip: string;
}

@Component({
  selector: 'app-explore',
  standalone: true,
  templateUrl: './explore.html',
  styleUrls: ['./explore.css']
})
export class ExploreComponent {

  protected readonly activePhraseId = signal<string | null>(null);

  protected readonly activeOptimizerDestId = signal<string | null>(null);

  protected readonly destinations = signal<Destination[]>([
    {
      id: '1',
      title: 'Tirupati Balaji Temple',
      location: 'Tirumala, Andhra Pradesh, India',
      image: '/tirupati.png',
      rating: 5.0,
      category: 'temples',
      tags: ['Holy Shrine', 'Venkateswara', 'Pilgrimage'],
      description: 'The world\'s most visited Hindu pilgrimage center atop seven sacred Tirumala hills, abode of Lord Sri Venkateswara (Balaji).',
      spots: ['Sri Venkateswara Sanctum', 'Kapila Theertham Waterfalls', 'Srivari Mettu Trek Trail'],
      itinerary: [
        { day: 1, title: 'Srivari Footsteps Trek', desc: 'Ascend the 3,550 stone steps up the sacred hill for special trekker darshan.', done: true },
        { day: 2, title: 'Tirumala Balaji Darshan', desc: 'Experience the divine darshan of Lord Venkateswara and receive famous GI-tagged Laddu Prasadam.', done: false },
        { day: 3, title: 'Sri Padmavathi Temple Visit', desc: 'Visit Goddess Padmavathi temple at Tiruchanur near hill base.', done: false }
      ],
      phrases: [
        { original: 'à°“à°‚ à°¨à°®à±‹ à°µà±‡à°‚à°•à°Ÿà±‡à°¶à°¾à°¯', pronounce: 'Om Namo Venkatesaya', meaning: 'Salutations to Lord Venkateswara (Telugu)', langCode: 'te-IN', fallbackDevanagari: 'à¥ à¤¨à¤®à¥‹ à¤µà¥‡à¤™à¥à¤•à¤Ÿà¥‡à¤¶à¤¾à¤¯', audioFile: '/audio/te_1.mp3' },
        { original: 'à°¸à±à°µà°¾à°®à°¿à°µà°¾à°°à°¿ à°¦à°°à±à°¶à°¨à°‚ à°Žà°ªà±à°ªà±à°¡à±?', pronounce: 'Swamivari darshanam eppudu?', meaning: 'When is Swami Darshan?', langCode: 'te-IN', fallbackDevanagari: 'à¤¸à¥à¤µà¤¾à¤®à¥€à¤µà¤¾à¤°à¥€ à¤¦à¤°à¥à¤¶à¤¨à¤® à¤à¤ªà¥à¤ªà¥à¤¡à¥?', audioFile: '/audio/te_2.mp3' },
        { original: 'à°²à°¡à±à°¡à±‚ à°ªà±à°°à°¸à°¾à°¦à°‚ à°•à±Œà°‚à°Ÿà°°à± à°Žà°•à±à°•à°¡ à°‰à°‚à°¦à°¿?', pronounce: 'Laddu Prasadam counter ekkada undi?', meaning: 'Where is the Laddu Prasadam counter?', langCode: 'te-IN', fallbackDevanagari: 'à¤²à¤¡à¥à¤¡à¥‚ à¤ªà¥à¤°à¤¸à¤¾à¤¦à¤® à¤•à¤¾à¤‰à¤‚à¤Ÿà¤° à¤à¤•à¥à¤•à¤¡ à¤‰à¤‚à¤¦à¥€?', audioFile: '/audio/te_3.mp3' }
      ],
      pathOptimizer: {
        optimizedSequence: [
          { spot: 'Srivari Mettu Trail', timeOfDay: '04:00 AM (Dawn Trek)', tip: 'Start climbing early to beat the afternoon sun heat on stone steps.' },
          { spot: 'Sri Venkateswara Sanctum', timeOfDay: '10:30 AM (Darshan Queue)', tip: 'Book TTD online Special Entry Darshan â‚¹300 tickets 3 months in advance.' },
          { spot: 'Kapila Theertham', timeOfDay: '04:00 PM (Hill Foot)', tip: 'Visit Shiva waterfall temple right at the foot of Tirumala hills.' }
        ],
        recommendedLocalMode: 'TTD Electric Bus Service',
        modeExplanation: 'Free eco-friendly TTD electric shuttle buses operate continuously across all Tirumala hill sectors.',
        estimatedDuration: 'Full Day (approx 12 hours)',
        estimatedCost: 'â‚¹500 - â‚¹1,000'
      }
    },
    {
      id: '2',
      title: 'Golden Temple (Harmandir Sahib)',
      location: 'Amritsar, Punjab, India',
      image: '/goldentemple.png',
      rating: 5.0,
      category: 'temples',
      tags: ['Sikh Heritage', 'Holy Sarovar', 'Langar'],
      description: 'The holiest shrine of Sikhism with a pure gold-leaf sanctuary floating gracefully in the center of the sacred Amrit Sarovar pool.',
      spots: ['Harmandir Sahib Sanctum', 'Amrit Sarovar Holy Pool', 'Guru ka Langar Hall'],
      itinerary: [
        { day: 1, title: 'Golden Temple Night View', desc: 'Witness the breathtaking gilded reflection on the moonlit water during Palki Sahib ceremony.', done: true },
        { day: 2, title: 'Mega Langar Seva', desc: 'Participate in cooking or serving meals in the world\'s largest free community kitchen.', done: false },
        { day: 3, title: 'Wagah Border Ceremony', desc: 'Drive 28km to witness the energetic India-Pakistan border lowering of flags ceremony.', done: false }
      ],
      phrases: [
        { original: 'à¨¸à¨¤à¨¿ à¨¶à©à¨°à©€ à¨…à¨•à¨¾à¨²', pronounce: 'Sat Sri Akal', meaning: 'God is Eternal / Hello (Punjabi)', langCode: 'hi-IN' },
        { original: 'à¨§à©°à¨¨à¨µà¨¾à¨¦', pronounce: 'Dhanwaad', meaning: 'Thank you very much', langCode: 'hi-IN' }
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
        estimatedCost: 'â‚¹400 - â‚¹800'
      }
    },
    {
      id: '3',
      title: 'Kedarnath & Badrinath Char Dham',
      location: 'Garhwal Himalayas, Uttarakhand, India',
      image: '/kedarnath.png',
      rating: 4.9,
      category: 'temples',
      tags: ['Himalayan Dham', 'Jyotirlinga', 'Sacred Trek'],
      description: 'One of the highest Shiva Jyotirlingas surrounded by dramatic snow peaks of the Himalayas along the Mandakini river.',
      spots: ['Kedarnath Shiva Temple', 'Bhairavnath Hilltop Temple', 'Vasuki Tal Glacial Lake'],
      itinerary: [
        { day: 1, title: 'Gaurikund to Kedarnath Trek', desc: 'Embark on the breathtaking 16km mountain trail along roaring mountain streams.', done: true },
        { day: 2, title: 'Kedarnath Dawn Aarti', desc: 'Attend morning Shiva Puja against the backdrop of Kedarnath snow peak.', done: false },
        { day: 3, title: 'Bhairavnath Lookout Point', desc: 'Trek 1km uphill for panoramic views of the entire Kedarnath temple valley.', done: false }
      ],
      phrases: [
        { original: 'à¤œà¤¯ à¤­à¥‹à¤²à¥‡à¤¨à¤¾à¤¥', pronounce: 'Jai Bholenath', meaning: 'Hail Lord Shiva (Greeting)', langCode: 'hi-IN' },
        { original: 'à¤¹à¤° à¤¹à¤° à¤®à¤¹à¤¾à¤¦à¥‡à¤µ', pronounce: 'Har Har Mahadev', meaning: 'Glory to Shiva the Supreme', langCode: 'hi-IN' }
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
        estimatedCost: 'â‚¹3,000 - â‚¹7,000'
      }
    },
    {
      id: '4',
      title: 'Madurai Meenakshi Temple',
      location: 'Madurai, Tamil Nadu, India',
      image: '/madurai.png',
      rating: 4.9,
      category: 'temples',
      tags: ['Dravidian Marvel', 'Gopurams', 'Historic'],
      description: 'A 2,500-year-old architectural masterpiece with 14 towering colorful Gopuram gateways covered in thousands of intricate stone sculptures.',
      spots: ['Meenakshi Amman Shrine', 'Hall of 1000 Pillars', 'Golden Lotus Sacred Tank'],
      itinerary: [
        { day: 1, title: 'Gopuram Tower Exploration', desc: 'Marvel at the 170-foot southern Gopuram tower with painted mythical deities.', done: true },
        { day: 2, title: 'Thousand Pillar Museum', desc: 'Walk through 985 carved granite columns and sound-resonant musical pillars.', done: false },
        { day: 3, title: 'Night Bedchamber Ceremony', desc: 'Witness the evening ritual procession of Lord Sundareswarar to Goddess Meenakshi shrine.', done: false }
      ],
      phrases: [
        { original: 'à®µà®£à®•à¯à®•à®®à¯', pronounce: 'Vanakkam', meaning: 'Hello / Greetings (Tamil)', langCode: 'en-IN' },
        { original: 'à®®à¯€à®©à®¾à®Ÿà¯à®šà®¿ à®…à®®à¯à®®à®©à¯ à®•à¯‹à®µà®¿à®²à¯', pronounce: 'Meenakshi Amman Kovil', meaning: 'Meenakshi Goddess Temple', langCode: 'en-IN' },
        { original: 'à®¨à®©à¯à®±à®¿', pronounce: 'Nandri', meaning: 'Thank you', langCode: 'en-IN' }
      ],
      pathOptimizer: {
        optimizedSequence: [
          { spot: 'Meenakshi Amman Shrine', timeOfDay: '06:00 AM (Early Darshan)', tip: 'Morning hours are peaceful and avoid afternoon stone floor heat.' },
          { spot: 'Hall of 1000 Pillars', timeOfDay: '11:00 AM (Museum Walk)', tip: 'Indoor granite art gallery showcasing ancient Chola and Nayak bronze statues.' },
          { spot: 'Golden Lotus Tank', timeOfDay: '05:00 PM (Sunset Walk)', tip: 'Reflections of illuminated colorful Gopurams on the holy tank water.' }
        ],
        recommendedLocalMode: 'Walking Tour + Local Auto-Rickshaw',
        modeExplanation: 'Madurai temple quadrangle is pedestrianized with shoe-counters at all 4 cardinal tower gates.',
        estimatedDuration: 'Full Day (approx 7 hours)',
        estimatedCost: 'â‚¹400 - â‚¹800'
      }
    },
    {
      id: '5',
      title: 'Varanasi Sacred Ghats & Kashi Vishwanath',
      location: 'Varanasi, Uttar Pradesh, India',
      image: '/varanasi.png',
      rating: 4.7,
      category: 'temples',
      tags: ['Heritage', 'Spiritual', 'Culture'],
      description: 'One of the world\'s oldest continuously inhabited cities. Experience spirituality along the banks of the sacred Ganges River with chanting oil lamps.',
      spots: ['Kashi Vishwanath Temple', 'Dashashwamedh Ghat', 'Sarnath Buddhist Stupa'],
      itinerary: [
        { day: 1, title: 'Ganga Aarti Evening', desc: 'Witness the spectacular ritual prayer with fire and incense at Dashashwamedh Ghat.', done: true },
        { day: 2, title: 'Subah-e-Banaras Boat', desc: 'Take a serene sunrise boat ride on the holy Ganges River.', done: false },
        { day: 3, title: 'Buddhist Stupa Visit', desc: 'Drive to Sarnath where Lord Buddha preached his very first sermon.', done: false }
      ],
      phrases: [
        { original: 'à¤•à¤¾à¤¶à¥€ à¤µà¤¿à¤¶à¥à¤µà¤¨à¤¾à¤¥ à¤®à¤‚à¤¦à¤¿à¤° à¤•à¤¿à¤§à¤° à¤¹à¥ˆ?', pronounce: 'Kashi Vishwanath Mandir kidhar hai?', meaning: 'Where is the Kashi Vishwanath temple?', langCode: 'hi-IN', audioFile: '/audio/hi_4.mp3' },
        { original: 'à¤—à¤‚à¤—à¤¾ à¤†à¤°à¤¤à¥€ à¤•à¤¬ à¤¶à¥à¤°à¥‚ à¤¹à¥‹à¤—à¥€?', pronounce: 'Ganga Aarti kab shuru hogi?', meaning: 'When will the Ganga Aarti start?', langCode: 'hi-IN', audioFile: '/audio/hi_5.mp3' }
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
        estimatedCost: 'â‚¹1,000 - â‚¹1,500'
      }
    },
    {
      id: '6',
      title: 'Agra Wonders & Taj Mahal',
      location: 'Agra, Uttar Pradesh, India',
      image: '/tajmahal.png',
      rating: 4.9,
      category: 'heritage',
      tags: ['Heritage', 'Culture', 'Wonders'],
      description: 'Witness the iconic Taj Mahal, a monument of love built by Emperor Shah Jahan. Discover majestic forts, historical ruins, and local bazaar treasures.',
      spots: ['Taj Mahal Mausoleum', 'Agra Fort Walls', 'Mehtab Bagh Gardens'],
      itinerary: [
        { day: 1, title: 'Taj Sunrise View', desc: 'Arrive at 5:30 AM to witness the white marble turn pink under the soft morning sun.', done: true },
        { day: 2, title: 'Agra Fort Exploration', desc: 'Walk inside the massive red sandstone fortress built by Akbar.', done: false },
        { day: 3, title: 'Yamuna River Sunset', desc: 'Watch the reflection of the Taj Mahal from Mehtab Bagh gardens across the river.', done: false }
      ],
      phrases: [
        { original: 'à¤¨à¤®à¤¸à¥à¤¤à¥‡', pronounce: 'Namaste', meaning: 'Hello / Greetings', langCode: 'hi-IN', audioFile: '/audio/hi_1.mp3' },
        { original: 'à¤¯à¤¹ à¤•à¤¿à¤¤à¤¨à¥‡ à¤•à¤¾ à¤¹à¥ˆ?', pronounce: 'Yeh kitne ka hai?', meaning: 'How much does this cost?', langCode: 'hi-IN', audioFile: '/audio/hi_2.mp3' },
        { original: 'à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦', pronounce: 'Dhanyavaad', meaning: 'Thank you', langCode: 'hi-IN', audioFile: '/audio/hi_3.mp3' }
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
        estimatedCost: 'â‚¹600 - â‚¹800'
      }
    },
    {
      id: '7',
      title: 'Munnar Tea Hills',
      location: 'Munnar, Kerala, India',
      image: '/munnar.png',
      rating: 4.8,
      category: 'nature',
      tags: ['Nature', 'Mountains', 'Tea Gardens'],
      description: 'Soak in the mist-covered green hills, cascading waterfalls, and sprawling tea plantations of Munnar, a tranquil paradise in the Western Ghats.',
      spots: ['Kolukkumalai Tea Estate', 'Eravikulam National Park', 'Mattupetty Dam'],
      itinerary: [
        { day: 1, title: 'Tea Garden Stroll', desc: 'Walk through endless corridors of tea shrubs and visit the tea processing museum.', done: true },
        { day: 2, title: 'Nilgiri Tahr Spotting', desc: 'Trek inside Eravikulam to catch a glimpse of the endangered mountain goat.', done: false },
        { day: 3, title: 'Reservoir Speedboat', desc: 'Take a thrilling speedboat ride on the reservoir waters of Mattupetty.', done: false }
      ],
      phrases: [
        { original: 'à´¨à´®à´¸àµà´•à´¾à´°à´‚', pronounce: 'Namaskaram', meaning: 'Hello / Greetings', langCode: 'ml-IN', fallbackDevanagari: 'à¤¨à¤®à¤¸à¥à¤•à¤¾à¤°à¤®', audioFile: '/audio/ml_1.mp3' },
        { original: 'à´µà´´à´¿ à´ªà´±à´¯à´¾à´®àµ‹?', pronounce: 'Vazhi parayamo?', meaning: 'Can you tell me the way?', langCode: 'ml-IN', fallbackDevanagari: 'à´µà¤´à¥€ à¤ªà¤°à¤¯à¤¾à¤®à¥‹', audioFile: '/audio/ml_2.mp3' },
        { original: 'à´¨à´¨àµà´¦à´¿', pronounce: 'Nanni', meaning: 'Thank you', langCode: 'ml-IN', fallbackDevanagari: 'à´¨à¤¨à¥à¤¦à¥€', audioFile: '/audio/ml_3.mp3' }
      ],
      pathOptimizer: {
        optimizedSequence: [
          { spot: 'Kolukkumalai Tea Estate', timeOfDay: '04:30 AM (Dawn Trek)', tip: 'Requires a 4x4 rugged jeep climb in the dark to catch the famous sunrise above the cloud bed.' },
          { spot: 'Mattupetty Dam', timeOfDay: '11:30 AM (Morning Boating)', tip: 'Drive down for speedboating and catch glimpses of wild elephants drinking water near the shores.' },
          { spot: 'Eravikulam National Park', timeOfDay: '02:30 PM (Afternoon Trek)', tip: 'Take the national park forest shuttle up to spot the rare Nilgiri Tahr mountain goats.' }
        ],
        recommendedLocalMode: '4x4 Mountain Jeep + Local Taxi Combo',
        modeExplanation: 'The road to Kolukkumalai is the world\'s highest organic tea estate trail, extremely bumpy and restricted to local 4x4 jeeps. Use a taxi for the rest of Munnar.',
        estimatedDuration: '1.5 Days (approx 14 hours total)',
        estimatedCost: 'â‚¹2,500 - â‚¹3,000'
      }
    },
    {
      id: '8',
      title: 'Vizag Coastal Hills',
      location: 'Visakhapatnam, Andhra Pradesh, India',
      image: '/vizag.png',
      rating: 4.8,
      category: 'nature',
      tags: ['Coastal', 'Nature', 'Heritage'],
      description: 'Explore the spectacular meeting of hills and the Bay of Bengal. Ride the scenic Vistadome railway through Araku, walk RK beach, and explore ancient caves.',
      spots: ['INS Kursura Submarine Museum', 'Araku Valley Tea Gardens', 'Borra Caves'],
      itinerary: [
        { day: 1, title: 'Vistadome Valley Journey', desc: 'Board the early morning Vistadome train traversing through tunnels to Araku valley.', done: true },
        { day: 2, title: 'Borra Caves Expedition', desc: 'Walk inside the deepest natural cave structures in India with stalactite formations.', done: false },
        { day: 3, title: 'Coastline Submarine Visit', desc: 'Stroll on RK beach and tour the historic decommissioned INS Kursura submarine.', done: false }
      ],
      phrases: [
        { original: 'à°¨à°®à°¸à±à°•à°¾à°°à°‚', pronounce: 'Namaskaram', meaning: 'Hello / Greetings (Telugu)', langCode: 'te-IN', fallbackDevanagari: 'à¤¨à¤®à¤¸à¥à¤•à¤¾à¤°à¤®', audioFile: '/audio/te_1.mp3' },
        { original: 'à°…à°°à°•à± à°µà±†à°³à±à°²à±‡ à°°à±ˆà°²à± à°Žà°•à±à°•à°¡ à°†à°—à±à°¤à±à°‚à°¦à°¿?', pronounce: 'Araku velle railu ekkada aaguthundi?', meaning: 'Where does the train to Araku stop?', langCode: 'te-IN', fallbackDevanagari: 'à¤…à¤°à¤•à¥ à¤µà¥‡à¤²à¥à¤²à¥‡ à¤°à¥ˆà¤²à¥ à¤à¤•à¥à¤•à¤¡ à¤†à¤—à¥à¤¤à¥à¤‚à¤¦à¥€', audioFile: '/audio/te_2.mp3' },
        { original: 'à°­à±‹à°œà°¨à°‚ à°šà°¾à°²à°¾ à°¬à°¾à°—à±à°‚à°¦à°¿', pronounce: 'Bhojanam chala baagundi', meaning: 'The food is very delicious', langCode: 'te-IN', fallbackDevanagari: 'à¤­à¥‹à¤œà¤¨à¤® à¤šà¤¾à¤²à¤¾ à¤¬à¤¾à¤—à¥à¤‚à¤¦à¥€', audioFile: '/audio/te_3.mp3' },
        { original: 'à°§à°¨à±à°¯à°µà°¾à°¦à°¾à°²à±', pronounce: 'Dhanyavaadalu', meaning: 'Thank you very much', langCode: 'te-IN', fallbackDevanagari: 'à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦à¤¾à¤²à¥', audioFile: '/audio/te_4.mp3' }
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
        estimatedCost: 'â‚¹3,500 - â‚¹4,200'
      }
    },
    {
      id: '9',
      title: 'Goa Beaches & Heritage',
      location: 'Panaji, Goa, India',
      image: '/goa.png',
      rating: 4.9,
      category: 'nature',
      tags: ['Beaches', 'Nightlife', 'Portuguese Heritage'],
      description: 'Golden sand beaches, historic Portuguese churches, vibrant beach shacks, and exhilarating water sports along the Arabian Sea.',
      spots: ['Baga Beach Shoreline', 'Aguada Portuguese Fort', 'Basilica of Bom Jesus'],
      itinerary: [
        { day: 1, title: 'North Goa Beach Hopping', desc: 'Visit Calangute and Baga beach, enjoy water sports and sunset beach shacks.', done: true },
        { day: 2, title: 'Old Goa Heritage Walk', desc: 'Explore the 16th-century Basilica of Bom Jesus and Se Cathedral.', done: false },
        { day: 3, title: 'Aguada Fort Sunset', desc: 'Watch sunset from the cliffside 17th-century lighthouse fort overlooking Mandovi river.', done: false }
      ],
      phrases: [
        { original: 'à¤¦à¥‡à¤µ à¤¬à¤°à¥‡ à¤•à¤°à¥‚à¤‚', pronounce: 'Dev bare karum', meaning: 'Thank you / God bless (Konkani)', langCode: 'hi-IN' },
        { original: 'à¤•à¤¸à¤²à¥‡ à¤–à¤¬à¤°?', pronounce: 'Kasale khabar?', meaning: 'How are you?', langCode: 'hi-IN' }
      ],
      pathOptimizer: {
        optimizedSequence: [
          { spot: 'Aguada Portuguese Fort', timeOfDay: '09:00 AM (Morning)', tip: 'Visit early morning before heat peaks to take cliffside lighthouse photos.' },
          { spot: 'Basilica of Bom Jesus', timeOfDay: '01:00 PM (Midday)', tip: 'Air-conditioned ancient church interior holding saint relics.' },
          { spot: 'Baga Beach Shoreline', timeOfDay: '05:30 PM (Sunset)', tip: 'Relax at sunset beach shacks with fresh seafood and live acoustic music.' }
        ],
        recommendedLocalMode: 'Self-Drive Scooter Rental',
        modeExplanation: 'Renting a scooter for â‚¹400/day is the quintessential Goa experience for weaving through coastal palm roads.',
        estimatedDuration: 'Full Day (approx 8 hours)',
        estimatedCost: 'â‚¹800 - â‚¹1,200'
      }
    },
    {
      id: '10',
      title: 'Jaipur Pink City Palaces',
      location: 'Jaipur, Rajasthan, India',
      image: '/jaipur.png',
      rating: 4.8,
      category: 'heritage',
      tags: ['Palaces', 'Heritage', 'Forts'],
      description: 'The capital of Rajasthan renowned for pink sandstone architecture, grand hilltop forts, royal palaces, and bustling handicraft bazaars.',
      spots: ['Amber Palace Fort', 'Hawa Mahal Palace of Winds', 'City Palace Museum'],
      itinerary: [
        { day: 1, title: 'Amber Fort Elephant Trail', desc: 'Ascend the majestic hill fort of Amer and explore the Mirror Palace (Sheesh Mahal).', done: true },
        { day: 2, title: 'Hawa Mahal & Johari Bazaar', desc: 'Photograph the honeycomb 953-window facade and shop Jaipur textiles.', done: false },
        { day: 3, title: 'Nahargarh Fort Sunset View', desc: 'Panoramic sunset view over the entire pink city from Nahargarh fort cafe.', done: false }
      ],
      phrases: [
        { original: 'à¤–à¤®à¥à¤®à¤¾ à¤˜à¤£à¥€', pronounce: 'Khamma Ghani', meaning: 'Royal Greetings / Hello (Rajasthani)', langCode: 'hi-IN' },
        { original: 'à¤†à¤­à¤¾à¤°', pronounce: 'Aabhar', meaning: 'Thank you very much', langCode: 'hi-IN' }
      ],
      pathOptimizer: {
        optimizedSequence: [
          { spot: 'Amber Palace Fort', timeOfDay: '08:00 AM (Morning)', tip: 'Avoid midday heat and long queue lines by starting at hilltop Amber fort.' },
          { spot: 'Hawa Mahal Palace of Winds', timeOfDay: '01:00 PM (Afternoon)', tip: 'Front view photo spot from Wind View Cafe across the street.' },
          { spot: 'Nahargarh Fort', timeOfDay: '05:30 PM (Sunset)', tip: 'Best sunset panorama of pink city rooftops.' }
        ],
        recommendedLocalMode: 'Auto-Rickshaw Day Booking',
        modeExplanation: 'Hiring a local auto-rickshaw for â‚¹700/day easily navigates tight bazaar alleys.',
        estimatedDuration: 'Full Day (approx 9 hours)',
        estimatedCost: 'â‚¹1,000 - â‚¹1,500'
      }
    },
    {
      id: '11',
      title: 'Leh Ladakh High Passes',
      location: 'Leh, Ladakh, India',
      image: '/ladakh.png',
      rating: 4.9,
      category: 'nature',
      tags: ['Himalayas', 'Adventure', 'High Passes'],
      description: 'High-altitude cold desert surrounded by snow-capped Himalayan peaks, crystal blue mountain lakes, and ancient Buddhist monasteries.',
      spots: ['Pangong Tso Blue Lake', 'Khardung La Pass (17,982 ft)', 'Thiksey Buddhist Monastery'],
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
        estimatedCost: 'â‚¹8,000 - â‚¹12,000'
      }
    },
    {
      id: '12',
      title: 'Rishikesh Yoga & Ganga Ghats',
      location: 'Rishikesh, Uttarakhand, India',
      image: '/rishikesh.png',
      rating: 4.8,
      category: 'temples',
      tags: ['Yoga', 'Rafting', 'Spiritual', 'Ganges'],
      description: 'The World Capital of Yoga nestled at the Himalayan foothills where the emerald Ganges river emerges. Famous for whitewater rafting and evening Aarti.',
      spots: ['Laxman Jhula Suspension Bridge', 'Shivpuri Rafting Rapids', 'Triveni Ghat Evening Aarti'],
      itinerary: [
        { day: 1, title: 'Ganges Whitewater Rafting', desc: 'Conquer grade 3 & 4 rapids down Shivpuri to Rishikesh shore.', done: true },
        { day: 2, title: 'Beatles Ashram Meditation', desc: 'Explore Maharishi Mahesh Yogi ashram graffiti ruins.', done: false },
        { day: 3, title: 'Triveni Ghat Ganga Aarti', desc: 'Witness floating oil diyas during evening prayer.', done: false }
      ],
      phrases: [
        { original: 'à¤¹à¤° à¤¹à¤° à¤—à¤‚à¤—à¥‡', pronounce: 'Har Har Gange', meaning: 'Hail Holy Ganges (Greeting)', langCode: 'hi-IN', audioFile: '/audio/hi_4.mp3' }
      ],
      pathOptimizer: {
        optimizedSequence: [
          { spot: 'Shivpuri Rafting Rapids', timeOfDay: '08:30 AM (Morning Raft)', tip: 'Cool morning waters and minimal river boat traffic.' },
          { spot: 'Beatles Ashram', timeOfDay: '02:00 PM (Afternoon Walk)', tip: 'Shaded jungle ashram ruins perfect for quiet meditation.' },
          { spot: 'Triveni Ghat Aarti', timeOfDay: '06:00 PM (Sunset Ritual)', tip: 'Arrive 30 mins early to secure a seat near priest platforms.' }
        ],
        recommendedLocalMode: 'Shared Local Auto + Walking',
        modeExplanation: 'Suspension bridges are pedestrian-only. Walking along the river ghauts is fast and serene.',
        estimatedDuration: 'Full Day (approx 8 hours)',
        estimatedCost: 'â‚¹1,200 - â‚¹1,800'
      }
    }
  ]);

  protected readonly searchQuery = signal('');
  protected readonly selectedCategory = signal('all');
  protected readonly expandedDestinationId = signal<string | null>(null);

  protected readonly activeRouteDestId = signal<string | null>(null);
  protected readonly selectedStartCity = signal<string | null>(null);

  protected readonly savedDestinationIds = signal<Set<string>>(new Set(['1', '6']));

  protected readonly lightboxImage = signal<{ url: string; title: string; location: string } | null>(null);

  protected readonly playbackSpeed = signal<number>(1.0);

  protected readonly selectedCurrency = signal<'INR' | 'USD' | 'EUR' | 'GBP'>('INR');

  protected setSpeed(speed: number): void {
    this.playbackSpeed.set(speed);
  }

  protected setCurrency(curr: 'INR' | 'USD' | 'EUR' | 'GBP'): void {
    this.selectedCurrency.set(curr);
  }

  protected setCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  protected toggleExpand(id: string): void {
    if (this.expandedDestinationId() === id) {
      this.expandedDestinationId.set(null);
      this.resetRoutePlanner();
      this.activeOptimizerDestId.set(null);
    } else {
      this.expandedDestinationId.set(id);
    }
  }

  protected toggleItineraryItem(destId: string, day: number): void {
    this.destinations.update(dests => 
      dests.map(dest => {
        if (dest.id === destId) {
          return {
            ...dest,
            itinerary: dest.itinerary.map(item => 
              item.day === day ? { ...item, done: !item.done } : item
            )
          };
        }
        return dest;
      })
    );
  }

  private activeAudio: HTMLAudioElement | null = null;

  protected playPhraseAudio(destId: string, phrase: Phrase): void {
    const phraseId = destId + '_' + phrase.original;
    this.activePhraseId.set(phraseId);
    
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio = null;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (phrase.audioFile) {
      const audio = new Audio(phrase.audioFile);
      audio.playbackRate = this.playbackSpeed();
      this.activeAudio = audio;
      
      audio.onended = () => {
        if (this.activePhraseId() === phraseId) this.activePhraseId.set(null);
        if (this.activeAudio === audio) this.activeAudio = null;
      };

      audio.onerror = () => {
        if (this.activePhraseId() === phraseId) this.activePhraseId.set(null);
        if (this.activeAudio === audio) this.activeAudio = null;
      };

      audio.play().catch(() => {
        if (this.activePhraseId() === phraseId) this.activePhraseId.set(null);
        if (this.activeAudio === audio) this.activeAudio = null;
      });
    } else if ('speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      const targetLang = phrase.langCode || 'hi-IN';

      const exactVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-') === targetLang.toLowerCase().replace('_', '-'));
      const prefixVoice = exactVoice || voices.find(v => v.lang.toLowerCase().startsWith(targetLang.split('-')[0].toLowerCase()));

      let textToSpeak = phrase.original;
      let utteranceLang = targetLang;
      let selectedVoice = prefixVoice;

      if (!selectedVoice) {
        const hiVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-') === 'hi-in') ||
                        voices.find(v => v.lang.toLowerCase().startsWith('hi'));
        
        if (phrase.fallbackDevanagari && hiVoice) {
          textToSpeak = phrase.fallbackDevanagari;
          utteranceLang = 'hi-IN';
          selectedVoice = hiVoice;
        } else {
          textToSpeak = phrase.pronounce;
          utteranceLang = 'en-IN';
          selectedVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-') === 'en-in') ||
                          voices.find(v => v.lang.toLowerCase().startsWith('en'));
        }
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = utteranceLang;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.rate = 0.88 * this.playbackSpeed();

      utterance.onend = () => {
        if (this.activePhraseId() === phraseId) this.activePhraseId.set(null);
      };

      utterance.onerror = () => {
        if (this.activePhraseId() === phraseId) this.activePhraseId.set(null);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        if (this.activePhraseId() === phraseId) this.activePhraseId.set(null);
      }, 2500);
    }
  }

  protected toggleFavorite(destId: string, event?: Event): void {
    if (event) event.stopPropagation();
    this.savedDestinationIds.update(set => {
      const updated = new Set(set);
      if (updated.has(destId)) {
        updated.delete(destId);
      } else {
        updated.add(destId);
      }
      return updated;
    });
  }

  protected isFavorite(destId: string): boolean {
    return this.savedDestinationIds().has(destId);
  }

  protected openLightbox(url: string, title: string, location: string, event?: Event): void {
    if (event) event.stopPropagation();
    this.lightboxImage.set({ url, title, location });
  }

  protected closeLightbox(): void {
    this.lightboxImage.set(null);
  }

  protected toggleOptimizer(destId: string): void {
    this.activeOptimizerDestId.update(current => current === destId ? null : destId);
  }

  protected openRoutePlanner(destId: string): void {
    this.activeRouteDestId.set(destId);
  }

  protected resetRoutePlanner(): void {
    this.activeRouteDestId.set(null);
    this.selectedStartCity.set(null);
  }

  protected selectQuickCity(city: string): void {
    this.selectedStartCity.set(city);
  }

  protected submitCustomCity(cityInput: string): void {
    if (!cityInput || !cityInput.trim()) return;
    this.selectedStartCity.set(cityInput.trim());
  }

  protected readonly filteredDestinations = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const cat = this.selectedCategory();
    const saved = this.savedDestinationIds();
    
    return this.destinations().filter(dest => {
      const matchesSearch = dest.title.toLowerCase().includes(query) || 
                            dest.location.toLowerCase().includes(query) ||
                            dest.tags.some(t => t.toLowerCase().includes(query));
      
      let matchesCategory = true;
      if (cat === 'saved') {
        matchesCategory = saved.has(dest.id);
      } else if (cat !== 'all') {
        matchesCategory = dest.category === cat;
      }
      
      return matchesSearch && matchesCategory;
    });
  });

  protected addCustomDestination(query: string): void {
    if (!query || !query.trim()) return;
    const name = query.trim();
    const formattedTitle = name.charAt(0).toUpperCase() + name.slice(1);
    const newId = (Date.now()).toString();

    const newDest: Destination = {
      id: newId,
      title: `${formattedTitle} Travel Highlights`,
      location: `${formattedTitle}, India`,
      image: '/lofi-travel.png',
      rating: 4.9,
      category: 'nature',
      tags: ['Top Destination', 'Culture', 'Scenic'],
      description: `Explore the incredible monuments, natural landscapes, and rich cultural traditions of ${formattedTitle}, India.`,
      spots: [`${formattedTitle} Heritage Center`, `${formattedTitle} Local Bazaar`, `${formattedTitle} Sunset Hill`],
      itinerary: [
        { day: 1, title: `${formattedTitle} Welcome Trail`, desc: `Arrive early and tour the iconic landmarks of ${formattedTitle}.`, done: true },
        { day: 2, title: `Culture & Food Safari`, desc: `Taste authentic local delicacies and visit vibrant artisan bazaars.`, done: false },
        { day: 3, title: `Scenic Sunrise / Sunset View`, desc: `Experience unforgettable panoramic views of ${formattedTitle}.`, done: false }
      ],
      phrases: [
        { original: 'à¤¨à¤®à¤¸à¥à¤¤à¥‡', pronounce: 'Namaste', meaning: 'Hello / Greetings', langCode: 'hi-IN' },
        { original: 'à¤¯à¤¹ à¤•à¤¿à¤¤à¤¨à¥‡ à¤•à¤¾ à¤¹à¥ˆ?', pronounce: 'Yeh kitne ka hai?', meaning: 'How much does this cost?', langCode: 'hi-IN' },
        { original: 'à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦', pronounce: 'Dhanyavaad', meaning: 'Thank you', langCode: 'hi-IN' }
      ],
      pathOptimizer: {
        optimizedSequence: [
          { spot: `${formattedTitle} Heritage Center`, timeOfDay: '08:00 AM (Morning)', tip: 'Start early morning before heat and crowd peak.' },
          { spot: `${formattedTitle} Local Bazaar`, timeOfDay: '01:30 PM (Midday)', tip: 'Enjoy authentic regional lunch and handcrafted souvenirs.' },
          { spot: `${formattedTitle} Sunset Hill`, timeOfDay: '05:30 PM (Sunset)', tip: 'Catch spectacular sunset photos over the horizon.' }
        ],
        recommendedLocalMode: 'Local Taxi & Auto-Rickshaw Day Tour',
        modeExplanation: `Hiring a local driver in ${formattedTitle} ensures smooth transit between distant sightseeing spots.`,
        estimatedDuration: 'Full Day (approx 8.5 hours)',
        estimatedCost: 'â‚¹1,200 - â‚¹2,000'
      }
    };

    this.destinations.update(dests => [newDest, ...dests]);
    this.expandedDestinationId.set(newId);
    this.searchQuery.set('');
  }

  private readonly transportDb: Record<string, Record<string, TransportOption[]>> = {
    '1': {
      'delhi': [
        { mode: 'train', name: 'Gatimaan Express (12050)', duration: '1h 40m', cost: 12.00, best: true, tip: 'Runs daily except Fridays. High-speed executive day train with breakfast served onboard.' },
        { mode: 'car', name: 'Yamuna Expressway Road Trip', duration: '3h 30m', cost: 45.00, best: false, tip: 'Excellent 6-lane highway. Great for private car rentals or cabs.' }
      ],
      'mumbai': [
        { mode: 'flight', name: 'Flight to Delhi + Cab to Agra', duration: '5h 30m', cost: 85.00, best: true, tip: 'Fastest way. Take a 2-hour flight to Delhi (DEL), then hire a prepaid highway cab.' },
        { mode: 'train', name: 'LTT Haridwar AC Superfast', duration: '18h 15m', cost: 28.00, best: false, tip: 'Comfortable overnight sleeper option direct to Agra Cantt (AGC) station.' }
      ],
      'bengaluru': [
        { mode: 'flight', name: 'Flight to Delhi + Gatimaan Train', duration: '5h 45m', cost: 95.00, best: true, tip: 'Fly to Delhi (DEL) early morning, then board the express train from Hazrat Nizamuddin.' },
        { mode: 'train', name: 'Karnataka Express (12627)', duration: '31h 50m', cost: 35.00, best: false, tip: 'Direct train journey traversing across central India. Book AC 2 Tier class.' }
      ],
      'kochi': [
        { mode: 'flight', name: 'Flight to Delhi + Taj Express', duration: '6h 15m', cost: 110.00, best: true, tip: 'Fly to Delhi, then take a connecting train or cab directly to Agra hotel.' }
      ]
    },
    '2': {
      'delhi': [
        { mode: 'flight', name: 'Flight to Kochi + Highway Cab', duration: '6h 45m', cost: 115.00, best: true, tip: 'Fly to Kochi International Airport (COK), then take a 3.5-hour taxi up the scenic ghat roads.' }
      ],
      'mumbai': [
        { mode: 'flight', name: 'Flight to Kochi + Scenic Taxi', duration: '5h 30m', cost: 80.00, best: true, tip: 'Fly from Mumbai to Kochi (2h), then hire a cab. Highlights include Cheeyappara waterfalls.' },
        { mode: 'train', name: 'Netravati Express to Aluva + Bus', duration: '26h 00m', cost: 32.00, best: false, tip: 'Get off at Aluva station (closer to Munnar than Ernakulam), and board a local bus.' }
      ],
      'bengaluru': [
        { mode: 'bus', name: 'KSRTC Ambaari Dream Class Sleeper', duration: '9h 15m', cost: 20.00, best: true, tip: 'Overnight luxury sleeper bus direct to Munnar town. Highly convenient and comfortable.' },
        { mode: 'car', name: 'Road Trip via Salem & Udumalpet', duration: '8h 30m', cost: 65.00, best: false, tip: 'Highly scenic drive through tea estates and forests. Start early morning.' }
      ],
      'kochi': [
        { mode: 'cab', name: 'Private Tourist Taxi', duration: '3h 30m', cost: 35.00, best: true, tip: 'Direct pick-up from city or airport. Allows custom photography stops along the hills.' },
        { mode: 'bus', name: 'KSRTC Local Super Fast Bus', duration: '4h 15m', cost: 4.50, best: false, tip: 'Frequent services from Ernakulam KSRTC stand. Extremely pocket-friendly.' }
      ]
    },
    '3': {
      'delhi': [
        { mode: 'train', name: 'New Delhi Varanasi Vande Bharat', duration: '8h 00m', cost: 22.00, best: true, tip: 'Semi-high-speed modern chair car. Extremely clean, punctual, and includes catering.' },
        { mode: 'flight', name: 'Direct Flight to Babatpur VNS', duration: '1h 30m', cost: 55.00, best: false, tip: 'Quickest flight journey, though airport is 22km away from the main ghats area.' }
      ],
      'mumbai': [
        { mode: 'flight', name: 'Direct Flight to Varanasi', duration: '2h 05m', cost: 65.00, best: true, tip: 'Highly recommended. Direct flights connect daily. Book cabs from airport online.' },
        { mode: 'train', name: 'Kamayani Express (11071)', duration: '26h 30m', cost: 24.00, best: false, tip: 'Regular sleeper train from LTT station direct to Varanasi Junction.' }
      ],
      'bengaluru': [
        { mode: 'flight', name: 'Direct Flight (IndiGo)', duration: '2h 35m', cost: 75.00, best: true, tip: 'Saves more than 30 hours compared to rail travel. Daily direct connectivity.' },
        { mode: 'train', name: 'Sanghamitra Express', duration: '34h 45m', cost: 32.00, best: false, tip: 'Long distance express train. Recommended only for budget rail enthusiasts.' }
      ],
      'kochi': [
        { mode: 'flight', name: 'Connecting Flight via Bengaluru', duration: '5h 15m', cost: 95.00, best: true, tip: 'Fly with a single short layover in BLR or DEL for the fastest transition.' }
      ]
    },
    '4': {
      'delhi': [
        { mode: 'flight', name: 'Direct Flight to Vizag (VTZ)', duration: '2h 20m', cost: 70.00, best: true, tip: 'Daily direct flights connect Delhi and Visakhapatnam airport (VTZ).' },
        { mode: 'train', name: 'Swarna Jayanti Express', duration: '29h 30m', cost: 28.00, best: false, tip: 'Long-distance rail connecting northern plains to the eastern coast.' }
      ],
      'mumbai': [
        { mode: 'flight', name: 'Direct Flight (Air India)', duration: '2h 00m', cost: 65.00, best: true, tip: 'Quick direct flight connection daily. Book airport prepaid taxis.' },
        { mode: 'train', name: 'LTT VSKP Express', duration: '26h 45m', cost: 24.00, best: false, tip: 'Overnight train running via Pune and Secunderabad.' }
      ],
      'bengaluru': [
        { mode: 'flight', name: 'Direct Flight to Vizag', duration: '1h 15m', cost: 50.00, best: true, tip: 'Fastest way. Fly Indigo or Air India Express direct.' },
        { mode: 'train', name: 'Prashanthi Express (18464)', duration: '16h 20m', cost: 18.00, best: false, tip: 'Very popular overnight train running daily via Guntakal.' }
      ],
      'kochi': [
        { mode: 'flight', name: 'Connecting Flight via Bengaluru', duration: '4h 45m', cost: 85.00, best: true, tip: 'Single stop flight is the most recommended way.' }
      ]
    }
  };

  protected readonly transitGuidance = computed(() => {
    const destId = this.activeRouteDestId();
    const rawCity = this.selectedStartCity();
    
    if (!destId || !rawCity) return null;
    
    const cityKey = rawCity.toLowerCase().trim();
    const destRoutes = this.transportDb[destId];
    
    if (destRoutes && destRoutes[cityKey]) {
      return destRoutes[cityKey];
    }
    
    const activeDest = this.destinations().find(d => d.id === destId);
    const destName = activeDest ? activeDest.title : 'Destination';
    
    return [
      {
        mode: 'flight' as const,
        name: `Flight to nearest Airport`,
        duration: '3h - 5h',
        cost: 90.00,
        best: true,
        tip: `Take a domestic flight to the nearest airport, then hire an authorized airport prepaid cab to reach ${destName}.`
      },
      {
        mode: 'train' as const,
        name: 'Indian Railways Express (AC Sleeper)',
        duration: '12h - 24h',
        cost: 20.00,
        best: false,
        tip: 'Check direct or connecting trains on IRCTC to the nearest major rail terminal.'
      }
    ];
  });
}

