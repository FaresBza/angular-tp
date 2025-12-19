import { selectUserOrders, selectWishlistProducts } from '../user/user.selectors';

describe('Wishlist selector', () => {
  it('should returns only wishlist products', () => {
    const wishlistIds = ['1', '3'];
    const products = [
      { id: 1 }, 
      { id: 2 }, 
      { id: 3 }
    ];

    const result = selectWishlistProducts.projector(wishlistIds, products);

    expect(result.map((p) => p.id)).toEqual([1, 3]);
  });

});

