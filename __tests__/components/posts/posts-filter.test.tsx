import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PostsFilter } from "@/components/posts/posts-filter";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { createMockUsers } from "@tests/helpers/mocks";

vi.mock("@/hooks/use-logged-in-user", () => ({
  useLoggedInUser: () => ({ user: null, status: "unauthenticated" }),
}));

function renderFilter() {
  render(
    <NuqsTestingAdapter>
      <PostsFilter users={createMockUsers()} />
    </NuqsTestingAdapter>
  );
}

describe("PostsFilter", () => {
  it("renders filter trigger", () => {
    renderFilter();

    expect(screen.getByRole("combobox", { name: /filter by author/i })).toBeInTheDocument();
  });

  it("shows All Users as the default selected label", () => {
    renderFilter();

    expect(screen.getByRole("combobox", { name: /filter by author/i })).toHaveTextContent(
      /all users/i
    );
  });

  it("renders provided users in dropdown", async () => {
    const user = userEvent.setup();
    renderFilter();

    await user.click(screen.getByRole("combobox", { name: /filter by author/i }));

    expect(screen.getByRole("option", { name: "Alice Smith" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Bob Jones" })).toBeInTheDocument();
  });
});
