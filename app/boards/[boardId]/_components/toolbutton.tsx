import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface ToolButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
}

export const ToolButton = ({
  label,
  icon: Icon,
  onClick,
  isActive = false,
  disabled = false,
}: ToolButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onClick}
          disabled={disabled}
          variant={isActive ? "default" : "outline"}
          className={`flex items-center gap-2 px-3 py-2 rounded-2xl ${isActive ? "bg-primary text-white" : "bg-white text-gray-700"
            }`}
        >
          <Icon size={18} />

        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" className="w-max">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>

  );
};
