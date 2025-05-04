import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function MaskedValueCell({ value }: { value: string }) {
  const [visible, setVisible] = useState(false);

  if (!value) return <>N/A</>;

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm">
        {visible ? value : "••••••••••"}
      </span>
      <button
        onClick={() => setVisible(!visible)}
        className="text-muted-foreground hover:text-foreground transition"
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}
