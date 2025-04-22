"use client";

import { Profile } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, X } from "lucide-react";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { approveProfile, rejectProfile } from "@/lib/actions";
import Link from "next/link";

export const ProfileColumns: ColumnDef<Profile>[] = [
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
    accessorKey: "full_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => `${row.original.first_name} ${row.original.last_name}`,
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      return status.charAt(0).toUpperCase() + status.slice(1);
    },
  },

  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const timestamp = row.original.updated_at;

      if (!timestamp) return "N/A"; // Handle missing values

      const formattedDate = new Date(timestamp).toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
        timeZoneName: "short", // Show time zone
      });

      return formattedDate;
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const device = row.original;

  //     const handleDelete = async () => {
  //       try {
  //         const result = await deleteDevice(device.id);
  //         if (result.success) {
  //           toast.success("Device deleted successfully");
  //         } else {
  //           toast.error(result.error || "Failed to delete device");
  //         }
  //       } catch (error) {
  //         toast.error("An unexpected error occurred");
  //         console.error("Delete error:", error);
  //       }
  //     };

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem asChild>
  //             <Link
  //               href={`/admin/devices/${device.id}/edit`}
  //               // className="rounded-md border p-2 hover:bg-gray-100"
  //             >
  //               Edit
  //             </Link>
  //           </DropdownMenuItem>
  //           <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //   );
  // },
  // },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const profile = row.original;

      // Only show approve/reject actions for pending profiles
      if (profile.status !== "pending") {
        return (
          <div className="text-sm text-gray-500 italic">
            {profile.status === "approved" ? "Approved" : "Rejected"}
          </div>
        );
      }

      const handleApprove = async () => {
        try {
          const result = await approveProfile(profile.user_id);
          if (result.success) {
            toast.success(
              `Profile for ${profile.first_name} ${profile.last_name} approved`
            );
          } else {
            toast.error(result.error || "Failed to approve profile");
          }
        } catch (error) {
          toast.error("An unexpected error occurred");
          console.error("Approval error:", error);
        }
      };

      const handleReject = async () => {
        try {
          const result = await rejectProfile(profile.user_id);
          if (result.success) {
            toast.success(
              `Profile for ${profile.first_name} ${profile.last_name} rejected`
            );
          } else {
            toast.error(result.error || "Failed to reject profile");
          }
        } catch (error) {
          toast.error("An unexpected error occurred");
          console.error("Rejection error:", error);
        }
      };

      return (
        <div className="flex space-x-2">
          <Button
            onClick={handleApprove}
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <Check className="h-4 w-4" />
            <span className="sr-only">Approve</span>
          </Button>
          <Button
            onClick={handleReject}
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Reject</span>
          </Button>
        </div>
      );
    },
  },
];
