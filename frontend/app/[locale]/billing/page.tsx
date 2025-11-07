"use client"

import React, { useState, useMemo } from 'react';
// Assuming ProtectedRoute is in this path
// import { ProtectedRoute } from '@/components/ProtectedRoute';

// --- TYPE DEFINITIONS ---

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
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
  { id: 11, name: "Tea", price: 3.00, category: "Coffee" },
  { id: 12, name: "Brownie", price: 4.25, category: "Pastry" },
];

// --- STYLES ---
// Button styles remain unchanged as requested, using Aurora colors.

const btnBase = "w-full py-3 px-6 rounded-lg font-bold transition-all duration-300 ease-in-out whitespace-nowrap";

// This gradient is not in the new palette, but we'll keep it as it's part of the "action" buttons
const btnPrimary = `${btnBase} bg-gradient-to-r from-[#8A2387] via-[#E94057] to-[#F27121] text-white bg-size-200 bg-pos-0 hover:bg-pos-100`;

// Using --color-primary-green
const btnSecondary = `${btnBase} bg-[var(--color-primary-green)] text-black hover:shadow-[0_0_15px_5px_rgba(0,242,169,0.3)] hover:-translate-y-0.5`;

// Using --color-primary-purple
const btnSecondaryAlt = `${btnBase} bg-[var(--color-primary-purple)] text-white hover:shadow-[0_0_15px_5px_rgba(147,88,247,0.3)] hover:-translate-y-0.5`;

// --- GLOBAL STYLES COMPONENT ---
/**
 * Injects the new CSS variables and card styles into the document head.
 */
const ThemeStyles = () => (
  <style>{`
    :root {
      /* Backgrounds (White Theme) */
      --color-bg-night: #FFFFFF;
      --color-bg-surface: #F8F9FA;

      /* Text & Accents */
      --color-text-primary: #1A1A1A;
      --color-text-secondary: #6B7280;
      --color-border: #E5E7EB;

      /* Aurora Action Colors */
      --color-primary-green: #00F2A9;
      --color-primary-purple: #9358F7;
      --color-primary-pink: #E040FB;
    }

    /* Updated Card Component (Light Mode) */
    .card {
      background: rgba(255, 255, 255, 0.7); /* White glass */
      backdrop-filter: blur(10px);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* soft elevation */
    }
  `}</style>
);


// --- CHILD COMPONENTS ---

/**
 * ProductCard: Displays a single clickable product.
 * Updated to use the new .card class and text variables.
 */
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // Merges the new .card class with layout and interaction classes.
  const cardStyle = "card p-4 text-center cursor-pointer transition-all duration-300 hover:border-[var(--color-primary-green)] hover:-translate-y-1";

  return (
    <div className={cardStyle} onClick={() => onAddToCart(product)}>
      <h3 className="text-xl font-bold text-[var(--color-text-primary)]">{product.name}</h3>
      <p className="text-lg text-[var(--color-primary-green)]">${product.price.toFixed(2)}</p>
    </div>
  );
};

/**
 * PaymentModal: Shows a success message after charging.
 * Updated to use the new .card class, text variables, and a lighter backdrop.
 */
interface PaymentModalProps {
  isOpen: boolean;
  total: number;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, total, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 mt-22" style={{ backdropFilter: 'blur(10px)' }} >
      {/* Light-mode modal card */}
      <div className="card p-8 text-center max-w-sm w-full">
        {/* Aurora Green Checkmark SVG (Unchanged) */}
        <svg className="w-16 h-16 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="var(--color-primary-green)"/>
        </svg>
        <h2 className="text-3xl font-bold mt-4 text-[var(--color-text-primary)]">Payment Successful</h2>
        <p className="text-lg mt-2 text-[var(--color-text-secondary)]">
          Total Charged: <strong className="text-[var(--color-text-primary)]">${total.toFixed(2)}</strong>
        </p>
        <button className={`${btnSecondary} mt-6`} onClick={onClose}>
          New Order
        </button>
      </div>
    </div>
  );
};

/**
 * A placeholder for the ProtectedRoute component.
 * This is just to make the file runnable for demonstration.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In a real app, this would check auth status
  return <>{children}</>;
};


/**
 * Main App Component: The entire POS system.
 * Updated with new background, surface, text, and border colors.
 */
export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- CART LOGIC (Unchanged) ---

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // Increment quantity
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Add new item
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCharge = () => {
    if (cart.length === 0) return; // Don't charge on empty cart
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    handleClearCart();
  };

  // --- MEMOIZED CALCULATIONS (Unchanged) ---

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const tax = useMemo(() => subtotal * 0.05, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  return (
    <>
      {/* Injects the new theme variables and styles */}
      <ThemeStyles />
      
      <ProtectedRoute>
        {/* Main container uses new theme variables for bg and text */}
        <div className="w-full h-screen bg-[var(--color-bg-night)] text-[var(--color-text-secondary)] font-sans overflow-hidden grid grid-cols-1 lg:grid-cols-3">
          
          {/* === Product Grid (Left Column) === */}
          <main className="lg:col-span-2 p-6 md:p-8 h-screen overflow-y-auto mt-22">
            <header className="mb-6">
              <h1 className="text-4xl font-extrabold text-[var(--color-text-primary)]">Products</h1>
            </header>
            
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </main>

          {/* === Cart/Bill (Right Column) === */}
          {/* Aside uses the new surface color */}
          <aside className="lg:col-span-1 bg-[var(--color-bg-surface)] h-screen flex flex-col mt-24">
            
            {/* Order Header uses new border and text color */}
            <header className="p-6 border-b border-[var(--color-border)]">
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Current Order</h2>
            </header>
            
            {/* Cart Items use new text colors */}
            <div className="flex-grow p-6 space-y-4 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-lg">No items in order.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-bold text-[var(--color-text-primary)]">{item.name}</h4>
                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-lg font-bold text-[var(--color-text-primary)]">
                      €{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
            
            {/* Order Summary uses new border and text colors */}
            <div className="p-6 border-t border-[var(--color-border)] space-y-3">
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span className="text-[var(--color-text-primary)]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Tax (5%)</span>
                <span className="text-[var(--color-text-primary)]">${tax.toFixed(2)}</span>
              </div>
              {/* Total uses accent green, which is unchanged and correct */}
              <div className="flex justify-between text-3xl font-extrabold text-[var(--color-primary-green)]">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Payment Controls (Unchanged) */}
            <div className="p-6 grid grid-cols-2 gap-4">
              <button className={btnPrimary} onClick={handleCharge}>
                Charge
              </button>
              <button className={btnSecondary}>Pay by Card</button>
              <button className={btnSecondaryAlt}>Pay by Cash</button>
            </div>
          </aside>
        </div>

        {/* --- Payment Modal --- */}
        <PaymentModal
          isOpen={isModalOpen}
          total={total}
          onClose={handleCloseModal}
        />
      </ProtectedRoute>
    </>
  );
}