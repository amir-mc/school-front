// app/(admin)/dashboard/users/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
interface User {
  id: string;
  name: string;
  username: string;
  role: string;
  createdAt: string;
}


export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
   const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("توکن یافت نشد");
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("خطا در دریافت کاربران");
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);
  
  const handleDelete = async (id: string) => {
 
    const token = localStorage.getItem("token");
  const confirmed = confirm("آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟");
  if (!confirmed) return;

  const res = await fetch(`http://localhost:3000/admin/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`, // حتماً توکن
    },
  });

  if (res.ok) {
    alert("کاربر با موفقیت حذف شد");
    router.refresh(); // یا رفرش مجدد لیست
  } else {
    const error = await res.json();
    alert("خطا در حذف: " + error.message);
  }
};

const handleEdit = (id: string) => {
     
  router.push(`/dashboard/users/edit/${id}`);
};


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">لیست کاربران</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left bg-white border border-gray-200 rounded-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">نام کاربری</th>
              <th className="px-4 py-2">نام</th>
              <th className="px-4 py-2">نقش</th>
              <th className="px-4 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
         onClick={() => router.push(`/dashboard/users/edit/${user.id}`)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
        > 
          ویرایش
        </button>
        <button
          onClick={() => handleDelete(user.id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          حذف
        </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  هیچ کاربری یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  ) 
}
