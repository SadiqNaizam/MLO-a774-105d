import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import MenuItemCard from '@/components/MenuItemCard';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, Clock, ShoppingBasket } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

// Placeholder data - in a real app, this would come from an API based on restaurantId
const placeholderRestaurantDetails = {
  id: '1',
  name: 'The Green Leaf Eatery',
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/857/857681.png', // Generic restaurant icon
  rating: 4.5,
  deliveryTime: '25-35 min',
  cuisine: 'Italian',
  menu: {
    appetizers: [
      { id: 'a1', name: 'Bruschetta', description: 'Grilled bread rubbed with garlic and topped with olive oil and salt.', price: 8.99, imageUrl: 'https://images.unsplash.com/photo-1505253758473-967998758428?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80' },
      { id: 'a2', name: 'Caprese Salad', description: 'Simple Italian salad, made of sliced fresh mozzarella, tomatoes, and sweet basil.', price: 10.50, imageUrl: 'https://images.unsplash.com/photo-1579299705101-ac75159bd522?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80' },
    ],
    main_courses: [
      { id: 'm1', name: 'Margherita Pizza', description: 'Classic delight with 100% real mozzarella cheese.', price: 15.00, imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80' },
      { id: 'm2', name: 'Pasta Carbonara', description: 'Spaghetti with creamy egg sauce, pancetta, and pecorino cheese.', price: 18.75, imageUrl: 'https://images.unsplash.com/photo-1612874742237-6b82a1a1d1bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80' },
    ],
    drinks: [
        { id: 'd1', name: 'Mineral Water', description: 'Refreshing spring water.', price: 2.00, imageUrl: 'https://images.unsplash.com/photo-1561065371-e82cbf0a055d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80' },
        { id: 'd2', name: 'Orange Juice', description: 'Freshly squeezed orange juice.', price: 4.50, imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80' },
    ]
  }
};
// Add other restaurants for dynamic loading if needed
const allRestaurantsData: Record<string, typeof placeholderRestaurantDetails> = {
    '1': placeholderRestaurantDetails,
    '2': {
        id: '2', name: 'Spice Fusion Grill', logoUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448609.png', rating: 4.8, deliveryTime: '30-40 min', cuisine: 'Indian', menu: {
            appetizers: [{ id: 'sfa1', name: 'Samosa', description: 'Crispy pastry with spiced potatoes and peas.', price: 6.00, imageUrl: 'https://plus.unsplash.com/premium_photo-1669017098138-338413710494?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80'}],
            main_courses: [{ id: 'sfm1', name: 'Butter Chicken', description: 'Creamy tomato-based curry with tender chicken.', price: 19.50, imageUrl: 'https://images.unsplash.com/photo-1609422094020-098b0ed818f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80'}],
            drinks: [{id: 'sfd1', name: 'Mango Lassi', description: 'Yogurt based mango milkshake.', price: 5.00, imageUrl: 'https://images.unsplash.com/photo-1600790504605-79ff89a69f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80'}]
        }
    },
     '3': {
        id: '3', name: 'Ocean Basket Sushi', logoUrl: 'https://cdn-icons-png.flaticon.com/512/2771/2771395.png', rating: 4.3, deliveryTime: '20-30 min', cuisine: 'Japanese', menu: {
            appetizers: [{ id: 'oba1', name: 'Edamame', description: 'Steamed soybeans with sea salt.', price: 5.50, imageUrl: 'https://images.unsplash.com/photo-1522650979749-77495849b103?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80'}],
            main_courses: [{ id: 'obm1', name: 'Salmon Nigiri Set', description: '6 pieces of fresh salmon nigiri.', price: 22.00, imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80'}],
            drinks: [{id: 'obd1', name: 'Green Tea', description: 'Authentic Japanese green tea.', price: 3.00, imageUrl: 'https://images.unsplash.com/photo-1627435601361-ec25f3c8d075?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80'}]
        }
    },
      '4': {
        id: '4', name: 'Burger Barn', logoUrl: 'https://cdn-icons-png.flaticon.com/512/198/198416.png', rating: 4.0, deliveryTime: '35-45 min', cuisine: 'American', menu: {
            appetizers: [{ id: 'bba1', name: 'Onion Rings', description: 'Crispy fried onion rings.', price: 7.00, imageUrl: 'https://images.unsplash.com/photo-1541592106381-b58e75a4c956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80'}],
            main_courses: [{ id: 'bbm1', name: 'Classic Cheeseburger', description: 'Beef patty, cheese, lettuce, tomato, onion.', price: 12.99, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80'}],
            drinks: [{id: 'bbd1', name: 'Cola', description: 'Classic cola drink.', price: 2.50, imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80'}]
        }
    }
};


interface MenuItem {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

interface CartItem extends MenuItem {
    quantity: number;
}

const RestaurantMenuPage = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isItemDialogVisible, setIsItemDialogVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  console.log(`RestaurantMenuPage loaded for restaurant ID: ${restaurantId}`);

  const restaurant = restaurantId ? allRestaurantsData[restaurantId] : null;

  if (!restaurant) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavigationMenu cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
        <main className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Restaurant not found.</h1>
          <Link to="/"><Button className="mt-4">Back to Discovery</Button></Link>
        </main>
      </div>
    );
  }

  const handleAddToCart = (itemId: string | number) => {
    const itemToAdd = Object.values(restaurant.menu).flat().find(item => item.id === itemId);
    if (!itemToAdd) return;

    setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === itemId);
        if (existingItem) {
            return prevCart.map(item => item.id === itemId ? {...item, quantity: item.quantity + 1} : item);
        }
        return [...prevCart, {...itemToAdd, quantity: 1}];
    });
    toast({
        title: "Added to cart!",
        description: `${itemToAdd.name} has been added to your cart.`,
    });
  };
  
  const handleViewDetails = (itemId: string | number) => {
    const itemDetails = Object.values(restaurant.menu).flat().find(item => item.id === itemId);
    if (itemDetails) {
        setSelectedItem(itemDetails);
        setIsItemDialogVisible(true);
    }
  };

  const handleIncrementQuantity = (itemId: string | number) => {
     setCart(prevCart => prevCart.map(item => item.id === itemId ? {...item, quantity: item.quantity + 1} : item));
  };

  const handleDecrementQuantity = (itemId: string | number) => {
      setCart(prevCart => {
          const existingItem = prevCart.find(item => item.id === itemId);
          if (existingItem && existingItem.quantity > 1) {
              return prevCart.map(item => item.id === itemId ? {...item, quantity: item.quantity -1} : item);
          }
          return prevCart.filter(item => item.id !== itemId); // Remove if quantity becomes 0
      });
  };


  const menuCategories = Object.keys(restaurant.menu);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu cartItemCount={cartItemCount} isLoggedIn={true} />
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Discover</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{restaurant.name}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="mb-8 p-6 bg-white rounded-lg shadow-md flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-2 border-orange-500">
            <AvatarImage src={restaurant.logoUrl} alt={restaurant.name} />
            <AvatarFallback>{restaurant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">{restaurant.name}</h1>
            <p className="text-lg text-gray-600">{restaurant.cuisine}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1 text-yellow-500"><Star className="h-4 w-4" /> {restaurant.rating.toFixed(1)}</span>
              <span className="flex items-center gap-1 text-gray-500"><Clock className="h-4 w-4" /> {restaurant.deliveryTime}</span>
            </div>
          </div>
          <Link to="/cart" className="ml-auto mt-4 sm:mt-0">
            <Button variant="outline" className="relative">
                <ShoppingBasket className="mr-2 h-5 w-5" />
                View Cart
                {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                    </span>
                )}
            </Button>
          </Link>
        </header>

        <Tabs defaultValue={menuCategories[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 bg-white p-2 rounded-lg shadow">
            {menuCategories.map(category => (
              <TabsTrigger key={category} value={category} className="capitalize data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                {category.replace('_', ' ')}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollArea className="mt-2 h-[calc(100vh-350px)] sm:h-[calc(100vh-320px)]"> {/* Adjust height */}
            {menuCategories.map(category => (
              <TabsContent key={category} value={category} className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {(restaurant.menu[category as keyof typeof restaurant.menu] as MenuItem[]).map(item => {
                    const cartItem = cart.find(ci => ci.id === item.id);
                    return (
                        <MenuItemCard
                        key={item.id}
                        {...item}
                        onAddToCart={handleAddToCart}
                        onViewDetails={handleViewDetails}
                        quantityInCart={cartItem?.quantity}
                        onIncrementQuantity={handleIncrementQuantity}
                        onDecrementQuantity={handleDecrementQuantity}
                        />
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </main>

      {selectedItem && (
        <Dialog open={isItemDialogVisible} onOpenChange={setIsItemDialogVisible}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedItem.name}</DialogTitle>
              {selectedItem.imageUrl && <img src={selectedItem.imageUrl} alt={selectedItem.name} className="my-4 rounded-lg max-h-48 w-full object-cover"/>}
              <DialogDescription>
                {selectedItem.description || "No additional details available."}
              </DialogDescription>
            </DialogHeader>
            <p className="text-lg font-semibold">Price: ${selectedItem.price.toFixed(2)}</p>
            {/* Add customization options here if needed */}
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsItemDialogVisible(false)}>Close</Button>
              <Button type="button" onClick={() => { handleAddToCart(selectedItem.id); setIsItemDialogVisible(false); }}>Add to Cart</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <footer className="text-center p-4 border-t text-sm text-gray-500 mt-auto">
        Enjoy your meal from {restaurant.name}!
      </footer>
    </div>
  );
};

export default RestaurantMenuPage;