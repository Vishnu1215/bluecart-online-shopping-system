import React, { useState } from 'react';
import { 
  Headphones, Watch, Smartphone, Laptop, Camera, ShoppingBag, 
  BatteryCharging, Box, Sparkles, ImageOff 
} from 'lucide-react';
import { ProductCategory } from '../../types';
import { resolveProductImage } from '../../utils/productImages';

interface ProductImageProps {
  category?: ProductCategory | string;
  imageKey?: string;
  src?: string;
  alt?: string;
  productId?: string;
  className?: string;
  perspective?: 'main' | 'detail' | 'feature' | 'box';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  objectFit?: 'cover' | 'contain';
}

const pastelPalette: Record<string, { bg: string; text: string }> = {
  'Audio': { bg: 'bg-indigo-50/60 dark:bg-indigo-950/40', text: 'text-indigo-600 dark:text-indigo-400' },
  'Wearables': { bg: 'bg-cyan-50/60 dark:bg-cyan-950/40', text: 'text-cyan-600 dark:text-cyan-400' },
  'Footwear': { bg: 'bg-amber-50/60 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400' },
  'Mobiles': { bg: 'bg-blue-50/60 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-400' },
  'Computers': { bg: 'bg-purple-50/60 dark:bg-purple-950/40', text: 'text-purple-600 dark:text-purple-400' },
  'Cameras': { bg: 'bg-rose-50/60 dark:bg-rose-950/40', text: 'text-rose-600 dark:text-rose-400' },
  'Bags': { bg: 'bg-emerald-50/60 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400' }
};

export const ProductImage: React.FC<ProductImageProps> = ({
  category = 'Audio',
  imageKey = '',
  src,
  alt = 'Product picture',
  productId,
  className = '',
  perspective = 'main',
  size = 'md',
  objectFit = 'cover'
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const palette = pastelPalette[category] || pastelPalette['Audio'];

  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-24 h-24 text-base',
    lg: 'w-48 h-48 text-xl',
    xl: 'w-full aspect-square max-h-96'
  }[size];

  const imageUrl = resolveProductImage(src || imageKey, category, perspective, productId);

  const getPerspectiveBadge = () => {
    switch (perspective) {
      case 'detail':
        return (
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200/50 backdrop-blur-xs flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-indigo-500" /> Detail 360°
          </span>
        );
      case 'feature':
        return (
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200/50 backdrop-blur-xs flex items-center gap-1">
            <BatteryCharging className="w-3 h-3 text-emerald-500" /> Battery/Specs
          </span>
        );
      case 'box':
        return (
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200/50 backdrop-blur-xs flex items-center gap-1">
            <Box className="w-3 h-3 text-blue-500" /> Retail Box
          </span>
        );
      default:
        return null;
    }
  };

  const renderFallbackIcon = () => {
    const key = (imageKey || category).toLowerCase();
    if (key.includes('headphone') || category === 'Audio') {
      return <Headphones className="w-1/2 h-1/2 opacity-70" />;
    }
    if (key.includes('watch') || category === 'Wearables') {
      return <Watch className="w-1/2 h-1/2 opacity-70" />;
    }
    if (key.includes('laptop') || category === 'Computers') {
      return <Laptop className="w-1/2 h-1/2 opacity-70" />;
    }
    if (key.includes('camera') || category === 'Cameras') {
      return <Camera className="w-1/2 h-1/2 opacity-70" />;
    }
    if (key.includes('phone') || category === 'Mobiles') {
      return <Smartphone className="w-1/2 h-1/2 opacity-70" />;
    }
    return <ShoppingBag className="w-1/2 h-1/2 opacity-70" />;
  };

  return (
    <div
      className={`group relative rounded-[10px] flex items-center justify-center overflow-hidden transition-all duration-300 border border-slate-200/70 dark:border-slate-800 ${palette.bg} ${sizeClasses} ${className}`}
    >
      {!imageError ? (
        <>
          {/* Skeleton Placeholder while loading */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-slate-200/60 dark:bg-slate-800/60 animate-pulse flex items-center justify-center">
              {renderFallbackIcon()}
            </div>
          )}
          <img
            src={imageUrl}
            alt={alt}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full ${
              objectFit === 'contain' ? 'object-contain p-2' : 'object-cover'
            } transition-all duration-500 group-hover:scale-105 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-3 text-center text-slate-400">
          {renderFallbackIcon()}
          <span className="text-[10px] mt-1 font-medium">{category}</span>
        </div>
      )}

      {getPerspectiveBadge()}
    </div>
  );
};
