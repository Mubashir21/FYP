"use client";

import { RegistrationColumns } from "@/components/settings/columns";
import { DataTable } from "@/components/settings/data-table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { generateRegistrationCode } from "@/lib/actions";
import { useRouter } from "next/navigation";
import type { Registration } from "@/lib/definitions";

export default function RegistrationComponent({
  data,
}: {
  data: Registration[];
}) {
  const [buttonState, setButtonState] = useState("idle"); // idle, generating, generated
  const router = useRouter();

  // Handler for generating new code
  const handleGenerateCode = async () => {
    setButtonState("generating");

    try {
      // Call server action to generate code
      await generateRegistrationCode();

      // Update button state
      setButtonState("generated");

      // Wait a moment then refresh the page data
      setTimeout(() => {
        router.refresh(); // This refreshes the server components without a full page reload
        setButtonState("idle");
      }, 2000);
    } catch (error) {
      console.error("Failed to generate code:", error);
      setButtonState("idle");
    }
  };

  // Determine button text based on state
  const getButtonText = () => {
    switch (buttonState) {
      case "generating":
        return "Generating...";
      case "generated":
        return "Generated!";
      default:
        return "Generate New Code";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Registration</h2>
      <DataTable columns={RegistrationColumns} data={data} />
      <div className="flex justify-end mt-4">
        <Button
          onClick={handleGenerateCode}
          disabled={buttonState !== "idle"}
          className="px-4 py-2"
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
}
