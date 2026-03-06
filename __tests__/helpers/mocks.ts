import type { PostWithUser } from "@/types";
import type { User } from "@/generated/prisma/client";

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  name: "John Doe",
  username: "johndoe",
  email: "john@example.com",
  phone: null,
  website: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockPost = (overrides: Partial<PostWithUser> = {}): PostWithUser => ({
  id: 1,
  title: "Test Post Title",
  body: "This is the body of the test post that should be displayed in the card component.",
  userId: 1,
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: createMockUser(),
  ...overrides,
});

export const createMockUsers = (): User[] => [
  createMockUser({ id: 1, name: "Alice Smith", username: "alice" }),
  createMockUser({ id: 2, name: "Bob Jones", username: "bob" }),
];
