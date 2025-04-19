"use client";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Device } from "@/lib/definitions";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { editDevice } from "@/lib/actions";
import { editDeviceSchema } from "@/lib/schema";
import { wkbToLatLong } from "@/lib/utils";

export default function EditDevice({ device }: { device: Device }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");

  const { latitude, longitude } = wkbToLatLong(device.coordinates);

  const router = useRouter();

  const form = useForm<z.infer<typeof editDeviceSchema>>({
    resolver: zodResolver(editDeviceSchema),
    defaultValues: {
      latitude: latitude,
      longitude: longitude,
      battery_level: device.battery_level,
      status: device.status,
    },
  });

  async function onSubmit(values: z.infer<typeof editDeviceSchema>) {
    setIsSubmitting(true);
    setError("");

    try {
      // Call the function to insert data into the database
      await editDevice(device.id, values);

      // Handle success
      console.log("Device edited successfully:", values);
      toast("Device edited successfully!");
      setSubmitSuccess(true);

      // Optionally reset the form
      form.reset();

      // Reset success message after a delay
      setTimeout(() => {
        setSubmitSuccess(false);
        router.push("/admin/devices"); // ✅ inside hook context
      }, 2000);

      // Redirect to devices page
      router.push("/admin/devices");
    } catch (err) {
      // Handle error
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error in submission:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        {/* Battery Level */}
        <FormField
          control={form.control}
          name="battery_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Battery Level</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="any"
                  placeholder="e.g. 24.7136"
                  value={field.value}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select device status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
  );
}
