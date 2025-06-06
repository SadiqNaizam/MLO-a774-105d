import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star, Clock, Salad } from 'lucide-react'; // Example icons

interface RestaurantSummaryCardProps {
  id: string | number;
  name: string;
  imageUrl: string;
  cuisineTypes: string[];
  rating: number; // e.g., 4.5
  deliveryTime: string; // e.g., "25-35 min"
  onClick?: (id: string | number) => void;
  isNew?: boolean;
}

const RestaurantSummaryCard: React.FC<RestaurantSummaryCardProps> = ({
  id,
  name,
  imageUrl,
  cuisineTypes,
  rating,
  deliveryTime,
  onClick,
  isNew,
}) => {
  console.log("Rendering RestaurantSummaryCard:", name);

  return (
    <Card
      className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={() => onClick && onClick(id)}
    >
      <CardHeader className="p-0 relative">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={name}
            className="object-cover w-full h-full"
            onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
          />
        </AspectRatio>
        {isNew && (
          <Badge variant="destructive" className="absolute top-2 right-2">NEW</Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-1">
        <h3 className="text-lg font-semibold truncate" title={name}>{name}</h3>
        <div className="flex items-center text-sm text-gray-600 space-x-1">
          <Salad className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span className="truncate">
            {cuisineTypes.slice(0, 3).join(', ')}{cuisineTypes.length > 3 ? '...' : ''}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm text-gray-500 border-t mt-2">
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-500" />
          <span>{rating.toFixed(1)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>{deliveryTime}</span>
        </div>
      </CardFooter>
    </Card>
  );
};
export default RestaurantSummaryCard;