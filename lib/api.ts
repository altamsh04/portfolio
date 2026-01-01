const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
const AUTH_ROUTE_PATH = process.env.NEXT_PUBLIC_AUTH_ROUTE_PATH || ""

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  tags: string[];
  status: string;
  featured_image?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogListResponse {
  blogs: Blog[];
  limit: number;
  offset: number;
}

function getApiKey(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_KEY || "";
  }
  return "";
}

function getHeaders(contentType?: string): HeadersInit {
  const headers: Record<string, string> = {};
  const apiKey = getApiKey();
  
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("API key is required.");
  }
  
  headers["X-API-Key"] = apiKey;
  
  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  return headers;
}

export async function getAllBlogs(limit: number = 10, offset: number = 0, category?: string): Promise<BlogListResponse> {
  const url = new URL(`${API_BASE_URL}/blogs`);
  url.searchParams.set("limit", limit.toString());
  url.searchParams.set("offset", offset.toString());
  if (category) {
    url.searchParams.set("category", category);
  }
  const response = await fetch(url.toString(), {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch blogs");
  }
  return response.json();
}

export async function getBlogBySlug(slug: string): Promise<Blog> {
  const response = await fetch(`${API_BASE_URL}/blogs/slug/${slug}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch blog");
  }
  return response.json();
}

export async function getBlogById(id: string): Promise<Blog> {
  const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch blog");
  }
  return response.json();
}

export async function createBlog(formData: FormData): Promise<Blog> {
  const response = await fetch(`${API_BASE_URL}/blogs`, {
    method: "POST",
    headers: getHeaders(),
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create blog");
  }
  return response.json();
}

export async function updateBlog(id: string, data: Partial<Blog>): Promise<Blog> {
  const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: "PUT",
    headers: getHeaders("application/json"),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update blog");
  }
  return response.json();
}

export async function deleteBlog(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete blog");
  }
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  role: string;
  last_logged_in: string;
  message: string;
}

export async function adminLogin(email: string, password: string): Promise<LoginResponse> {
  let authPath = (AUTH_ROUTE_PATH || "").trim()
  if (authPath && !authPath.startsWith("/")) {
    authPath = `/${authPath}`
  }
  if (authPath && authPath.endsWith("/")) {
    authPath = authPath.slice(0, -1)
  }
  
  const endpoint = `${API_BASE_URL}${authPath}/admin`
  
  const response = await fetch(endpoint, {
    method: "POST",
    headers: getHeaders("application/json"),
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || "Failed to login");
  }
  
  return response.json();
}
