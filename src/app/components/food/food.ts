import { Component, signal, computed, model } from '@angular/core';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating: number;
}

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

@Component({
  selector: 'app-food',
  standalone: true,
  templateUrl: './food.html',
  styleUrls: ['./food.css']
})
export class FoodComponent {

  isOpen = model<boolean>(false);
  cart = model<CartItem[]>([]);
  orderStatus = model<'idle' | 'checking_out' | 'placed'>('idle');
  deliveryStep = model<number>(1);

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
      price: 13.50,
      description: 'Fragrant basmati rice cooked with spiced chicken and spicy tangy Andhra mango pickle (Avakaya), served with raita.',
      image: '/biryani.png',
      category: 'mains',
      rating: 4.9
    },
    {
      id: '102',
      name: 'Butter Chicken & Garlic Naan',
      price: 12.50,
      description: 'Rich, creamy spiced tomato-butter gravy served with tender tandoori chicken chunks and fresh hot garlic butter naan.',
      image: '/butter-chicken.png',
      category: 'mains',
      rating: 4.9
    },
    {
      id: '103',
      name: 'Pesarattu Upma Set',
      price: 8.50,
      description: 'Traditional green gram crepe stuffed with hot ginger semolina upma, served with ginger chutney (Allam Pachadi).',
      image: '/pesarattu.png',
      category: 'mains',
      rating: 4.8
    },
    {
      id: '104',
      name: 'Classic Masala Dosa Set',
      price: 8.00,
      description: 'Crispy fermented rice and lentil crepe stuffed with tempered potato mash, served with coconut chutney and hot sambar.',
      image: '/dosa.png',
      category: 'mains',
      rating: 4.8
    },
    {
      id: '105',
      name: 'Tandoori Paneer Tikka',
      price: 9.50,
      description: 'Grilled cottage cheese cubes, bell peppers, and onions marinated in yogurt and aromatic spices, charred in a tandoor.',
      image: '/paneer-tikka.png',
      category: 'sides',
      rating: 4.7
    },
    {
      id: '106',
      name: 'Mango Lassi & Kesari Peda',
      price: 5.00,
      description: 'A tall glass of sweet, thick mango yogurt lassi served with cardamom saffron milk fudge sweets.',
      image: '/mango-lassi.png',
      category: 'desserts',
      rating: 4.9
    }
  ]);

  protected readonly isCartOpen = signal(false);
  protected readonly selectedCategory = signal<string>('all');

  protected readonly filteredMenu = computed(() => {
    const cat = this.selectedCategory();
    return this.menu().filter(item => cat === 'all' || item.category === cat);
  });

  protected readonly quickBites = computed(() => {
    return this.menu().filter(item => item.rating >= 4.9);
  });

  protected readonly cartCount = computed(() => {
    return this.cart().reduce((sum, item) => sum + item.quantity, 0);
  });

  protected readonly cartTotal = computed(() => {
    return this.cart().reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  });

  protected readonly preparationalText = computed(() => {
    const loc = this.deliveryLocationType();
    if (loc === 'train') return 'Packing food in thermal transit-proof hotboxes.';
    if (loc === 'bus') return 'Sealing food securely in spill-safe travel boxes.';
    return 'Sizzling spice blending & fresh cooking in progress.';
  });

  protected readonly deliveryText = computed(() => {
    const loc = this.deliveryLocationType();
    const station = this.stationName() || 'Station Platform';
    const busTerm = this.busTerminalName() || 'Bus Stand';
    
    if (loc === 'train') return `Scooter courier heading to Platform at ${station}.`;
    if (loc === 'bus') return `Scooter courier driving to Bay at ${busTerm}.`;
    return 'Courier has picked up your food on a scooter.';
  });

  protected readonly arrivalText = computed(() => {
    const loc = this.deliveryLocationType();
    const trainNo = this.trainNumber() ? `Train ${this.trainNumber()}` : 'Train';
    const coach = this.coachBerth() ? `Coach ${this.coachBerth()}` : 'Coach door';
    const bus = this.busOperator() ? `${this.busOperator()} Bus` : 'Bus';
    const seat = this.seatNumber() ? `Seat ${this.seatNumber()}` : 'Seat';
    
    if (loc === 'train') return `Meet courier at ${coach} of ${trainNo}.`;
    if (loc === 'bus') return `Meet courier at ${seat} of ${bus}.`;
    return 'Pick up your warm box at hotel lobby reception.';
  });

  protected addToCart(item: MenuItem): void {
    this.cart.update(currentCart => {
      const existing = currentCart.find(i => i.menuItem.id === item.id);
      if (existing) {
        return currentCart.map(i => 
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...currentCart, { menuItem: item, quantity: 1 }];
    });
  }

  protected updateQuantity(itemId: string, change: number): void {
    this.cart.update(currentCart => {
      return currentCart.map(i => {
        if (i.menuItem.id === itemId) {
          const newQty = i.quantity + change;
          return { ...i, quantity: newQty };
        }
        return i;
      }).filter(i => i.quantity > 0);
    });
  }

  protected clearCart(): void {
    this.cart.set([]);
  }

  protected toggleCart(): void {
    this.isCartOpen.update(o => !o);
  }

  protected selectLocationType(type: 'hotel' | 'train' | 'bus'): void {
    this.deliveryLocationType.set(type);
  }

  protected checkout(): void {
    if (this.cart().length === 0) return;
    this.orderStatus.set('checking_out');

    setTimeout(() => {
      this.orderStatus.set('placed');
      this.clearCart();
      this.startDeliverySimulation();
    }, 2000);
  }

  private startDeliverySimulation(): void {
    this.deliveryStep.set(1);

    setTimeout(() => {
      if (this.orderStatus() === 'placed') {
        this.deliveryStep.set(2);
      }
    }, 4500);

    setTimeout(() => {
      if (this.orderStatus() === 'placed') {
        this.deliveryStep.set(3);
      }
    }, 9000);
  }

  protected resetOrder(): void {
    this.orderStatus.set('idle');
    this.isCartOpen.set(false);
  }

  protected closeDrawer(): void {
    this.isOpen.set(false);
  }
}

