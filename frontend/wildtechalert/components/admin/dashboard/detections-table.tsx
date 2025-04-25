// "use client";

// import { Device } from "@/lib/definitions";
// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
//   getPaginationRowModel,
// } from "@tanstack/react-table";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "../ui/button";

// export const columns: ColumnDef<Device>[] = [
//   {
//     accessorKey: "code",
//     header: "Code",
//   },
//   {
//     accessorKey: "battery_level",
//     header: "Battery Level",
//     cell: ({ row }) => {
//       const batteryLevel = row.original.battery_level; // Get the battery level
//       return `${batteryLevel}%`; // Format as percentage
//     },
//   },
//   {
//     accessorKey: "last_ping",
//     header: "Last Ping",
//     cell: ({ row }) => {
//       const timestamp = row.original.last_ping;

//       if (!timestamp) return "N/A"; // Handle missing values

//       const formattedDate = new Date(timestamp).toLocaleString("en-GB", {
//         year: "numeric",
//         month: "short",
//         day: "2-digit",
//         hour: "2-digit",
//         minute: "2-digit",
//         second: "2-digit",
//         hour12: false, // Use 24-hour format
//         timeZoneName: "short", // Show time zone
//       });

//       return formattedDate;
//     },
//   },
//   {
//     accessorKey: "coordinates",
//     header: "Coordinates",
//     cell: ({ row }) => {
//       const coords = row.original.coordinates;

//       if (!coords || !coords.coordinates || coords.coordinates.length < 2) {
//         return "N/A"; // Handle missing or invalid coordinates
//       }

//       const [longitude, latitude] = coords.coordinates; // Extract lat/lng

//       return (
//         <a
//           href={`https://www.google.com/maps?q=${latitude},${longitude}`}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-500 underline"
//         >
//           Open in Maps
//         </a>
//       );
//     },
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => {
//       const status = row.original.status;
//       return status.charAt(0).toUpperCase() + status.slice(1);
//     },
//   },
// ];

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
// }

// export function DataTable<TData, TValue>({
//   columns,
//   data,
// }: DataTableProps<TData, TValue>) {
//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });
//   return (
//     <div>
//       <p className="mb-4 text-xl md:text-2xl">Devices</p>
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       {/* <div className="flex items-center justify-end space-x-2 py-4">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage()}
//         >
//           Previous
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.nextPage()}
//           disabled={!table.getCanNextPage()}
//         >
//           Next
//         </Button>
//       </div> */}
//     </div>
//   );
// }
