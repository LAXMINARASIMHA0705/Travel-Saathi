import { Injectable, signal, computed } from '@angular/core';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  isVeg?: boolean;
  prepTime?: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  readonly cart = signal<CartItem[]>([]);
  readonly orderStatus = signal<'idle' | 'checking_out' | 'placed'>('idle');
  readonly deliveryStep = signal<number>(1);
  readonly isCartOpen = signal<boolean>(false);

  readonly cartCount = computed(() => {
    return this.cart().reduce((sum, item) => sum + item.quantity, 0);
  });

  readonly cartTotal = computed(() => {
    return this.cart().reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  });

  addToCart(item: MenuItem): void {
    this.cart.update(currentCart => {
      const existing = currentCart.find(i => i.menuItem.id === item.id || i.menuItem.name === item.name);
      if (existing) {
        return currentCart.map(i =>
          (i.menuItem.id === item.id || i.menuItem.name === item.name)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...currentCart, { menuItem: item, quantity: 1 }];
    });
  }

  updateQuantity(itemId: string, change: number): void {
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

  clearCart(): void {
    this.cart.set([]);
  }

  toggleCart(): void {
    this.isCartOpen.update(o => !o);
  }

  checkout(): void {
    if (this.cart().length === 0) return;
    this.orderStatus.set('checking_out');

    setTimeout(() => {
      this.orderStatus.set('placed');
      this.clearCart();
      this.startDeliverySimulation();
    }, 1500);
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

  resetOrder(): void {
    this.orderStatus.set('idle');
    this.isCartOpen.set(false);
  }
}
