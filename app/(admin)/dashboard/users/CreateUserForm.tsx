"use client";

import { useState, useEffect } from "react";

export default function CreateUserForm() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    nationalId: "",
    role: "STUDENT",
    classId: ""
  });
  
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("http://localhost:3000/admin/classes", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          classId: formData.role === "STUDENT" ? formData.classId : null,
        }),
      });

      if (res.ok) {
        alert("کاربر با موفقیت ایجاد شد");
        setFormData({
          name: "",
          username: "",
          password: "",
          nationalId: "",
          role: "STUDENT",
          classId: ""
        });
      } else {
        const err = await res.json();
        throw new Error(err.message || "خطا در ساخت کاربر");
      }
    } catch (error: any) {
      alert("خطا: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">ایجاد کاربر جدید</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* National ID */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">کد ملی</span>
          </label>
          <input
            type="text"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleChange}
            placeholder="کد ملی را وارد کنید"
            required
            className="input input-bordered w-full"
          />
        </div>

        {/* Full Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">نام کامل</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="نام و نام خانوادگی"
            required
            className="input input-bordered w-full"
          />
        </div>

        {/* Username */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">نام کاربری</span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="نام کاربری"
            required
            className="input input-bordered w-full"
          />
        </div>

        {/* Password */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">رمز عبور</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="رمز عبور"
            required
            className="input input-bordered w-full"
          />
        </div>

        {/* Role */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">نقش کاربر</span>
          </label>
          <select 
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="STUDENT">دانش‌آموز</option>
            <option value="TEACHER">معلم</option>
            <option value="PARENT">والد</option>
            <option value="ADMIN">مدیر</option>
          </select>
        </div>

        {/* Class (only for students) */}
        {formData.role === "STUDENT" && (
          <div className="form-control">
            <label className="label">
              <span className="label-text">کلاس</span>
            </label>
            <select
              name="classId"
              value={formData.classId}
              onChange={handleChange}
              className="select select-bordered w-full"
              required={formData.role === "STUDENT"}
            >
              <option value="">انتخاب کلاس</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button 
            type="submit" 
            className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'در حال ثبت...' : 'ایجاد کاربر'}
          </button>
        </div>
      </form>
    </div>
  );
}