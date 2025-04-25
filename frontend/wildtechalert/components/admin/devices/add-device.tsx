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
import { addDevice } from "@/lib/actions";
import { addDeviceSchema } from "@/lib/schema";

export default function AddDevice() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof addDeviceSchema>>({
    resolver: zodResolver(addDeviceSchema),
    defaultValues: {
      latitude: 0,
      longitude: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof addDeviceSchema>) {
    setIsSubmitting(true);
    setError("");

    try {
      // Call the function to insert data into the database
      await addDevice(values);

      // Handle success
      console.log("Device added successfully:", values);
      toast("Device added successfully!");
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
        <Button variant="outline">Add Device</Button>
      </SheetTrigger>
      <SheetContent className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Add New Device</SheetTitle>
          <SheetDescription>
            Fill in the details of the new device you want to add.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            {/* Latitude */}
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="e.g. 24.7136"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Longitude */}
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="e.g. 46.6753"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {submitSuccess && (
              <p className="text-green-600">Device added successfully!</p>
            )}
            {error && <p className="text-red-600">{error}</p>}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Submit"}
            </Button>
          </form>
        </Form>
        {/* <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Submit</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
}
