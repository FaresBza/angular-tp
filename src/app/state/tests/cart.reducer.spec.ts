import { cartReducer, initialCartState } from '../cart/cart.reducer';
import { CartActions } from '../cart/cart.actions';

describe('Cart reducer', () => {
    it('should add an item', () => {
        const newProductAtCart = cartReducer(
            initialCartState,
            CartActions.addItem(
                { 
                    product: { id: 1, name: 'Product1', price: 135 } 
                }
            ),
        );

        expect(newProductAtCart.items.length).toBe(1);
        expect(newProductAtCart.items[0].product.id).toBe(1);
        expect(newProductAtCart.items[0].quantity).toBe(1);
    });

    it('should changes quantity ', () => {
        const updatProductQuantity = cartReducer(
            initialCartState,
            CartActions.addItem(
                { 
                    product: { id: 1, name: 'Product1', price: 45, stock: 15 } 
                }
            ),
        );

        const s2 = cartReducer(updatProductQuantity, CartActions.updateQuantity({ productId: 1, quantity: 7 }));

        expect(s2.items[0].quantity).toBe(7);
    });

    it('should remove item by id', () => {
        const removeProductCart = cartReducer(
            initialCartState,
            CartActions.addItem(
                { 
                    product: { id: 1, name: 'Product1', price: 135 } 
                }
            ),
        );

        const state = cartReducer(removeProductCart, CartActions.removeItem({ productId: 1 }));

        expect(state.items.length).toBe(0);
    });
});
