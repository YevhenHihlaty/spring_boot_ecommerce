import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(cartItem: CartItem){
    
    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0){
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === cartItem.id);
    }

    alreadyExistInCart = (existingCartItem != undefined);
    if (alreadyExistInCart){
      existingCartItem.quantity ++;
    }else{
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();
  }

  computeCartTotals(){
    
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let cartItem of this.cartItems){
      totalPriceValue += cartItem.unitPrice * cartItem.quantity;
      totalQuantityValue += cartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);

  }
    logCartData(totalPriceValue: number, totalQuantityValue: number){
      console.log('Content of the cart');
      for(let cartItem of this.cartItems){
        const subTotalPrice = cartItem.quantity * cartItem.unitPrice;
        console.log(`name: ${cartItem.name}, quantity= ${cartItem.quantity}, Sub Total Price = ${subTotalPrice} `);

        //two digits after decimal
        console.log(`Total Price: ${totalPriceValue.toFixed(2)} `)
      }
    }
    decrementQuantity(cartItem: CartItem) {
      cartItem.quantity --;

      if(cartItem.quantity == 0){
        this.remove(cartItem);
      }else{
        this.computeCartTotals;
      }
  }
  remove(cartItem: CartItem){
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === cartItem.id);
    
    if (itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);
    }
  }
  
}
