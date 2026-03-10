import { getUserInitials } from "@/utils/user-initials";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name: string;
  className?: string;
};

export function UserAvatar({ name, className }: UserAvatarProps) {
  return (
    <div
      className={cn(
        "bg-primary text-primary-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
        className
      )}
    >
      {getUserInitials(name)}
    </div>
  );
}
