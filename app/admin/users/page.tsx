"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import { useSnackbar } from "@/app/components/SnackbarProvider";
import {
  AdminUser,
  CreateUserRequest,
  UpdateUserRequest,
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "@/lib/adminUserApi";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const { showMessage } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "CUSTOMER">("CUSTOMER");
  const [saving, setSaving] = useState(false);

  // LOAD USERS

  const loadUsers = async () => {
    try {
      setLoading(true);

      const data = await getAdminUsers();

      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // OPEN ADD MODAL

  const openAddModal = () => {
    setEditingUser(null);

    setName("");
    setEmail("");
    setPassword("");
    setRole("CUSTOMER");

    setShowModal(true);
  };

  // OPEN EDIT MODAL

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);

    setName(user.name);
    setEmail(user.email);
    setPassword("");
    setRole(user.role);

    setShowModal(true);
  };

  // SAVE USER

  const handleSave = async () => {
    if (!name.trim()) {
      showMessage("Name is required", "warning");
      return;
    }

    if (!email.trim()) {
      showMessage("Email is required", "warning");
      return;
    }

    if (!editingUser && !password.trim()) {
      showMessage("Password is required", "warning");
      return;
    }

    try {
      setSaving(true);

      if (editingUser) {
        const data: UpdateUserRequest = {
          name,
          email,
          role,
        };

        await updateAdminUser(editingUser.id, data);
      } else {
        const data: CreateUserRequest = {
          name,
          email,
          password,
          role,
        };

        await createAdminUser(data);
      }

      setShowModal(false);

      await loadUsers();

      showMessage(
        editingUser ? "User updated successfully" : "User created successfully",
        "success",
      );
    } catch (error) {
      console.error("Failed to save user:", error);
      showMessage("Failed to save user", "error");
    } finally {
      setSaving(false);
    }
  };

  // DELETE USER

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAdminUser(id);
      await loadUsers();
      showMessage("User deleted successfully", "success");
    } catch (error) {
      showMessage("Failed to delete user", "error");
    }
  };

  // SEARCH

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value) ||
      user.role.toLowerCase().includes(value)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* SIDEBAR */}

        <Sidebar showFilters={false} />

        {/* CONTENT */}

        <main className="flex-1 min-w-0 p-6">
          {/* HEADER */}

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                User Management
              </h1>

              <p className="text-sm text-gray-500 mt-1">Manage Funkart users</p>
            </div>

            <button
              onClick={openAddModal}
              className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              + Add User
            </button>
          </div>

          {/* SEARCH */}

          <div className="bg-white border rounded-xl p-4 mb-6">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* TABLE */}

          <div className="bg-white border rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-gray-500">
                Loading users...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                No users found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold">
                        ID
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold">
                        Name
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold">
                        Email
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold">
                        Role
                      </th>

                      <th className="text-right px-6 py-4 text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">{user.id}</td>

                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {user.name}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {user.email}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              user.role === "ADMIN"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditModal(user)}
                              className="px-3 py-2 text-sm rounded-lg border hover:bg-gray-100"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(user.id)}
                              className="px-3 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold">
                {editingUser ? "Edit User" : "Add User"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ×
              </button>
            </div>

            {/* FORM */}

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter email"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter password"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Role</label>

                <select
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "ADMIN" | "CUSTOMER")
                  }
                  className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>

            {/* MODAL FOOTER */}

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
