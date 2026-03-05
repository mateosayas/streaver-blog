"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "@/generated/prisma/client";

export const ALL_USERS_VALUE = "all";

type PostsFilterProps = {
  users: User[];
};

export function PostsFilter({ users }: PostsFilterProps) {
  const [userId, setUserId] = useQueryState(
    "userId",
    parseAsInteger.withOptions({ shallow: false })
  );

  const handleValueChange = (value: string) => {
    if (value === ALL_USERS_VALUE) return setUserId(null);

    setUserId(Number(value));
  };

  const sortedUsers = [...users].sort((a, b) => a.name.localeCompare(b.name));
  const selectedUser = userId ? users.find((u) => u.id === userId) : null;
  const selectedLabel = selectedUser?.name ?? "All Users";

  return (
    <Select value={userId?.toString() ?? ALL_USERS_VALUE} onValueChange={handleValueChange}>
      <SelectTrigger className="h-10 w-full justify-start rounded-lg border-[#E5E3DC] bg-white px-[14px] shadow-none focus-visible:ring-0 lg:w-auto lg:min-w-[213px] [&_[data-slot=select-value]]:hidden">
        <span className="text-muted-foreground lg:text-foreground shrink-0 text-[13px] font-normal lg:text-[14px] lg:font-medium">
          Filter by author
        </span>
        {/* Hidden SelectValue keeps Radix internal state in sync */}
        <SelectValue />
        <span className="text-foreground lg:text-muted-foreground ml-auto text-[13px] font-medium lg:text-[12px] lg:font-normal">
          {selectedLabel}
        </span>
      </SelectTrigger>
      <SelectContent position="popper" align="start" sideOffset={4}>
        <SelectItem value={ALL_USERS_VALUE}>All Users</SelectItem>
        {sortedUsers.map((user) => (
          <SelectItem key={user.id} value={user.id.toString()}>
            {user.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
