import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PlusCircle, MinusCircle, Tag } from 'lucide-react'; // Tag for price

interface MenuItemCardProps {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  onAddToCart: (id: string | number) => void;
  onViewDetails?: (id: string | number) => void; // Optional: for opening a dialog with more info/customization
  // Optional: For quantity adjustment directly on card
  quantityInCart?: number;
  onIncrementQuantity?: (id: string | number) => void;
  onDecrementQuantity?: (id: string | number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  onAddToCart,
  onViewDetails,
  quantityInCart,
  onIncrementQuantity,
  onDecrementQuantity,
}) => {
  console.log("Rendering MenuItemCard:", name);

  return (
    <Card className="w-full flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-md">
      {imageUrl && (
        <CardHeader className="p-0">
          <AspectRatio ratio={16 / 9} onClick={() => onViewDetails && onViewDetails(id)} className={onViewDetails ? "cursor-pointer" : ""}>
            <img
              src={imageUrl}
              alt={name}
              className="object-cover w-full h-full"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} // Hide if image fails
            />
          </AspectRatio>
        </CardHeader>
      )}
      <CardContent className="p-4 space-y-2 flex-grow">
        <CardTitle
            className={`text-md font-semibold ${onViewDetails ? "cursor-pointer hover:underline" : ""}`}
            onClick={() => onViewDetails && onViewDetails(id)}
        >
            {name}
        </CardTitle>
        {description && <p className="text-xs text-gray-600 line-clamp-2">{description}</p>}
      </CardContent>
      <CardFooter className="p-3 pt-0 flex items-center justify-between">
        <div className="flex items-center text-lg font-semibold text-orange-600">
            <Tag className="h-4 w-4 mr-1 text-gray-500" />
            ${price.toFixed(2)}
        </div>
        {quantityInCart && quantityInCart > 0 && onIncrementQuantity && onDecrementQuantity ? (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onDecrementQuantity(id)}>
              <MinusCircle className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{quantityInCart}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onIncrementQuantity(id)}>
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button size="sm" onClick={() => onAddToCart(id)}>
            Add
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
export default MenuItemCard;