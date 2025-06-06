import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import NavigationMenu from '@/components/layout/NavigationMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus } from 'lucide-react';

const signupFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"], // Path of error
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

const SignupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  console.log('SignupPage loaded');

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    console.log("Signup form submitted:", data);
    // Simulate API call for registration
    toast({
      title: "Account Created!",
      description: "Your account has been successfully created. Please log in.",
    });
    // In a real app, you might auto-login or send a verification email
    setTimeout(() => {
      navigate('/login'); // Redirect to login page
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavigationMenu isLoggedIn={false} />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <UserPlus className="h-10 w-10 text-orange-500" />
            </div>
            <CardTitle className="text-3xl font-bold">Create Your Account</CardTitle>
            <CardDescription>Join FoodFleet to discover amazing meals.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={form.formState.isSubmitting}>
                   {form.formState.isSubmitting ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-orange-600 hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      <footer className="text-center p-4 border-t text-sm text-gray-500">
        © {new Date().getFullYear()} FoodFleet. All rights reserved.
      </footer>
    </div>
  );
};

export default SignupPage;