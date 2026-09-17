import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

export function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(product, 1);
    // Could show toast notification here
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover"
        />
      )}

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{product.name}</h3>

        {product.description && (
          <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        )}

        {/* Vegetarian Badge */}
        {product.isVegetarian && (
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-2">
            Veg
          </span>
        )}

        {/* Price & Rating */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-2xl font-bold text-green-600">
              ₹{product.price}
            </span>
            {product.discountedPrice && (
              <span className="text-gray-400 line-through ml-2">
                ₹{product.discountedPrice}
              </span>
            )}
          </div>
          {product.rating && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
              ⭐ {product.rating}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.isAvailable}
          className={`w-full py-2 rounded font-bold transition ${
            product.isAvailable
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.isAvailable ? 'Add to Cart' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
}