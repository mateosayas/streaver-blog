import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeletePostDialog } from "@/components/posts/delete-post-dialog";
import { createMockPost } from "@tests/helpers/mocks";

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  user = userEvent.setup();
});

afterEach(() => {
  vi.clearAllMocks();
});

function renderDialog(props: Partial<React.ComponentProps<typeof DeletePostDialog>> = {}) {
  render(
    <DeletePostDialog
      post={createMockPost()}
      open
      onOpenChange={vi.fn()}
      onConfirm={vi.fn()}
      isDeleting={false}
      {...props}
    />
  );
}

describe("DeletePostDialog", () => {
  it("shows post title in confirmation message", () => {
    const post = createMockPost({ title: "My Unique Post Title" });

    render(
      <DeletePostDialog
        post={post}
        open
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        isDeleting={false}
      />
    );

    expect(screen.getByText("My Unique Post Title")).toBeInTheDocument();
  });

  it("calls onConfirm when delete button is clicked", async () => {
    const onConfirm = vi.fn();

    renderDialog({ onConfirm });

    const dialog = screen.getByRole("dialog", { name: /delete this post/i });
    await user.click(within(dialog).getByRole("button", { name: /delete post/i }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onOpenChange(false) when cancel is clicked", async () => {
    const onOpenChange = vi.fn();

    renderDialog({ onOpenChange });

    const dialog = screen.getByRole("dialog", { name: /delete this post/i });
    await user.click(within(dialog).getByRole("button", { name: /cancel/i }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders nothing when post is null", () => {
    const { container } = render(
      <DeletePostDialog
        post={null}
        open
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        isDeleting={false}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
