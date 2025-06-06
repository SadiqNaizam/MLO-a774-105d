import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import OrderProgressStepper from '@/components/OrderProgressStepper';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PackageCheck, CheckCircle, CookingPot, Truck, HelpCircle, Home, FileText } from 'lucide-react'; // More specific icons

interface OrderStep {
  id: string;
  name: string;
  icon?: React.ElementType;
  description: string;
}

const orderSteps: OrderStep[] = [
  { id: 'confirmed', name: 'Order Confirmed', icon: PackageCheck, description: 'We have received your order and are preparing it for the kitchen.' },
  { id: 'preparing', name: 'Preparing Food', icon: CookingPot, description: 'The restaurant is currently preparing your delicious meal.' },
  { id: 'on_way', name: 'Out for Delivery', icon: Truck, description: 'Your order is on its way! Track your rider for live updates.' },
  { id: 'delivered', name: 'Delivered', icon: CheckCircle, description: 'Your food has been delivered. Enjoy your meal!' },
];

// Placeholder order details
const placeholderOrder = {
  id: 'xyz789',
  items: [
    { name: 'Margherita Pizza', quantity: 1, price: 15.00 },
    { name: 'Caprese Salad', quantity: 2, price: 10.50 },
  ],
  total: 44.60,
  estimatedDelivery: new Date(Date.now() + 45 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  restaurantName: "The Green Leaf Eatery",
  deliveryAddress: "123 Main St, Anytown, 12345"
};


const OrderProgressPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [currentStepId, setCurrentStepId] = useState(orderSteps[0].id);
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);

  console.log(`OrderProgressPage loaded for order ID: ${orderId}`);

  // Simulate order progress
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    orderSteps.forEach((step, index) => {
      if (index > 0) { // Skip the first step as it's initial
        const delay = (index) * 15000; // 15 seconds per step for demo
        timeouts.push(setTimeout(() => {
          setCurrentStepId(step.id);
          setCompletedStepIds(prev => [...prev, orderSteps[index-1].id]);
        }, delay));
      }
    });
    // Initial completed state
    if(orderSteps.length > 0) {
      // No steps completed initially or first one is completed if current is beyond first
      const initialCurrentIndex = orderSteps.findIndex(s => s.id === currentStepId);
      if (initialCurrentIndex > 0) {
        setCompletedStepIds(orderSteps.slice(0, initialCurrentIndex).map(s => s.id));
      }
    }


    return () => timeouts.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]); // Rerun if orderId changes, though not typical for this page

  const currentStepDetails = orderSteps.find(step => step.id === currentStepId);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavigationMenu cartItemCount={0} isLoggedIn={true} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="shadow-xl max-w-3xl mx-auto">
          <CardHeader className="text-center border-b pb-6">
            <CardTitle className="text-3xl font-bold text-gray-800">Order Tracking</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Order ID: <span className="font-semibold text-orange-500">{orderId}</span>
            </CardDescription>
             <p className="text-sm text-gray-500 mt-1">Estimated Delivery: <span className="font-medium">{placeholderOrder.estimatedDelivery}</span></p>
          </CardHeader>
          <CardContent className="pt-8 px-4 sm:px-8">
            <OrderProgressStepper steps={orderSteps} currentStepId={currentStepId} completedStepIds={completedStepIds} />

            {currentStepDetails && (
                 <Alert className="mt-8 bg-orange-50 border-orange-200">
                    <currentStepDetails.icon className="h-5 w-5 text-orange-600" />
                    <AlertTitle className="font-semibold text-orange-700">{currentStepDetails.name}</AlertTitle>
                    <AlertDescription className="text-orange-600">
                        {currentStepDetails.description}
                    </AlertDescription>
                </Alert>
            )}

            <Accordion type="single" collapsible className="w-full mt-8">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-medium">Order Summary</AccordionTrigger>
                <AccordionContent className="text-sm">
                  <p className="mb-1"><strong>Restaurant:</strong> {placeholderOrder.restaurantName}</p>
                  <ul className="list-disc pl-5 mb-2">
                    {placeholderOrder.items.map(item => (
                      <li key={item.name}>{item.name} (x{item.quantity}) - ${item.price.toFixed(2)}</li>
                    ))}
                  </ul>
                  <p><strong>Total Paid:</strong> ${placeholderOrder.total.toFixed(2)}</p>
                  <p><strong>Delivery To:</strong> {placeholderOrder.deliveryAddress}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-medium">Need Help?</AccordionTrigger>
                <AccordionContent className="space-y-3 text-sm">
                  <p>If you have any issues with your order, please contact support.</p>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" /> Contact Support
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> View Receipt
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 border-t">
            <Link to="/">
              <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2">
                <Home className="h-4 w-4" /> Back to Home
              </Button>
            </Link>
            {currentStepId !== 'delivered' && (
                <Button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600" onClick={() => alert("Map view not implemented yet.")}>
                    <Truck className="mr-2 h-4 w-4"/> Track Live (Mock)
                </Button>
            )}
          </CardFooter>
        </Card>
      </main>
      <footer className="text-center p-4 border-t text-sm text-gray-500">
        Thank you for ordering with FoodFleet!
      </footer>
    </div>
  );
};

export default OrderProgressPage;