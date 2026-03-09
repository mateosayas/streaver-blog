import { Button } from "@/components/ui/button";

type StatusMessageProps = {
  icon: React.ReactNode;
  iconWrapperClassName: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export function StatusMessage({
  icon,
  iconWrapperClassName,
  title,
  description,
  action,
}: StatusMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
      <div className={iconWrapperClassName}>{icon}</div>
      <div className="flex flex-col gap-2">
        <h2 className="text-foreground text-[17px] font-bold tracking-[-0.02em]">{title}</h2>
        <p className="text-muted-foreground max-w-65 text-[14px] leading-5.25">{description}</p>
      </div>
      {action && (
        <Button
          variant="outline"
          className="border-border h-9 rounded-lg px-4.5"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
