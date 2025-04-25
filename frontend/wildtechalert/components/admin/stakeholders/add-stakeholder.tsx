import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../../ui/button";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../../ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { addStakeholder } from "@/lib/actions";
import { addStakeholderSchema } from "@/lib/schema";

export default function AddStakeholder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof addStakeholderSchema>>({
    resolver: zodResolver(addStakeholderSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof addStakeholderSchema>) {
    setIsSubmitting(true);
    setError("");

    try {
      // Call the function to insert data into the database
      await addStakeholder(values);

      // Handle success
      console.log("Stakeholder added successfully:", values);
      toast("Stakeholder added successfully!");
      setSubmitSuccess(true);

      // Optionally reset the form
      form.reset();

      // Reset success message after a delay
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      // Handle error
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error in submission:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Add Stakeholder</Button>
      </SheetTrigger>
      <SheetContent className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Add New Stakeholder</SheetTitle>
          <SheetDescription>
            Fill in the details of the new stakeholder you want to add.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            {/* First Name */}
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="e.g. John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="e.g. Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="e.g. johndoe@wildtechalert.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="e.g. +966501234567"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {submitSuccess && (
              <p className="text-green-600">Stakeholder added successfully!</p>
            )}
            {error && <p className="text-red-600">{error}</p>}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Submit"}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
