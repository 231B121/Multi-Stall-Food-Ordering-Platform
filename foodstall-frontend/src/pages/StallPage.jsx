import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { stallAPI, categoryAPI, productAPI } from '../services/api';
import { CartContext } from '../contexts/CartContext';
import { ProductCard } from '../components/ProductCard';
import { CategoryFilter } from '../components/CategoryFilter';

export function StallPage() {
  const { slug } = useParams();
  const { getTotalItems } = useContext(CartContext);

  const [stall, setStall] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stall data
  useEffect(() => {
    const fetchStall = async () => {
      try {
        setLoading(true);
        const response = await stallAPI.getBySlug(slug);
        setStall(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load stall');
      } finally {
        setLoading(false);
      }
    };

    fetchStall();
  }, [slug]);

  // Fetch categories when stall loads
  useEffect(() => {
    if (!stall) return;

    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getByStall(stall._id);
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };

    fetchCategories();
  }, [stall]);

  // Fetch products when stall or category changes
  useEffect(() => {
    if (!stall) return;

    const fetchProducts = async () => {
      try {
        const response = await productAPI.getByStall(stall._id, selectedCategoryId);
        setProducts(response.data);
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    };

    fetchProducts();
  }, [stall, selectedCategoryId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stall...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Oops!</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!stall) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Stall not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{stall.name}</h1>
            <p className="text-gray-600 text-sm">{stall.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">🛒 {getTotalItems()}</div>
            <p className="text-sm text-gray-600">items in cart</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stall Info */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Phone</p>
              <p className="font-bold">{stall.phone}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Rating</p>
              <p className="font-bold">⭐ {stall.rating}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Status</p>
              <p className={`font-bold ${stall.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                {stall.isOpen ? '🟢 Open' : '🔴 Closed'}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Orders</p>
              <p className="font-bold">{stall.totalOrders}</p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        )}

        {/* Products Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {selectedCategoryId
              ? categories.find((c) => c._id === selectedCategoryId)?.name
              : 'All Items'}
          </h2>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}