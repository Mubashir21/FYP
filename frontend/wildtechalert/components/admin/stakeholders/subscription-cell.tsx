import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { toggleSubscription } from "@/lib/actions";

export function SubscriptionCell({
  isSubscribed,
  stakeholderId,
  role,
}: {
  isSubscribed: boolean;
  stakeholderId: string;
  role: string;
}) {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(isSubscribed);

  const handleToggle = async (value: boolean) => {
    setLoading(true);
    try {
      await toggleSubscription(stakeholderId, value);
      setChecked(value);
      toast.success(`Subscription ${value ? "enabled" : "disabled"}`);
    } catch {
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

  return checked ? (
    <Check className="bg-green-200 text-green-700 rounded-md p-1" />
  ) : (
    <X className="bg-red-200 text-red-700 rounded-md p-1" />
  );
}
