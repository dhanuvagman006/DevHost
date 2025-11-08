// components/dashboard/AddItemForm.tsx
'use client';
import { useState, FormEvent } from 'react';
import { api, getUserId } from '@/lib/api';
import { useTranslations } from 'next-intl'; // Import useTranslations

interface Props {
  userId?: string;
  onItemAdded?: () => void;
}

export function AddItemForm({ userId: propUserId, onItemAdded }: Props) {
  const t = useTranslations('AddItemForm'); // Initialize translations for this component

  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [country, setCountry] = useState('');
  const [month, setMonth] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [sales, setSales] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Nordic countries for the dropdown, now using translated labels
  const nordicCountries = [
    { value: "", label: t('countryPlaceholder') },
    { value: "denmark", label: t('countries.denmark') },
    { value: "finland", label: t('countries.finland') },
    { value: "iceland", label: t('countries.iceland') },
    { value: "norway", label: t('countries.norway') },
    { value: "sweden", label: t('countries.sweden') },
  ];

  // Month options, now using translated labels
  const monthKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const months = monthKeys.map(key => ({
    value: key,
    label: t(`months.${key}`)
  }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    setIsSuccess(false);
    
    try {
      // Get userId from props or localStorage
      const userId = propUserId || getUserId();
      if (!userId) {
        throw new Error(t('errorNoUserId')); // Translated error
      }

      const itemData = {
        product_name: productName,
        quantity: parseInt(quantity),
        country: country,
        month: parseInt(month),
        cost_price: costPrice ? parseFloat(costPrice) : undefined,
        selling_price: sellingPrice ? parseFloat(sellingPrice) : undefined,
        current_price: currentPrice ? parseFloat(currentPrice) : undefined,
        sales: sales ? parseInt(sales) : undefined,
        expiryDate: expiryDate || undefined,
      };

      console.log('📦 Adding item:', itemData);
      const response = await api.addItem(userId, itemData);
      await response.json();
      
      console.log('✅ Item added successfully');
      setMessage(t('successMessage')); // Translated message
      setIsSuccess(true);
      
      // Reset form
      setProductName('');
      setQuantity('');
      setCountry('');
      setMonth('');
      setCostPrice('');
      setSellingPrice('');
      setCurrentPrice('');
      setSales('');
      setExpiryDate('');
      
      // Call callback if provided
      if (onItemAdded) {
        onItemAdded();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage('');
        setIsSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('❌ Error adding item:', error);
      setMessage(error instanceof Error ? error.message : t('errorMessage')); // Translated message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('title')}</h3>
        <div className="text-2xl">📦</div>
      </div>
      
      {/* Product Name */}
      <div>
        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('productNameLabel')}
        </label>
        <input
          type="text"
          id="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-blue-500 focus:ring-blue-500"
          placeholder={t('productNamePlaceholder')}
          required
        />
      </div>

      {/* Country and Month */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('countryLabel')}
          </label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-blue-500 focus:ring-blue-500"
            required
          >
            {nordicCountries.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('monthLabel')}
          </label>
          <select
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">{t('monthPlaceholder')}</option>
            {months.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quantity and Sales */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('quantityLabel')}
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-blue-500 focus:ring-blue-500"
            min="0"
            required
          />
        </div>
        <div>
          <label htmlFor="sales" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('salesLabel')}
          </label>
          <input
            type="number"
            id="sales"
            value={sales}
            onChange={(e) => setSales(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-blue-500 focus:ring-blue-500"
            min="0"
            placeholder={t('salesPlaceholder')}
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('costPriceLabel')}
          </label>
          <input
            type="number"
            id="costPrice"
            step="0.01"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-blue-500 focus:ring-blue-500"
            min="0"
            placeholder={t('pricePlaceholder')}
          />
        </div>
        <div>
          <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('sellingPriceLabel')}
          </label>
          <input
            type="number"
            id="sellingPrice"
            step="0.01"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-blue-500 focus:ring-blue-500"
            min="0"
            placeholder={t('pricePlaceholder')}
          />
        </div>
        <div>
          <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('currentPriceLabel')}
          </label>
          <input
            type="number"
            id="currentPrice"
            step="0.01"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-blue-500 focus:ring-blue-500"
            min="0"
            placeholder={t('pricePlaceholder')}
          />
        </div>
      </div>

      {/* Expiry Date */}
      <div>
        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('expiryDateLabel')}
        </label>
        <input
          type="date"
          id="expiryDate"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>{t('buttonLoadingText')}</span>
          </div>
        ) : (
          t('buttonText')
        )}
      </button>
      
      {message && (
        <div className={`text-sm text-center p-2 rounded ${
          isSuccess 
            ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20' 
            : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
        }`}>
          {message}
        </div>
      )}
    </form>
  );
}