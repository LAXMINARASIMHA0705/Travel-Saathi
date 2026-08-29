import { Component, signal, computed, model, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, MenuItem } from '../../services/cart.service';

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './food.html',
  styleUrls: ['./food.css']
})
export class FoodComponent {
  protected readonly cartService = inject(CartService);

  isOpen = model<boolean>(false);

  protected readonly searchQuery = signal('');
  protected readonly selectedCategory = signal('all');
  protected readonly dietaryFilter = signal<'all' | 'veg' | 'non-veg'>('all');
  protected readonly isCartOpen = signal(false);

  protected readonly promoCode = signal('');
  protected readonly promoDiscount = signal(0);
  protected readonly isPromoApplied = signal(false);
  protected readonly promoError = signal('');

  protected readonly deliveryLocationType = signal<'hotel' | 'train' | 'bus'>('hotel');

  protected readonly hotelName = signal('');
  protected readonly roomNumber = signal('');
  
  protected readonly stationName = signal('');
  protected readonly trainNumber = signal('');
  protected readonly coachBerth = signal('');
  
  protected readonly busTerminalName = signal('');
  protected readonly busOperator = signal('');
  protected readonly seatNumber = signal('');

  protected readonly menu = signal<MenuItem[]>([
    {
      id: '101',
      name: 'Andhra Avakaya Biryani',
      price: 350,
      description: 'Fragrant basmati rice cooked with spiced chicken and spicy tangy Andhra mango pickle (Avakaya), served with raita.',
      image: 'biryani.png',
      category: 'mains',
      rating: 4.9,
      isVeg: false,
      prepTime: '25 mins'
    },
    {
      id: '102',
      name: 'Butter Chicken & Garlic Naan',
      price: 320,
      description: 'Rich, creamy spiced tomato-butter gravy served with tender tandoori chicken chunks and fresh hot garlic butter naan.',
      image: 'butter-chicken.png',
      category: 'mains',
      rating: 4.8,
      isVeg: false,
      prepTime: '20 mins'
    },
    {
      id: '103',
      name: 'Pesarattu Upma Set',
      price: 220,
      description: 'Traditional green gram crepe stuffed with hot ginger semolina upma, served with ginger chutney (Allam Pachadi).',
      image: 'pesarattu.png',
      category: 'mains',
      rating: 4.8,
      isVeg: true,
      prepTime: '15 mins'
    },
    {
      id: '104',
      name: 'Classic Masala Dosa Set',
      price: 180,
      description: 'Crispy fermented rice and lentil crepe stuffed with tempered potato mash, served with coconut chutney and hot sambar.',
      image: 'dosa.png',
      category: 'mains',
      rating: 4.8,
      isVeg: true,
      prepTime: '12 mins'
    },
    {
      id: '105',
      name: 'Tandoori Paneer Tikka',
      price: 280,
      description: 'Grilled cottage cheese cubes, bell peppers, and onions marinated in yogurt and aromatic spices, charred in a tandoor.',
      image: 'paneer-tikka.png',
      category: 'sides',
      rating: 4.7,
      isVeg: true,
      prepTime: '18 mins'
    },
    {
      id: '106',
      name: 'Mango Lassi & Kesari Peda',
      price: 120,
      description: 'A tall glass of sweet, thick mango yogurt lassi served with cardamom saffron milk fudge sweets.',
      image: 'mango-lassi.png',
      category: 'desserts',
      rating: 4.9,
      isVeg: true,
      prepTime: '5 mins'
    },
    {
      id: '107',
      name: 'Hyderabadi Dum Biryani',
      price: 360,
      description: 'Authentic slow-cooked basmati rice with tender marinated chicken, saffron, fried onions, and mint leaves.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
      category: 'mains',
      rating: 4.9,
      isVeg: false,
      prepTime: '25 mins'
    },
    {
      id: '108',
      name: 'Dal Makhani & Jeera Rice',
      price: 260,
      description: 'Creamy slow-simmered black lentils cooked in butter and cream, served with fragrant cumin basmati rice.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
      category: 'mains',
      rating: 4.8,
      isVeg: true,
      prepTime: '15 mins'
    },
    {
      id: '109',
      name: 'Amritsari Chole Bhature',
      price: 240,
      description: 'Tangy spicy chickpeas cooked with authentic Punjabi spices, served with two fluffy deep-fried bhaturas and pickles.',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80',
      category: 'mains',
      rating: 4.9,
      isVeg: true,
      prepTime: '15 mins'
    },
    {
      id: '110',
      name: 'Kerala Fish Curry & Red Rice',
      price: 380,
      description: 'Fresh kingfish simmered in coconut milk and tangy Kudampuli tamarind gravy, served with Kerala Matta red rice.',
      image: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?auto=format&fit=crop&w=400&q=80',
      category: 'mains',
      rating: 4.8,
      isVeg: false,
      prepTime: '25 mins'
    },
    {
      id: '111',
      name: 'Ghee Roast Chicken Wings',
      price: 290,
      description: 'Mangalorean style succulent chicken wings tossed in rich ghee and freshly roasted spicy Byadgi chillies.',
      image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=400&q=80',
      category: 'sides',
      rating: 4.9,
      isVeg: false,
      prepTime: '20 mins'
    },
    {
      id: '112',
      name: 'Samosa Chaat & Chutneys',
      price: 140,
      description: 'Crushed potato samosas topped with spiced chickpeas, sweet yogurt, tangy tamarind, and fresh mint chutney.',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
      category: 'sides',
      rating: 4.7,
      isVeg: true,
      prepTime: '10 mins'
    },
    {
      id: '113',
      name: 'Gulab Jamun with Rabri',
      price: 160,
      description: 'Warm soft milk dumplings soaked in rose-cardamom syrup, served over chilled thick condensed milk rabri.',
      image: 'https://images.unsplash.com/photo-1621841957884-1210fe19d66d?auto=format&fit=crop&w=400&q=80',
      category: 'desserts',
      rating: 4.9,
      isVeg: true,
      prepTime: '5 mins'
    },
    {
      id: '114',
      name: 'Masala Chai & Bun Maska',
      price: 90,
      description: 'Hot aromatic ginger cardamom milk tea served alongside soft sweet bun slathered with salted Amul butter.',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
      category: 'beverages',
      rating: 4.9,
      isVeg: true,
      prepTime: '5 mins'
    },
    {
      id: '115',
      name: 'Madurai Jigarthanda',
      price: 130,
      description: 'Famous Madurai specialty drink made with almond gum, nannari syrup, sweetened milk, and basundi ice cream scoop.',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80',
      category: 'beverages',
      rating: 4.8,
      isVeg: true,
      prepTime: '5 mins'
    }
  ]);

