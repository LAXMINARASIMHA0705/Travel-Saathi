import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import {
  Destination,
  Phrase,
  TransportOption,
  INITIAL_DESTINATIONS,
  TRANSPORT_DATABASE
} from '../../data/destinations.data';

export interface ChecklistItem {
  id: string;
  text: string;
  category: 'Spiritual' | 'Essential' | 'Health' | 'Tech';
  checked: boolean;
}

interface PlacePreset {
  title: string;
  location: string;
  image?: string;
  category: string;
  tags: string[];
  description: string;
  spots: string[];
  localAttractions: { name: string; desc: string; type: string }[];
  mustTryDishes: { name: string; desc: string; veg: boolean; famousAt?: string; imageEmoji?: string }[];
  weather: { temp: string; condition: string; bestSeason: string };
  phrases?: Phrase[];
}

const INDIA_PLACE_PRESETS: Record<string, PlacePreset> = {
  ooty: {
    title: 'Ooty Nilgiri Tea Hills & Toy Train',
    location: 'Ooty, Tamil Nadu, India',
    image: 'munnar.png',
    category: 'nature',
    tags: ['Nilgiris', 'Hill Station', 'Toy Train', 'Tea Gardens'],
    description: 'Queen of Hill Stations in the Nilgiri Hills, famous for UNESCO Heritage mountain railways, sprawling tea gardens, and crisp mountain pine air.',
    spots: ['Nilgiri Mountain Railway', 'Ooty Lake Boating', 'Doddabetta Peak Viewpoint', 'Government Botanical Gardens'],
    localAttractions: [
      { name: 'Nilgiri Toy Train', desc: 'UNESCO World Heritage steam train winding through mountain tunnels & tea valleys.', type: 'Heritage' },
      { name: 'Ooty Lake & Boating', desc: 'Serene artificial mountain lake offering paddle boating & shoreline rides.', type: 'Lake' },
      { name: 'Doddabetta Peak (2,637m)', desc: 'Highest mountain peak in the Nilgiri range with panoramic views of Tamil Nadu & Kerala.', type: 'Viewpoint' },
      { name: 'Government Botanical Gardens', desc: '55-acre terraced garden featuring fossilized trees and vibrant flower beds.', type: 'Nature' }
    ],
    mustTryDishes: [
      { name: 'Ooty Artisan Handmade Chocolates', desc: 'Fresh homemade dark, milk, and nut chocolates crafted by hill bakeries.', veg: true, famousAt: 'King Star Chocolates', imageEmoji: '🍫' },
      { name: 'Nilgiri Crispy Varkey', desc: 'Flaky baked crusty biscuit snack enjoyed hot with South Indian tea.', veg: true, famousAt: 'West Star Bakery', imageEmoji: '🥐' },
      { name: 'South Indian Mountain Thali', desc: 'Hot rice served with sambar, rasam, kootu, and fresh hill farm vegetables.', veg: true, famousAt: 'Nahars Sidewalk Cafe', imageEmoji: '🍱' }
    ],
    weather: { temp: '16°C', condition: 'Cool & Misty', bestSeason: 'Oct – May' }
  },
  coorg: {
    title: 'Coorg Coffee Forests & Waterfalls',
    location: 'Kodagu (Coorg), Karnataka, India',
    image: 'munnar.png',
    category: 'nature',
    tags: ['Coffee Capital', 'Waterfalls', 'Western Ghats'],
    description: 'Scotland of India nestled in lush Western Ghats coffee plantations, roaring cascades, and Kodava warrior cultural traditions.',
    spots: ['Abbey Waterfalls', 'Raja’s Seat Sunset Viewpoint', 'Dubare Elephant Camp', 'Namdroling Golden Temple Bylakuppe'],
    localAttractions: [
      { name: 'Abbey Waterfalls', desc: 'Cascading waterfall surrounded by private spice and coffee plantations.', type: 'Waterfalls' },
      { name: 'Namdroling Monastery (Golden Temple)', desc: 'Largest Tibetan Buddhist settlement in South India featuring 40-foot golden statues.', type: 'Monastery' },
      { name: 'Dubare Elephant Camp', desc: 'Riverside camp on the Cauvery river where visitors interact with elephants.', type: 'Nature' },
      { name: 'Raja’s Seat Garden', desc: 'Scenic hilltop garden overlooking mist-covered green valleys once favored by Kodava kings.', type: 'Viewpoint' }
    ],
    mustTryDishes: [
      { name: 'Coorg Pandi Curry / Mushroom Curry', desc: 'Authentic spicy dark curry simmered with wild Kodava Kachampuli black vinegar.', veg: false, famousAt: 'Coorg Cuisine Madikeri', imageEmoji: '🥘' },
      { name: 'Coorg Akki Oti (Rice Roti)', desc: 'Soft unleavened flatbread made from cooked rice and rice flour served with coconut chutney.', veg: true, famousAt: 'Raintree Restaurant', imageEmoji: '🫓' },
      { name: 'Freshly Brewed Coorg Filter Coffee', desc: 'Aromatic coffee brewed from handpicked Arabica & Robusta beans.', veg: true, famousAt: 'Coffee Estate Cafes', imageEmoji: '☕' }
    ],
    weather: { temp: '20°C', condition: 'Refreshingly Breezy', bestSeason: 'Sep – Jun' }
  },
  shimla: {
    title: 'Shimla Colonial Hills & Ridge',
    location: 'Shimla, Himachal Pradesh, India',
    image: 'kedarnath.png',
    category: 'nature',
    tags: ['Himalayan Capital', 'Colonial', 'Snow Valleys'],
    description: 'Summer capital of British India surrounded by deodar forests, Victorian neo-gothic architecture, and majestic Himalayan views.',
    spots: ['The Ridge & Mall Road', 'Jakhoo Hanuman Temple', 'Kufri Snow Adventure Park', 'Christ Church'],
    localAttractions: [
      { name: 'The Ridge & Mall Road', desc: 'Pedestrian-only promenade flanked by Victorian shops and snow peak panoramas.', type: 'Heritage' },
      { name: 'Jakhoo Hill & Hanuman Statue', desc: 'Highest point in Shimla featuring a giant 108-foot red Hanuman statue.', type: 'Temple' },
      { name: 'Kufri Snow Slopes', desc: 'High-altitude snow park offering yak rides, skiing, and panoramic valley walks.', type: 'Nature' }
    ],
    mustTryDishes: [
      { name: 'Himachali Siddu', desc: 'Traditional steamed wheat bread stuffed with spiced poppy seeds or dal paste served with ghee.', veg: true, famousAt: 'Himachali Rasoi Mall Road', imageEmoji: '🥟' },
      { name: 'Himachali Dham Thali', desc: 'Traditional festive meal of Rajma, Sepu Badi, Kadi, and Meetha Chawal cooked in brass pots.', veg: true, famousAt: 'Local Heritage Messes', imageEmoji: '🍱' },
      { name: 'Pahadi Chha Gosht / Chole', desc: 'Tender mutton cooked slow in buttermilk and roasted mountain spices.', veg: false, famousAt: 'The Grand Hotel Dining', imageEmoji: '🍲' }
    ],
    weather: { temp: '14°C', condition: 'Crisp Alpine Breeze', bestSeason: 'Oct – Jun' }
  },
  manali: {
    title: 'Manali Snow Valley & Solang Pass',
    location: 'Manali, Himachal Pradesh, India',
    image: 'kedarnath.png',
    category: 'nature',
    tags: ['Himalayas', 'Paragliding', 'Snow Peak'],
    description: 'Gateway to high-altitude Himalayan adventures, roaring Beas river rapids, snow sports in Solang Valley, and ancient cedar forests.',
    spots: ['Solang Valley Snow Sports', 'Hadimba Devi Cedar Temple', 'Rohtang High Pass (13,058 ft)', 'Old Manali Cafes'],
    localAttractions: [
      { name: 'Solang Valley', desc: 'Adventure haven for paragliding, zorbing, skiing, and cable car ropeways.', type: 'Adventure' },
      { name: 'Hadimba Devi Temple', desc: 'Ancient 1553 wooden pagoda temple built inside sacred Dhungri van cedar forest.', type: 'Heritage' },
      { name: 'Rohtang Pass (13,058 ft)', desc: 'Snow-capped high mountain pass gateway to Lahaul & Spiti valleys.', type: 'High Pass' }
    ],
    mustTryDishes: [
      { name: 'Trout Fish Fry', desc: 'Fresh Beas river trout pan-fried in butter with garlic & lemon herbs.', veg: false, famousAt: 'Trout House Old Manali', imageEmoji: '🐟' },
      { name: 'Hot Steamed Momos & Thukpa', desc: 'Warm Tibetan noodle soup and spicy dumplings enjoyed in mountain chill.', veg: true, famousAt: 'Chopsticks Restaurant', imageEmoji: '🥟' }
    ],
    weather: { temp: '12°C', condition: 'Chilly Mountain Air', bestSeason: 'Oct – Jun' }
  },
  udaipur: {
    title: 'Udaipur City of Lakes & Palaces',
    location: 'Udaipur, Rajasthan, India',
    image: 'jaipur.png',
    category: 'heritage',
    tags: ['City of Lakes', 'Royal Palaces', 'Romantic'],
    description: 'Venice of the East renowned for majestic marble palaces floating in the serene waters of Lake Pichola and royal Mewar heritage.',
    spots: ['City Palace Complex', 'Lake Pichola Boat Ride', 'Jagmandir Island Palace', 'Saheliyon ki Bari'],
    localAttractions: [
      { name: 'Udaipur City Palace', desc: 'Massive royal palace complex blending Rajasthani and Mughal granite architecture.', type: 'Palace' },
      { name: 'Lake Pichola Sunset Boat Cruise', desc: 'Romantic boat ride witnessing Lake Palace & Jagmandir golden reflections.', type: 'Lake' },
      { name: 'Monsoon Palace (Sajjangarh)', desc: 'Hilltop fort palace offering 360-degree views of Udaipur lake city.', type: 'Viewpoint' }
    ],
    mustTryDishes: [
      { name: 'Udaipur Mirchi Bada & Kachori', desc: 'Spicy large green chili fritter stuffed with potato masala served with tamarind chutney.', veg: true, famousAt: 'Manak Lala Sweet', imageEmoji: '🌶️' },
      { name: 'Mewari Royal Thali', desc: 'Rich thali featuring Ker Sangri, Gatte ki Sabzi, Dal Baati & Churma dipped in ghee.', veg: true, famousAt: 'Natraj Dining Hall', imageEmoji: '🍱' }
    ],
    weather: { temp: '25°C', condition: 'Sunny & Pleasant', bestSeason: 'Oct – Mar' }
  },
  pondicherry: {
    title: 'Pondicherry French Quarter & Beaches',
    location: 'Puducherry, India',
    image: 'goa.png',
    category: 'nature',
    tags: ['French Colony', 'Promenade Beach', 'Auroville'],
    description: 'French Riviera of the East with mustard-yellow colonial villas, tranquil Auroville experimental township, and Mediterranean coastal cafes.',
    spots: ['White Town French Colony Walk', 'Promenade Seaside Beach', 'Auroville Matrimandir Dome', 'Paradise Beach Island'],
    localAttractions: [
      { name: 'White Town French Quarter', desc: 'Cobblestone streets lined with French colonial mansions & vibrant bougainvillea flowers.', type: 'Heritage' },
      { name: 'Auroville Matrimandir', desc: 'Universal spiritual township featuring the iconic golden globe meditation sanctuary.', type: 'Spiritual' },
      { name: 'Paradise Beach', desc: 'Pristine golden beach accessible via scenic backwater boat ride.', type: 'Beach' }
    ],
    mustTryDishes: [
      { name: 'French Croissants & Crepes', desc: 'Butter flaky croissants, sweet nutella crepes & quiches baked fresh daily.', veg: true, famousAt: 'Baker Street', imageEmoji: '🥐' },
      { name: 'Pondicherry Seafood Ratatouille', desc: 'French-Tamil fusion grilled fish paired with Provencal herbs & wine reduction.', veg: false, famousAt: 'Carte Blanche', imageEmoji: '🦐' }
    ],
    weather: { temp: '28°C', condition: 'Sunny Coastal', bestSeason: 'Oct – Mar' }
  },
  hampi: {
    title: 'Hampi Vijayanagara UNESCO Ruins',
    location: 'Hampi, Karnataka, India',
    image: 'madurai.png',
    category: 'heritage',
    tags: ['UNESCO World Heritage', 'Stone Chariot', 'Ruins'],
    description: 'Surreal landscape of giant granite boulders shielding the ancient 14th-century ruins of the Vijayanagara Empire along the Tungabhadra River.',
    spots: ['Virupaksha Temple', 'Vittala Temple Stone Chariot', 'Lotus Mahal & Elephant Stables', 'Hemakuta Hill Sunset'],
    localAttractions: [
      { name: 'Vittala Temple Stone Chariot', desc: 'World-famous monolithic granite chariot sculpture and musical pillars.', type: 'Heritage' },
      { name: 'Virupaksha Temple', desc: 'Active 7th-century Dravidian temple complex dedicated to Lord Shiva.', type: 'Temple' },
      { name: 'Hemakuta Hill Sunset', desc: 'Boulders strewn hilltop dotted with ancient shrines offering breathtaking sunsets.', type: 'Viewpoint' }
    ],
    mustTryDishes: [
      { name: 'Hampi Banana Flower Curry Thali', desc: 'Traditional South Indian sattvic meal served on fresh banana leaves.', veg: true, famousAt: 'Mango Tree Restaurant', imageEmoji: '🍃' },
      { name: 'Chilled Tender Coconut Water', desc: 'Refreshing fresh green coconut water sourced from riverside palms.', veg: true, famousAt: 'River Bank Stalls', imageEmoji: '🥥' }
    ],
    weather: { temp: '29°C', condition: 'Sunny & Clear', bestSeason: 'Oct – Mar' }
  },
  darjeeling: {
    title: 'Darjeeling Kanchenjunga & Tea Estates',
    location: 'Darjeeling, West Bengal, India',
    image: '/munnar.png',
    category: 'nature',
    tags: ['Himalayan Panorama', 'Toy Train', 'Tea Estates'],
    description: 'Queen of the Hills facing the magnificent snow peak of Mt. Kanchenjunga (8,586m), home of world-renowned Darjeeling Champagne Tea.',
    spots: ['Tiger Hill Kanchenjunga Sunrise', 'Darjeeling Himalayan Toy Train', 'Batasia Loop War Memorial', 'Happy Valley Tea Estate'],
    localAttractions: [
      { name: 'Tiger Hill (2,590m)', desc: 'Dawn viewpoint witnessing first golden sunlight hitting Kanchenjunga and Mt Everest peaks.', type: 'Viewpoint' },
      { name: 'Batasia Loop Toy Train Track', desc: 'Spiral railway loop offering 360-degree views of Darjeeling snow landscape.', type: 'Heritage' },
      { name: 'Happy Valley Tea Estate', desc: 'Organic tea garden established in 1854 where visitors tour tea leaf processing.', type: 'Tea Garden' }
    ],
    mustTryDishes: [
      { name: 'Darjeeling First Flush Tea', desc: 'World famous floral aromatic champagne black tea served in fine china.', veg: true, famousAt: 'Nathmulls Tea Lounge', imageEmoji: '☕' },
      { name: 'Darjeeling Pork / Veg Momos', desc: 'Thin-shelled steamed dumplings filled with minced meat & served with fiery chili garlic salsa.', veg: true, famousAt: 'Kunga Restaurant', imageEmoji: '🥟' }
    ],
    weather: { temp: '13°C', condition: 'Crisp Mountain Mist', bestSeason: 'Oct – May' }
  },
  shillong: {
    title: 'Shillong & Cherrapunji Living Root Bridges',
    location: 'Shillong, Meghalaya, India',
    image: '/munnar.png',
    category: 'nature',
    tags: ['Abode of Clouds', 'Root Bridges', 'Waterfalls'],
    description: 'Scotland of the East with dramatic pine hills, crystal clear Dawki river, and bio-engineered bio-living rubber tree root bridges.',
    spots: ['Cherrapunji Double Decker Root Bridge', 'Dawki Umngot Transparent River', 'Umiam Lake', 'Elephant Falls'],
    localAttractions: [
      { name: 'Double Decker Living Root Bridge', desc: '150-year-old living bio-engineered Indian rubber tree root bridge deep in Cherrapunji jungle.', type: 'Wonder' },
      { name: 'Dawki Crystal Clear River', desc: 'Boating on Umngot River where water is so transparent boats appear to float in air.', type: 'Nature' },
      { name: 'Elephant Falls', desc: 'Three-tiered cascading mountain waterfall surrounded by lush Khasi pine trees.', type: 'Waterfalls' }
    ],
    mustTryDishes: [
      { name: 'Khasi Jadoh Rice', desc: 'Traditional Khasi rice dish cooked with seasoned pork/chicken stock, turmeric, and local herbs.', veg: false, famousAt: 'Jadoh Stall Bara Bazaar', imageEmoji: '🍚' },
      { name: 'Dohneiiong (Pork with Black Sesame)', desc: 'Tender pork belly cooked in roasted black sesame seed paste and mountain garlic.', veg: false, famousAt: 'Trattoria Shillong', imageEmoji: '🍲' }
    ],
    weather: { temp: '17°C', condition: 'Pleasant & Cloud Cover', bestSeason: 'Sep – May' }
  },
  kashmir: {
    title: 'Kashmir Valley & Gulmarg Snow Slopes',
    location: 'Srinagar, Jammu & Kashmir, India',
    image: '/kedarnath.png',
    category: 'nature',
    tags: ['Paradise on Earth', 'Shikara', 'Gulmarg Snow'],
    description: 'Paradise on Earth featuring serene Dal Lake Shikara houseboats, snow slopes of Gulmarg Gondola, and Mughal flower gardens.',
    spots: ['Dal Lake Shikara Ride', 'Gulmarg Gondola Snow Cable Car', 'Pahalgam Betaab Valley', 'Shalimar & Nishat Bagh'],
    localAttractions: [
      { name: 'Dal Lake Houseboat & Shikara', desc: 'Stay in carved wooden houseboats and take romantic Shikara rides past floating flower markets.', type: 'Lake' },
      { name: 'Gulmarg Gondola (13,780 ft)', desc: 'Highest cable car ride in Asia delivering skiers to Mt. Apharwat snow slopes.', type: 'Adventure' },
      { name: 'Pahalgam Betaab Valley', desc: 'Lush alpine meadow along Lidder River surrounded by dense pine forests.', type: 'Nature' }
    ],
    mustTryDishes: [
      { name: 'Kashmiri Saffron Kahwa Tea', desc: 'Hot green tea brewed with saffron strands, green cardamom, cinnamon & crushed almonds.', veg: true, famousAt: 'Ahdoos Srinagar', imageEmoji: '☕' },
      { name: 'Kashmiri Wazwan Rogan Josh', desc: 'Slow cooked tender lamb curry in red Kashmiri chili gravy & aromatic mountain spices.', veg: false, famousAt: 'Mughal Darbar', imageEmoji: '🥩' }
    ],
    weather: { temp: '11°C', condition: 'Chilly Alpine Sunshine', bestSeason: 'Mar – Oct' }
  },
  alleppey: {
    title: 'Alleppey Houseboat Backwaters',
    location: 'Alappuzha (Alleppey), Kerala, India',
    image: '/munnar.png',
    category: 'nature',
    tags: ['Venice of East', 'Houseboats', 'Backwaters'],
    description: 'Tranquil network of emerald lagoons, palm-fringed canals, and traditional thatched Kettuvallam houseboats gliding through paddy fields.',
    spots: ['Vembanad Lake Houseboat Cruise', 'Marari White Sand Beach', 'Punnamada Lake Kayaking', 'Alappuzha Lighthouse'],
    localAttractions: [
      { name: 'Vembanad Lake Houseboat Cruise', desc: 'Overnight luxury houseboat cruise gliding past village coconut groves & duck farms.', type: 'Lake' },
      { name: 'Marari Beach', desc: 'Secluded pristine white sand beach surrounded by fishing palm villages.', type: 'Beach' }
    ],
    mustTryDishes: [
      { name: 'Karimeen Pollichathu', desc: 'Pearl spot backwater fish marinated in spicy shallot masala and baked wrapped in banana leaf.', veg: false, famousAt: 'Cassia Backwater Bistro', imageEmoji: '🐟' },
      { name: 'Alleppey Duck Roast', desc: 'Tender duck cooked in thick roasted coconut gravy with crushed black pepper & curry leaves.', veg: false, famousAt: 'Brother\'s Hotel', imageEmoji: '🥘' }
    ],
    weather: { temp: '28°C', condition: 'Tropical Breeze', bestSeason: 'Nov – Feb' }
  }
};

