import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PostCard } from "@/components/posts/post-card";
import { createMockPost } from "@tests/helpers/mocks";

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  user = userEvent.setup();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("PostCard", () => {
  it("renders post title and author name", () => {
    const post = createMockPost();

    render(<PostCard post={post} onDelete={vi.fn()} />);

    expect(screen.getByText(post.title)).toBeInTheDocument();
    expect(screen.getByText(post.user.name)).toBeInTheDocument();
  });

  it("renders the post body content", () => {
    const post = createMockPost({ body: "Example body content" });

    render(<PostCard post={post} onDelete={vi.fn()} />);

    expect(screen.getByText("Example body content")).toBeInTheDocument();
  });

  it("calls onDelete with post id when delete button is clicked", async () => {
    const post = createMockPost();
    const onDelete = vi.fn();

    render(<PostCard post={post} onDelete={onDelete} canDelete />);

    await user.click(screen.getByRole("button", { name: /delete post/i }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(post.id);
  });

  it("disables delete button when isDeleting is true", () => {
    const post = createMockPost();

    render(<PostCard post={post} onDelete={vi.fn()} canDelete isDeleting />);

    expect(screen.getByRole("button", { name: /delete post/i })).toBeDisabled();
  });

  it("disables delete button when disabled prop is true", () => {
    const post = createMockPost();

    render(<PostCard post={post} onDelete={vi.fn()} canDelete disabled />);

    expect(screen.getByRole("button", { name: /delete post/i })).toBeDisabled();
  });
});
