import React, { useState } from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Carousel, { CarouselSlide } from '@/components/Carousel';
import RestaurantSummaryCard from '@/components/RestaurantSummaryCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const placeholderCarouselSlides: CarouselSlide[] = [
  { id: 1, imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80', altText: 'Delicious Food Banner', content: <h2 className="text-3xl font-bold">Explore Local Delights</h2> },
  { id: 2, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80', altText: 'Special Offers', content: <h2 className="text-3xl font-bold">Today's Special Offers!</h2> },
];

const placeholderRestaurants = [
  { id: '1', name: 'The Green Leaf Eatery', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80', cuisineTypes: ['Italian', 'Pizza', 'Pasta'], rating: 4.5, deliveryTime: '25-35 min', isNew: true },
  { id: '2', name: 'Spice Fusion Grill', imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80', cuisineTypes: ['Indian', 'Curry', 'Tandoori'], rating: 4.8, deliveryTime: '30-40 min' },
  { id: '3', name: 'Ocean Basket Sushi', imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80', cuisineTypes: ['Japanese', 'Sushi', 'Seafood'], rating: 4.3, deliveryTime: '20-30 min' },
  { id: '4', name: 'Burger Barn', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80', cuisineTypes: ['American', 'Burgers', 'Fries'], rating: 4.0, deliveryTime: '35-45 min', isNew: true },
];

const cuisineCategories = ['All', 'Italian', 'Indian', 'Japanese', 'Burgers', 'Vegan'];

const RestaurantDiscoveryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const navigate = useNavigate();
  console.log('RestaurantDiscoveryPage loaded');

  const handleRestaurantClick = (id: string | number) => {
    navigate(`/menu/${id}`);
  };

  const filteredRestaurants = placeholderRestaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCuisine === 'All' || restaurant.cuisineTypes.some(c => c.toLowerCase() === selectedCuisine.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu cartItemCount={3} isLoggedIn={false} />
      <main className="flex-grow">
        <section className="mb-8">
          <Carousel slides={placeholderCarouselSlides} autoplayDelay={5000} />
        </section>

        <section className="container mx-auto px-4 py-6">
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Find Your Next Meal</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search restaurants or cuisines..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {cuisineCategories.map(cuisine => (
                <Badge
                  key={cuisine}
                  variant={selectedCuisine === cuisine ? 'default' : 'secondary'}
                  className="cursor-pointer px-3 py-1 text-sm"
                  onClick={() => setSelectedCuisine(cuisine)}
                >
                  {cuisine}
                </Badge>
              ))}
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            {selectedCuisine === 'All' ? 'Popular Restaurants' : `${selectedCuisine} Restaurants`}
          </h3>
          {filteredRestaurants.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-400px)] pr-3"> {/* Adjust height as needed */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRestaurants.map(restaurant => (
                  <RestaurantSummaryCard
                    key={restaurant.id}
                    {...restaurant}
                    onClick={handleRestaurantClick}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-center text-gray-500 py-8">No restaurants found matching your criteria.</p>
          )}
        </section>
      </main>
      <footer className="text-center p-4 border-t text-sm text-gray-500">
        © {new Date().getFullYear()} FoodFleet. All rights reserved.
      </footer>
    </div>
  );
};

export default RestaurantDiscoveryPage;