@Component({
  selector: 'app-explore',
  standalone: true,
  templateUrl: './explore.html',
  styleUrls: ['./explore.css']
})
export class ExploreComponent implements OnInit {

  private weatherService = inject(WeatherService);

  ngOnInit(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      } catch {}
    }
    this.loadLiveWeatherForDestinations();
  }

  private async loadLiveWeatherForDestinations(): Promise<void> {
    const currentDests = this.destinations();
    for (const dest of currentDests) {
      if (dest.weather?.lat && dest.weather?.lng) {
        try {
          const liveData = await this.weatherService.fetchLiveWeather(dest.weather.lat, dest.weather.lng);
          if (liveData) {
            this.destinations.update(dests =>
              dests.map(d => {
                if (d.id === dest.id) {
                  return {
                    ...d,
                    weather: {
                      ...d.weather,
                      temp: `${liveData.temperature}°C`,
                      condition: `${liveData.icon} ${liveData.condition}`,
                      windSpeed: `${liveData.windSpeed} km/h`,
                      liveFetched: true
                    }
                  };
                }
                return d;
              })
            );
          }
        } catch {}
      }
    }
  }

  protected getWeatherIcon(weather?: any): string {
    if (!weather || !weather.condition) return '🌤️';
    const cond = weather.condition.toLowerCase();

    if (cond.includes('snow') || cond.includes('alpine') || cond.includes('chilly')) return '❄️';
    if (cond.includes('thunder') || cond.includes('lightning') || cond.includes('storm')) return '⛈️';
    if (cond.includes('rain') || cond.includes('shower') || cond.includes('drizzle')) return '🌧️';
    if (cond.includes('fog') || cond.includes('mist') || cond.includes('hazy')) return '🌫️';
    if (cond.includes('cloud') || cond.includes('overcast')) return '⛅';
    if (cond.includes('sun') || cond.includes('clear')) return '☀️';
    if (cond.includes('wind') || cond.includes('breeze')) return '💨';

    const match = weather.condition.match(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u);
    if (match) return match[0];

    return '🌤️';
  }

  protected readonly activePhraseId = signal<string | null>(null);
  protected readonly activeOptimizerDestId = signal<string | null>(null);

  protected readonly destinations = signal<Destination[]>(INITIAL_DESTINATIONS);

  protected readonly searchQuery = signal('');
  protected readonly selectedCategory = signal('all');
  protected readonly selectedRegion = signal('all');
  protected readonly copyToast = signal<string | null>(null);
  protected readonly sortBy = signal<'default' | 'rating' | 'name'>('default');

  protected setRegion(region: string): void {
    this.selectedRegion.set(region);
  }

  protected shareTripPlan(dest: Destination, event?: Event): void {
    if (event) event.stopPropagation();

    const summary = `🇮🇳 Travel Saathi Trip Plan: ${dest.title} (${dest.location})
⭐ Rating: ${dest.rating}/5.0 | ☀️ Weather: ${dest.weather?.temp} ${dest.weather?.condition} (Best: ${dest.weather?.bestSeason})

📍 Top Places to Visit:
${dest.localAttractions?.map(a => `- ${a.name}: ${a.desc}`).join('\n') || dest.spots.map(s => `- ${s}`).join('\n')}

🍛 Must-Try Local Delicacies:
${dest.mustTryDishes?.map(d => `- ${d.name} (${d.veg ? 'Veg' : 'Non-Veg'}): ${d.desc}`).join('\n') || '- Local Thali & Sweets'}

🚗 Transit Tip: ${dest.pathOptimizer?.recommendedLocalMode || 'Local Auto/Taxi'}

Planned with Travel Saathi 🧭`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      this.copyToast.set(`Trip plan for ${dest.title} copied to clipboard! 📋`);
      setTimeout(() => this.copyToast.set(null), 3000);
    }
  }
  protected readonly expandedDestinationId = signal<string | null>(null);

  // Budget Calculator Signals
  protected readonly budgetDays = signal<number>(3);
  protected readonly budgetTier = signal<'backpacker' | 'comfort' | 'luxury'>('comfort');
  protected readonly budgetGroupSize = signal<number>(1);

  protected openMapsDirections(spotName: string, location: string, event?: Event): void {
    if (event) event.stopPropagation();
    const query = encodeURIComponent(`${spotName}, ${location}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  protected calculateTripEstimate(tier: 'backpacker' | 'comfort' | 'luxury', days: number, people: number): {
    stayCost: number;
    foodCost: number;
    transitCost: number;
    total: number;
  } {
    let perDayPerPerson = 1200;
    if (tier === 'comfort') perDayPerPerson = 3200;
    if (tier === 'luxury') perDayPerPerson = 8500;

    const stayCost = Math.round(perDayPerPerson * 0.45 * days * people);
    const foodCost = Math.round(perDayPerPerson * 0.35 * days * people);
    const transitCost = Math.round(perDayPerPerson * 0.20 * days * people);
    const total = stayCost + foodCost + transitCost;

    return { stayCost, foodCost, transitCost, total };
  }

  protected readonly activeRouteDestId = signal<string | null>(null);
  protected readonly selectedStartCity = signal<string | null>(null);

  protected readonly savedDestinationIds = signal<Set<string>>(this.loadSavedFavorites());

  // New Features: Map View, Lightbox Gallery & Packing Checklist
  protected readonly viewMode = signal<'list' | 'map'>('list');

  protected readonly isGalleryOpen = signal(false);
  protected readonly activeGallery = signal<{ title: string; images: string[]; currentIndex: number } | null>(null);

  protected readonly isChecklistOpen = signal(false);
  protected readonly checklistItems = signal<ChecklistItem[]>(this.loadChecklist());

  private loadChecklist(): ChecklistItem[] {
    try {
      const stored = localStorage.getItem('travel_saathi_checklist');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      { id: '1', text: 'Valid Govt ID Proof (Aadhaar / Passport / Voter ID)', category: 'Essential', checked: true },
      { id: '2', text: 'Temple Dress Code (Traditional / Modest Cover)', category: 'Spiritual', checked: true },
      { id: '3', text: 'Power Bank & High-Speed Mobile Charger', category: 'Tech', checked: false },
      { id: '4', text: 'Emergency Cash in ₹100 / ₹50 Notes (Remote Shrines)', category: 'Essential', checked: false },
      { id: '5', text: 'Personal Medical Kit & Motion Sickness Pills', category: 'Health', checked: true },
      { id: '6', text: 'Compact Umbrella / Rain Poncho (Hill Treks)', category: 'Essential', checked: false },
      { id: '7', text: 'Slip-on Shoes / Socks for Hot Temple Stone Floors', category: 'Spiritual', checked: false }
    ];
  }

  protected toggleChecklistItem(id: string): void {
    const updated = this.checklistItems().map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    this.checklistItems.set(updated);
    try {
      localStorage.setItem('travel_saathi_checklist', JSON.stringify(updated));
    } catch {}
  }

  protected openGallery(dest: Destination, event?: Event): void {
    if (event) event.stopPropagation();
    const images = dest.gallery && dest.gallery.length > 0 ? dest.gallery : [dest.image];
    this.activeGallery.set({
      title: dest.title,
      images: images,
      currentIndex: 0
    });
    this.isGalleryOpen.set(true);
  }

  protected closeGallery(): void {
    this.isGalleryOpen.set(false);
    this.activeGallery.set(null);
  }

  protected nextGalleryImage(event?: Event): void {
    if (event) event.stopPropagation();
    const g = this.activeGallery();
    if (!g) return;
    const nextIdx = (g.currentIndex + 1) % g.images.length;
    this.activeGallery.set({ ...g, currentIndex: nextIdx });
  }

  protected prevGalleryImage(event?: Event): void {
    if (event) event.stopPropagation();
    const g = this.activeGallery();
    if (!g) return;
    const prevIdx = (g.currentIndex - 1 + g.images.length) % g.images.length;
    this.activeGallery.set({ ...g, currentIndex: prevIdx });
  }

  private loadSavedFavorites(): Set<string> {
    try {
      const stored = localStorage.getItem('travel_saathi_favs');
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch {}
    return new Set(['1', '6']);
  }

  protected readonly lightboxImage = signal<{ url: string; title: string; location: string } | null>(null);

  protected readonly playbackSpeed = signal<number>(1.0);
  protected readonly selectedCurrency = signal<'INR' | 'USD' | 'EUR' | 'GBP'>('INR');

  private activeAudio: HTMLAudioElement | null = null;

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

  protected playPhraseAudio(destId: string, phrase: Phrase): void {
    const phraseId = destId + '_' + phrase.original;
    this.activePhraseId.set(phraseId);

    this.playFallbackChime();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setTimeout(() => {
        if (this.activePhraseId() === phraseId) this.activePhraseId.set(null);
      }, 1500);
      return;
    }

    try {
      window.speechSynthesis.resume();
    } catch {}

    const textToSpeak = phrase.pronounce || phrase.original;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    const voices = window.speechSynthesis.getVoices() || [];
    const targetLang = (phrase.langCode || 'hi-IN').toLowerCase();
    const langPrefix = targetLang.split('-')[0];

    const matchingVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-') === targetLang.replace('_', '-')) ||
                          voices.find(v => v.lang.toLowerCase().startsWith(langPrefix)) ||
                          voices.find(v => v.lang.toLowerCase().includes('in')) ||
                          voices.find(v => v.lang.toLowerCase().startsWith('en'));

    if (matchingVoice) {
      utterance.voice = matchingVoice;
      utterance.lang = matchingVoice.lang;
    }

    utterance.volume = 1.0;
    utterance.pitch = 1.0;
    utterance.rate = 0.88 * this.playbackSpeed();

    let finished = false;

    utterance.onend = () => {
      finished = true;
      if (this.activePhraseId() === phraseId) this.activePhraseId.set(null);
    };

    utterance.onerror = () => {
      finished = true;
      if (this.activePhraseId() === phraseId) this.activePhraseId.set(null);
    };

    setTimeout(() => {
      if (!finished && this.activePhraseId() === phraseId) {
        this.activePhraseId.set(null);
      }
    }, 3000);

    window.speechSynthesis.speak(utterance);
  }

  private playFallbackChime(): void {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3); // G5

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {}
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
      try {
        localStorage.setItem('travel_saathi_favs', JSON.stringify(Array.from(updated)));
      } catch {}
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

  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && !img.src.includes('munnar.png')) {
      img.src = 'munnar.png';
    }
  }

  protected readonly cityMap = signal<Record<string, string>>({});

  protected getStartCity(destId: string): string {
    return this.cityMap()[destId] || 'delhi';
  }

  protected setStartCity(destId: string, city: string): void {
    this.cityMap.update(m => ({ ...m, [destId]: city }));
  }

  protected getTransportOptions(destId: string, city: string): TransportOption[] {
    const destDb = TRANSPORT_DATABASE[destId] || TRANSPORT_DATABASE['1'];
    return destDb[city] || destDb['delhi'] || [
      { mode: 'train', name: 'Express Train Service', duration: '6h 30m', cost: 850, best: true, tip: 'Direct day train with scenic window views.' },
      { mode: 'flight', name: 'Direct Flight + Cab', duration: '2h 15m', cost: 4200, best: false, tip: 'Fastest transit for weekend trips.' }
    ];
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
    const reg = this.selectedRegion();
    const sort = this.sortBy();
    const saved = this.savedDestinationIds();
    
    let result = this.destinations().filter(dest => {
      const matchesSearch = dest.title.toLowerCase().includes(query) || 
                            dest.location.toLowerCase().includes(query) ||
                            dest.tags.some(t => t.toLowerCase().includes(query));
      
      let matchesCategory = true;
      if (cat === 'saved') {
        matchesCategory = saved.has(dest.id);
      } else if (cat !== 'all') {
        matchesCategory = dest.category === cat;
      }

      let matchesRegion = true;
      if (reg !== 'all') {
        matchesRegion = (dest.region === reg) || 
                        dest.location.toLowerCase().includes(reg.toLowerCase()) ||
                        dest.tags.some(t => t.toLowerCase().includes(reg.toLowerCase()));
      }
      
      return matchesSearch && matchesCategory && matchesRegion;
    });

    if (sort === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sort === 'name') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  });

  protected addCustomDestination(query: string): void {
    if (!query || !query.trim()) return;
    const rawQuery = query.trim();
    const key = rawQuery.toLowerCase();
    const formattedTitle = rawQuery.charAt(0).toUpperCase() + rawQuery.slice(1);
    const newId = (Date.now()).toString();

    // Check if place matches our curated All-India preset knowledge base
    const presetKey = Object.keys(INDIA_PLACE_PRESETS).find(k => key.includes(k) || k.includes(key));
    const preset = presetKey ? INDIA_PLACE_PRESETS[presetKey] : null;

    let newDest: Destination;

    if (preset) {
      newDest = {
        id: newId,
        title: preset.title,
        location: preset.location,
        image: preset.image || 'goa.png',
        rating: 4.9,
        category: preset.category || 'nature',
        tags: preset.tags,
        description: preset.description,
        spots: preset.spots,
        localAttractions: preset.localAttractions,
        mustTryDishes: preset.mustTryDishes,
        itinerary: [
          { day: 1, title: `${rawQuery} Landmark Tour`, desc: `Arrive early and tour top highlights: ${preset.spots.slice(0, 2).join(' & ')}.`, done: true },
          { day: 2, title: `Culture & Regional Food Safari`, desc: `Sample authentic local specialties like ${preset.mustTryDishes[0]?.name || 'famous street eats'}.`, done: false },
          { day: 3, title: `Scenic Sunrise & Artisan Bazaars`, desc: `Experience panoramic views and buy local handicrafts before departure.`, done: false }
        ],
        phrases: preset.phrases || [
          { original: 'नमस्ते', pronounce: 'Namaste', meaning: 'Hello / Greetings', langCode: 'hi-IN' },
          { original: 'यह कितने का है?', pronounce: 'Yeh kitne ka hai?', meaning: 'How much does this cost?', langCode: 'hi-IN' },
          { original: 'धन्यवाद', pronounce: 'Dhanyavaad', meaning: 'Thank you', langCode: 'hi-IN' }
        ],
        pathOptimizer: {
          optimizedSequence: [
            { spot: preset.spots[0] || `${rawQuery} City Center`, timeOfDay: '08:00 AM (Morning)', tip: 'Start early morning to beat afternoon sun and long queues.' },
            { spot: preset.spots[1] || `${rawQuery} Local Market`, timeOfDay: '01:30 PM (Midday)', tip: 'Enjoy authentic regional thali lunch and souvenir shopping.' },
            { spot: preset.spots[2] || `${rawQuery} Sunset Point`, timeOfDay: '05:30 PM (Sunset)', tip: 'Capture breathtaking golden hour sunset photos.' }
          ],
          recommendedLocalMode: 'Local Auto-Rickshaw / Prepaid Taxi',
          modeExplanation: `Hiring a local driver in ${rawQuery} provides comfortable door-to-door transit across all sightseeing spots.`,
          estimatedDuration: 'Full Day (approx 9 hours)',
          estimatedCost: '₹1,000 - ₹1,800'
        },
        weather: preset.weather,
        mapCoords: { x: 50, y: 50 },
        gallery: [preset.image || 'goa.png']
      };
    } else {
      newDest = {
        id: newId,
        title: `${formattedTitle} Explorer Guide`,
        location: `${formattedTitle}, India`,
        image: 'goa.png',
        rating: 4.9,
        category: 'nature',
        tags: ['All-India Travel', 'Heritage', 'Scenic Spot'],
        description: `Comprehensive travel companion guide for ${formattedTitle}, India. Discover iconic monuments, natural viewpoints, vibrant markets, and authentic regional delicacies.`,
        spots: [`${formattedTitle} Heritage Center`, `${formattedTitle} Main Bazaar`, `${formattedTitle} Scenic Sunset Viewpoint`],
        localAttractions: [
          { name: `${formattedTitle} Historic Center`, desc: `Ancient landmark displaying the rich cultural heritage and architecture of ${formattedTitle}.`, type: 'Heritage' },
          { name: `${formattedTitle} Nature Viewpoint`, desc: `Panoramic lookout point offering breathtaking views of surrounding landscapes.`, type: 'Viewpoint' },
          { name: `${formattedTitle} Central Market`, desc: `Bustling local bazaar filled with regional handicrafts, spices, and street food.`, type: 'Culture' }
        ],
        mustTryDishes: [
          { name: `${formattedTitle} Special Thali`, desc: `Authentic regional thali featuring traditional curries, fresh flatbreads, and aromatic rice.`, veg: true, famousAt: `${formattedTitle} Heritage Mess`, imageEmoji: '🍱' },
          { name: `${formattedTitle} Street Food Snack`, desc: `Crispy fried savory snack spiced with local herbs and tangy chutneys.`, veg: true, famousAt: `Central Market Stalls`, imageEmoji: '🧆' }
        ],
        itinerary: [
          { day: 1, title: `${formattedTitle} Heritage Walk`, desc: `Arrive early and explore the main monuments and iconic street corridors of ${formattedTitle}.`, done: true },
          { day: 2, title: `Local Food & Bazaar Safari`, desc: `Taste authentic regional delicacies and shop for traditional handcrafted souvenirs.`, done: false },
          { day: 3, title: `Sunset Panorama & Departure`, desc: `Visit scenic viewpoints for golden hour sunset photos before concluding your trip.`, done: false }
        ],
        phrases: [
          { original: 'नमस्ते', pronounce: 'Namaste', meaning: 'Hello / Greetings', langCode: 'hi-IN' },
          { original: 'यह कितने का है?', pronounce: 'Yeh kitne ka hai?', meaning: 'How much does this cost?', langCode: 'hi-IN' },
          { original: 'धन्यवाद', pronounce: 'Dhanyavaad', meaning: 'Thank you', langCode: 'hi-IN' }
        ],
        pathOptimizer: {
          optimizedSequence: [
            { spot: `${formattedTitle} Historic Center`, timeOfDay: '08:00 AM (Morning)', tip: 'Start early morning before heat and crowd peak.' },
            { spot: `${formattedTitle} Central Market`, timeOfDay: '01:30 PM (Midday)', tip: 'Enjoy authentic regional lunch and handcrafted souvenirs.' },
            { spot: `${formattedTitle} Nature Viewpoint`, timeOfDay: '05:30 PM (Sunset)', tip: 'Catch spectacular sunset photos over the horizon.' }
          ],
          recommendedLocalMode: 'Local Taxi & Auto-Rickshaw Day Tour',
          modeExplanation: `Hiring a local driver in ${formattedTitle} ensures smooth transit between distant sightseeing spots.`,
          estimatedDuration: 'Full Day (approx 8.5 hours)',
          estimatedCost: '₹1,200 - ₹2,000'
        },
        weather: { temp: '25°C', condition: 'Sunny & Pleasant', bestSeason: 'Oct – Mar' },
        mapCoords: { x: 50, y: 50 },
        gallery: ['goa.png']
      };
    }

    this.destinations.update(dests => [newDest, ...dests]);
    this.expandedDestinationId.set(newId);
    this.searchQuery.set('');
  }

  protected readonly transitGuidance = computed(() => {
    const destId = this.activeRouteDestId();
    const rawCity = this.selectedStartCity();
    
    if (!destId || !rawCity) return null;
    
    const cityKey = rawCity.toLowerCase().trim();
    const destRoutes = TRANSPORT_DATABASE[destId];
    
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
        cost: 6500,
        best: true,
        tip: `Take a domestic flight to the nearest airport, then hire an authorized airport prepaid cab to reach ${destName}.`
      },
      {
        mode: 'train' as const,
        name: 'Indian Railways Express (AC Sleeper)',
        duration: '12h - 24h',
        cost: 1800,
        best: false,
        tip: 'Check direct or connecting trains on IRCTC to the nearest major rail terminal.'
      }
    ];
  });
}
