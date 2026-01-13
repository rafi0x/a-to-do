"use client";

import { deleteJSON, getJSON, postJSON, putJSON } from "@/lib/api";
import { FilterTodoQuery, TodoStatus } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Todo {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
}

export default function Home() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TodoStatus | "">("");

  const statusTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  const isSubmitting = useRef(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchTodos();
  }, [router]);

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      fetchTodos();
    }, 500);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm, statusFilter]);

  const fetchTodos = async () => {
    if (Object.keys(statusTimeouts.current).length > 0) return;

    try {
      const query: FilterTodoQuery = {};
      if (searchTerm.trim()) {
        query.searchTerm = searchTerm.trim();
      }
      if (statusFilter) {
        query.status = statusFilter as TodoStatus;
      }

      const res = await getJSON<Todo[]>("/todos", query);
      console.log("🚀 ~ fetchTodos ~ res:", res);
      if (res.data) setTodos(res.data);
    } catch (e) {
      console.log("🚀 ~ fetchTodos ~ e:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || isSubmitting.current) return;

    isSubmitting.current = true;
    try {
      await postJSON("/todos", { title, description });
      setTitle("");
      setDescription("");
      await fetchTodos();
    } finally {
      isSubmitting.current = false;
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this todo?")) return;
    await deleteJSON(`/todos/${id}`);
    fetchTodos();
  };

  const handleStatusCycle = async (todo: Todo) => {
    const statusMap: Record<string, "PENDING" | "IN_PROGRESS" | "DONE"> = {
      PENDING: "IN_PROGRESS",
      IN_PROGRESS: "DONE",
      DONE: "PENDING",
    };
    const nextStatus = statusMap[todo.status || "PENDING"];

    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, status: nextStatus } : t))
    );

    if (statusTimeouts.current[todo.id]) {
      clearTimeout(statusTimeouts.current[todo.id]);
    }

    statusTimeouts.current[todo.id] = setTimeout(async () => {
      await putJSON(`/todos/${todo.id}`, { status: nextStatus });
      delete statusTimeouts.current[todo.id];
      console.log(
        "🚀 ~ handleStatusCycle ~ statusTimeouts.current:",
        statusTimeouts.current
      );
      if (Object.keys(statusTimeouts.current).length === 0) {
        fetchTodos();
      }
    }, 500);
  };

  const startEdit = (todo: Todo, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDesc(todo.description || "");
  };

  const cancelEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingId(null);
    setEditTitle("");
    setEditDesc("");
  };

  const saveEdit = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSubmitting.current) return;

    isSubmitting.current = true;
    try {
      await putJSON(`/todos/${id}`, {
        title: editTitle,
        description: editDesc,
      });
      setEditingId(null);
      await fetchTodos();
    } catch (e) {
      console.log("🚀 ~ saveEdit ~ e:", e);
    } finally {
      isSubmitting.current = false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    router.push("/login");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE":
        return "bg-green-100 text-green-800 border-green-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 max-w-3xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Todos</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleAdd}
        className="bg-gray-100 p-6 rounded mb-8 border"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Todo</h2>
        <div className="flex gap-4 mb-4">
          <input
            className="border p-2 rounded flex-1"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            className="border p-2 rounded flex-1"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded font-medium"
        >
          Add Todo
        </button>
      </form>

      <div className="bg-white p-4 rounded mb-6 border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Filter Todos</h2>
        <div className="flex gap-4">
          <input
            className="border p-2 rounded flex-1"
            placeholder="Search todos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TodoStatus | "")}
          >
            <option value="">All</option>
            <option value={TodoStatus.PENDING}>Pending</option>
            <option value={TodoStatus.IN_PROGRESS}>In Progress</option>
            <option value={TodoStatus.DONE}>Done</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {todos.map((todo) => (
          <div
            key={todo.id}
            onClick={() => editingId !== todo.id && handleStatusCycle(todo)}
            className="border p-4 rounded shadow-sm flex items-start gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="mt-1">
              <div
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                  todo.status === "DONE"
                    ? "bg-green-500 border-green-500"
                    : todo.status === "IN_PROGRESS"
                    ? "border-blue-500 bg-blue-100"
                    : "border-gray-400"
                }`}
              >
                {todo.status === "DONE" && (
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                )}
                {todo.status === "IN_PROGRESS" && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>

            <div className="flex-1">
              {editingId === todo.id ? (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="space-y-2 cursor-default"
                >
                  <input
                    className="border p-2 w-full rounded"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    className="border p-2 w-full rounded"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => saveEdit(todo.id, e)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => cancelEdit(e)}
                      className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`font-bold text-lg ${
                        todo.status === "DONE"
                          ? "line-through text-gray-400"
                          : ""
                      }`}
                    >
                      {todo.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded border uppercase font-semibold tracking-wide ${getStatusColor(
                        todo.status || "PENDING"
                      )}`}
                    >
                      {todo.status || "PENDING"}
                    </span>
                  </div>
                  {todo.description && (
                    <p className="text-gray-600">{todo.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Click card to change status
                  </p>
                </>
              )}
            </div>

            {editingId !== todo.id && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={(e) => startEdit(todo, e)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => handleDelete(todo.id, e)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}

        {todos.length === 0 && (
          <p className="text-gray-500 text-center">No todos yet.</p>
        )}
      </div>
    </div>
  );
}

