import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Landmark, MapPin } from 'lucide-react';

const checkoutFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  city: z.string().min(2, "City must be at least 2 characters."),
  postalCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid postal code format."),
  country: z.string().min(2, "Country is required."),
  paymentMethod: z.enum(["creditCard", "paypal", "bankTransfer"], {
    required_error: "You need to select a payment method.",
  }),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvc: z.string().optional(),
}).refine(data => {
    if (data.paymentMethod === "creditCard") {
        return data.cardNumber && data.cardNumber.length === 16 && data.expiryDate && data.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/) && data.cvc && data.cvc.length === 3;
    }
    return true;
}, {
    message: "Credit card details are invalid or incomplete.",
    path: ["cardNumber"], // You can point to a specific field or a general one
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

// Placeholder order summary (in a real app, this comes from cart state)
const orderSummary = {
  items: [
    { id: 'm1', name: 'Margherita Pizza', quantity: 1, price: 15.00 },
    { id: 'a2', name: 'Caprese Salad', quantity: 2, price: 10.50 },
  ],
  subtotal: 36.00,
  deliveryFee: 5.00,
  taxes: 3.60,
  total: 44.60,
};

const CheckoutPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  console.log('CheckoutPage loaded');

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'USA',
      paymentMethod: undefined,
    },
  });

  const paymentMethod = form.watch("paymentMethod");

  function onSubmit(data: CheckoutFormValues) {
    console.log("Checkout data:", data);
    toast({
      title: "Order Submitted!",
      description: "Your order is being processed. Redirecting to progress page...",
    });
    // Simulate API call and redirect
    setTimeout(() => {
      navigate(`/order-progress/${Math.random().toString(36).substring(7)}`);
    }, 2000);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavigationMenu cartItemCount={orderSummary.items.reduce((sum, i) => sum + i.quantity, 0)} isLoggedIn={true} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Delivery Information Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center"><MapPin className="mr-3 h-6 w-6 text-orange-500"/>Delivery Information</CardTitle>
                  <CardDescription>Where should we send your order?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl><Input placeholder="Anytown" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl><Input placeholder="12345" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="USA">United States</SelectItem>
                                  <SelectItem value="CAN">Canada</SelectItem>
                                  <SelectItem value="GBR">United Kingdom</SelectItem>
                                </SelectContent>
                              </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center"><CreditCard className="mr-3 h-6 w-6 text-orange-500"/>Payment Method</CardTitle>
                  <CardDescription>Choose how you'd like to pay.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-gray-50">
                              <FormControl><RadioGroupItem value="creditCard" /></FormControl>
                              <FormLabel className="font-normal flex items-center"><CreditCard className="mr-2 h-5 w-5 text-blue-500"/>Credit Card</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-gray-50">
                              <FormControl><RadioGroupItem value="paypal" /></FormControl>
                              <FormLabel className="font-normal flex items-center"><img src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" alt="PayPal" className="mr-2 h-5"/> PayPal</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-gray-50">
                              <FormControl><RadioGroupItem value="bankTransfer" /></FormControl>
                              <FormLabel className="font-normal flex items-center"><Landmark className="mr-2 h-5 w-5 text-green-500"/>Bank Transfer (COD Placeholder)</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {paymentMethod === 'creditCard' && (
                    <div className="mt-4 space-y-4 p-4 border rounded-md bg-slate-50">
                        <FormField control={form.control} name="cardNumber" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Card Number</FormLabel>
                                <FormControl><Input placeholder="0000 0000 0000 0000" {...field} /></FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="expiryDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expiry Date (MM/YY)</FormLabel>
                                    <FormControl><Input placeholder="MM/YY" {...field} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="cvc" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CVC</FormLabel>
                                    <FormControl><Input placeholder="123" {...field} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                        </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Card */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg sticky top-24"> {/* Sticky for visibility on scroll */}
                <CardHeader>
                  <CardTitle className="text-2xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orderSummary.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-sm"><span>Subtotal:</span><span>${orderSummary.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span>Delivery Fee:</span><span>${orderSummary.deliveryFee.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span>Taxes:</span><span>${orderSummary.taxes.toFixed(2)}</span></div>
                  <Separator />
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total:</span>
                    <span>${orderSummary.total.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" size="lg" className="w-full bg-orange-500 hover:bg-orange-600" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Processing..." : `Place Order - $${orderSummary.total.toFixed(2)}`}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </Form>
      </main>
      <footer className="text-center p-4 border-t text-sm text-gray-500">
        Your payment is secure and encrypted.
      </footer>
    </div>
  );
};

export default CheckoutPage;