  protected readonly filteredMenu = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();
    const diet = this.dietaryFilter();

    return this.menu().filter(item => {
      const matchesCategory = cat === 'all' || item.category === cat;
      const matchesQuery = !query || 
                           item.name.toLowerCase().includes(query) || 
                           item.description.toLowerCase().includes(query);
      const matchesDiet = diet === 'all' || 
                          (diet === 'veg' && item.isVeg) || 
                          (diet === 'non-veg' && !item.isVeg);

      return matchesCategory && matchesQuery && matchesDiet;
    });
  });

  protected readonly finalCartTotal = computed(() => {
    const rawTotal = this.cartService.cartTotal();
    const discount = this.promoDiscount();
    return Math.max(0, rawTotal - discount);
  });

  protected applyPromoCode(inputCode: string): void {
    if (!inputCode || !inputCode.trim()) return;
    const cleanCode = inputCode.trim().toUpperCase();

    if (cleanCode === 'SAATHI50') {
      this.promoDiscount.set(50);
      this.isPromoApplied.set(true);
      this.promoError.set('');
    } else if (cleanCode === 'SAVER20') {
      this.promoDiscount.set(20);
      this.isPromoApplied.set(true);
      this.promoError.set('');
    } else {
      this.promoError.set('Invalid code. Try SAATHI50 for ₹50 off!');
    }
  }

  protected removePromoCode(): void {
    this.promoCode.set('');
    this.promoDiscount.set(0);
    this.isPromoApplied.set(false);
    this.promoError.set('');
  }

  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && !img.src.includes('biryani.png')) {
      img.src = 'biryani.png';
    }
  }

  protected setCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  protected setDietaryFilter(diet: 'all' | 'veg' | 'non-veg'): void {
    this.dietaryFilter.set(diet);
  }

  protected selectLocationType(type: 'hotel' | 'train' | 'bus'): void {
    this.deliveryLocationType.set(type);
  }

  protected closeDrawer(): void {
    this.isOpen.set(false);
  }
}
