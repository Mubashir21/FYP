"use client";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Stakeholder } from "@/lib/definitions";

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
import { editDevice, editStakeholder } from "@/lib/actions";
import { editDeviceSchema, editStakeholderSchema } from "@/lib/schema";
import { wkbToLatLong } from "@/lib/utils";

export default function EditStakeholder({
  stakeholder,
}: {
  stakeholder: Stakeholder;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const [first_name, last_name] = stakeholder.name.split(" ");

  const form = useForm<z.infer<typeof editStakeholderSchema>>({
    resolver: zodResolver(editStakeholderSchema),
    defaultValues: {
      first_name: first_name,
      last_name: last_name,
      email: stakeholder.email,
      phone: stakeholder.phone,
    },
  });

  async function onSubmit(values: z.infer<typeof editStakeholderSchema>) {
    setIsSubmitting(true);
    setError("");

    try {
      // Call the function to insert data into the database
      await editStakeholder(stakeholder.id, values);

      // Handle success
      console.log("Stakeholder edited successfully:", values);
      toast("Stakeholder edited successfully!");
      setSubmitSuccess(true);

      // Optionally reset the form
      form.reset();

      // Reset success message after a delay
      setTimeout(() => {
        setSubmitSuccess(false);
        router.push("/admin/stakeholders"); // ✅ inside hook context
      }, 2000);

      // Redirect to devices page
      router.push("/admin/stakeholders");
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
                <Input type="tel" placeholder="e.g. +966501234567" {...field} />
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
