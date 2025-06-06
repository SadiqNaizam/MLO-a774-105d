import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, PlusCircle, MinusCircle, Tag, ShoppingBag } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

const initialCartItems: CartItem[] = [
  { id: 'm1', name: 'Margherita Pizza', price: 15.00, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80' },
  { id: 'a2', name: 'Caprese Salad', price: 10.50, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1579299705101-ac75159bd522?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80' },
  { id: 'd1', name: 'Mineral Water', price: 2.00, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1561065371-e82cbf0a055d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80' },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  console.log('CartPage loaded');

  const updateQuantity = (id: string | number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      setCartItems(prevItems => prevItems.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    }
  };

  const removeItem = (id: string | number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast({ title: "Item removed", description: "The item has been removed from your cart." });
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const deliveryFee = cartItems.length > 0 ? 5.00 : 0; // Example fixed delivery fee
  const taxes = subtotal * 0.1; // Example 10% tax
  const total = subtotal + deliveryFee + taxes;
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleApplyPromoCode = () => {
    if (promoCode.toUpperCase() === "FOODFLEET10") {
        toast({ title: "Promo Applied!", description: "10% discount applied (placeholder)." });
        // Actual discount logic would be applied here
    } else {
        toast({ title: "Invalid Promo Code", variant: "destructive" });
    }
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
        toast({ title: "Empty Cart", description: "Please add items to your cart before proceeding to checkout.", variant: "destructive"});
        return;
    }
    navigate('/checkout');
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavigationMenu cartItemCount={cartItemCount} isLoggedIn={true} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="shadow-xl">
          <CardHeader className="border-b">
            <CardTitle className="text-3xl font-bold text-gray-800 flex items-center">
                <ShoppingBag className="mr-3 h-8 w-8 text-orange-500" />
                Your Shopping Cart
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500 mb-4">Your cart is empty.</p>
                <Link to="/"><Button>Start Shopping</Button></Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ScrollArea className="h-[400px] sm:h-[500px] border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px] hidden sm:table-cell">Image</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-center">Quantity</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cartItems.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="hidden sm:table-cell">
                              <img src={item.imageUrl || 'https://via.placeholder.com/50'} alt={item.name} className="h-14 w-14 object-cover rounded-md" />
                            </TableCell>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                  <MinusCircle className="h-4 w-4" />
                                </Button>
                                <span>{item.quantity}</span>
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                  <PlusCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</TableCell>
                            <TableCell className="text-center">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                    <Trash2 className="h-5 w-5" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action will remove {item.name} from your cart.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => removeItem(item.id)} className="bg-red-500 hover:bg-red-600">Remove</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
                <div className="lg:col-span-1 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center"><Tag className="mr-2 h-5 w-5 text-gray-500"/>Promo Code</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-grow"
                      />
                      <Button onClick={handleApplyPromoCode}>Apply</Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Delivery Fee:</span><span>${deliveryFee.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Taxes (10%):</span><span>${taxes.toFixed(2)}</span></div>
                      <hr/>
                      <div className="flex justify-between font-bold text-lg"><span>Total:</span><span>${total.toFixed(2)}</span></div>
                    </CardContent>
                    <CardFooter>
                      <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600" onClick={handleCheckout}>
                        Proceed to Checkout
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <footer className="text-center p-4 border-t text-sm text-gray-500">
        Secure checkout powered by FoodFleet.
      </footer>
    </div>
  );
};

export default CartPage;