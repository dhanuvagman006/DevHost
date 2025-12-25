"use client"

import React, { useState, useMemo } from 'react';
import CardNav from '@/components/CardNav';
import Aurora from "@/components/Aurora";
import { ShoppingBag, CreditCard, Banknote, RefreshCcw, Plus, Minus, Trash2 } from 'lucide-react';

// --- TYPE DEFINITIONS ---
type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image?: string; // Optional image placeholder
};

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

// --- MOCK DATA ---
const products: Product[] = [
  { id: 1, name: "Espresso", price: 3.50, category: "Coffee" },
  { id: 2, name: "Latte", price: 5.00, category: "Coffee" },
  { id: 3, name: "Cappuccino", price: 4.75, category: "Coffee" },
  { id: 4, name: "Filter Coffee", price: 4.00, category: "Coffee" },
  { id: 5, name: "Croissant", price: 3.75, category: "Pastry" },
  { id: 6, name: "Muffin", price: 3.25, category: "Pastry" },
  { id: 7, name: "Sandwich", price: 8.50, category: "Food" },
  { id: 8, name: "Salad", price: 9.00, category: "Food" },
  { id: 9, name: "Mineral Water", price: 2.50, category: "Drinks" },
  { id: 10, name: "Orange Juice", price: 4.50, category: "Drinks" },
  { id: 11, name: "Green Tea", price: 3.00, category: "Coffee" },
  { id: 12, name: "Brownie", price: 4.25, category: "Pastry" },
];

// --- COMPONENTS ---

const GlassCard = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div
    onClick={onClick}
    className={`relative overflow-hidden bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ${className}`}
  >
    {children}
  </div>
);

const ProductCard = ({ product, onAddToCart }: { product: Product; onAddToCart: (p: Product) => void }) => (
  <button
    onClick={() => onAddToCart(product)}
    className="group flex flex-col items-start justify-between p-6 w-full h-40 rounded-3xl bg-white/60 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-md hover:bg-white/80 hover:scale-[1.02] transition-all duration-200 text-left"
  >
    <div className="space-y-1">
      <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">{product.category}</span>
      <h3 className="text-xl font-bold text-[#1D1D1F] leading-tight group-hover:text-[#3A29FF] transition-colors">{product.name}</h3>
    </div>
    <div className="w-full flex justify-between items-end">
      <span className="text-2xl font-medium text-[#1D1D1F]">${product.price.toFixed(2)}</span>
      <div className="h-8 w-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#1D1D1F] group-hover:bg-[#3A29FF] group-hover:text-white transition-colors">
        <Plus size={16} strokeWidth={3} />
      </div>
    </div>
  </button>
);

const CartItemRow = ({ item, onUpdate }: { item: CartItem, onUpdate: (id: number, delta: number) => void }) => (
  <div className="flex items-center justify-between p-4 mb-2 rounded-2xl bg-white/40 border border-white/50 hover:bg-white/60 transition-colors">
    <div className="flex-1">
      <h4 className="font-semibold text-[#1D1D1F]">{item.name}</h4>
      <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
    </div>

    <div className="flex items-center gap-3">
      <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-100 p-1">
        <button
          onClick={(e) => { e.stopPropagation(); onUpdate(item.id, -1); }}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500 hover:text-red-500"
        >
          {item.quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
        </button>
        <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onUpdate(item.id, 1); }}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500 hover:text-[#3A29FF]"
        >
          <Plus size={16} />
        </button>
      </div>
      <span className="font-bold text-[#1D1D1F] w-16 text-right">
        ${(item.price * item.quantity).toFixed(2)}
      </span>
    </div>
  </div>
);

const PaymentModal = ({ isOpen, total, onClose }: { isOpen: boolean; total: number; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm p-8 rounded-[40px] bg-white shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="h-20 w-20 rounded-full bg-[#00F2A9]/20 flex items-center justify-center text-[#00F2A9]">
            <ShoppingBag size={40} />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-[#1D1D1F]">Payment Success</h2>
            <p className="text-gray-500">Transaction completed successfully.</p>
          </div>

          <div className="w-full py-4 border-y border-gray-100">
            <div className="flex justify-between text-lg">
              <span className="text-gray-500">Total Paid</span>
              <span className="font-bold text-[#1D1D1F]">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-[#1D1D1F] text-white font-bold text-lg hover:scale-105 hover:bg-black transition-all duration-200 shadow-lg"
          >
            Start New Order
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

export default function PosPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      return existing
        ? prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(p => p.category === selectedCategory);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <div className="relative min-h-screen bg-[#F5F5F7] font-sans antialiased text-[#1D1D1F] selection:bg-[#00F2A9] selection:text-black">

      {/* Background Aurora */}
      <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
        <Aurora colorStops={["#00F2A9", "#3A29FF", "#FF94B4"]} blend={0.6} amplitude={0.5} speed={0.3} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <CardNav />

        <main className="flex-1 w-full max-w-[1800px] mx-auto p-4 md:p-6 lg:p-10 pt-24">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-140px)]">

            {/* --- LEFT: PRODUCT GRID --- */}
            <div className="lg:col-span-8 flex flex-col h-full gap-6">

              {/* Header & Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#1D1D1F]">Point of Sale</h1>
                  <p className="text-gray-500">Select items to add to order</p>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap
                                        ${selectedCategory === cat
                          ? 'bg-[#1D1D1F] text-white shadow-lg'
                          : 'bg-white/50 text-gray-500 hover:bg-white hover:text-[#1D1D1F]'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Grid */}
              <div className="flex-1 overflow-y-auto pr-2 pb-20 lg:pb-0">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                  ))}
                </div>
              </div>
            </div>

            {/* --- RIGHT: CART SIDEBAR --- */}
            <div className="lg:col-span-4 h-full">
              <GlassCard className="h-full flex flex-col rounded-[32px] border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.05)]">

                {/* Cart Header */}
                <div className="p-6 border-b border-gray-100/50 flex justify-between items-center bg-white/40">
                  <div>
                    <h2 className="text-xl font-bold text-[#1D1D1F]">Current Order</h2>
                    <span className="text-sm text-gray-400">Order #20349</span>
                  </div>
                  <button
                    onClick={() => setCart([])}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                    title="Clear Cart"
                  >
                    <RefreshCcw size={18} />
                  </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 opacity-50">
                      <ShoppingBag size={48} strokeWidth={1} />
                      <p>Cart is empty</p>
                    </div>
                  ) : (
                    cart.map(item => <CartItemRow key={item.id} item={item} onUpdate={handleUpdateQuantity} />)
                  )}
                </div>

                {/* Totals & Actions */}
                <div className="p-6 bg-white/50 border-t border-gray-100/50 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Tax (5%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold text-[#1D1D1F] pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => cart.length > 0 && setIsModalOpen(true)}
                      disabled={cart.length === 0}
                      className="col-span-2 py-4 rounded-2xl bg-[#1D1D1F] text-white font-bold text-lg shadow-xl hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      Charge ${total.toFixed(2)}
                    </button>

                    <button className="py-3 rounded-xl bg-white border border-gray-200 font-semibold text-[#1D1D1F] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <CreditCard size={18} /> Card
                    </button>
                    <button className="py-3 rounded-xl bg-white border border-gray-200 font-semibold text-[#1D1D1F] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <Banknote size={18} /> Cash
                    </button>
                  </div>
                </div>
              </GlassCard>
            </div>

          </div>
        </main>

        <PaymentModal
          isOpen={isModalOpen}
          total={total}
          onClose={() => { setIsModalOpen(false); setCart([]); }}
        />
      </div>
    </div>
  );
}