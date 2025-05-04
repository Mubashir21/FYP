"use client";

import { Stakeholder } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteStakeholder, toggleSubscription } from "@/lib/actions";
import Link from "next/link";
import { formatDateSmartCompact } from "@/lib/utils";
import { useState } from "react";

export const StakeholderColumns = (role: string): ColumnDef<Stakeholder>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "subscribed",
    header: "Subscribed",
    cell: ({ row }) => {
      const stakeholder = row.original;
      const isSubscribed = stakeholder.subscribed;

      const [loading, setLoading] = useState(false);
      const [checked, setChecked] = useState(isSubscribed);

      const handleToggle = async (value: boolean) => {
        setLoading(true);
        try {
          await toggleSubscription(stakeholder.id, value);
          setChecked(value);
          toast.success(`Subscription ${value ? "enabled" : "disabled"}`);
        } catch (err) {
          toast.error("Failed to update subscription");
        } finally {
          setLoading(false);
        }
      };

      if (role === "admin") {
        return (
          <div className="flex items-center">
            <Switch
              checked={checked}
              onCheckedChange={handleToggle}
              disabled={loading}
            />
          </div>
        );
      }

      return isSubscribed ? (
        <Check className="bg-green-200 text-green-700 rounded-md p-1" />
      ) : (
        <X className="bg-red-200 text-red-700 rounded-md p-1" />
      );
    },
  },
  {
    accessorKey: "update_at",
    header: "Updated At",
    cell: ({ row }) => {
      const timestamp = row.original.updated_at;

      if (!timestamp) return "N/A"; // Handle missing values

      return formatDateSmartCompact(timestamp);
    },
  },
  // {
  //   accessorKey: "created_at",
  //   header: "Created At",
  //   cell: ({ row }) => {
  //     const timestamp = row.original.created_at;

  //     if (!timestamp) return "N/A"; // Handle missing values

  //     return formatTimestamp(timestamp);
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const stakeholder = row.original;
      if (role !== "admin") return null;

      const handleDelete = async () => {
        try {
          const result = await deleteStakeholder(stakeholder.id);
          if (result.success) {
            toast.success("Stakeholder deleted successfully");
          } else {
            toast.error(result.error || "Failed to delete device");
          }
        } catch (error) {
          toast.error("An unexpected error occurred");
          console.error("Delete error:", error);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/stakeholders/${stakeholder.id}/edit`}
                // className="rounded-md border p-2 hover:bg-gray-100"
              >
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
