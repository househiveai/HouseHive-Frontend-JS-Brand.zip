"use client";

import { useState } from "react";
import RequireAuth from "../components/RequireAuth";
import { useAuth } from "../components/AuthContext";

export default function AccountPage() {
  return (
    <RequireAuth>
      <AccountSettings />
    </RequireAuth>
  );
}

function AccountSettings() {
  const { user, updateProfile, updateEmail, updatePassword } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileStatus, setProfileStatus] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingSection, setLoadingSection] = useState(null);

  if (!user) {
    return (
      <section className="flex min-h-[40vh] items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-16 text-sm text-slate-200 shadow-xl backdrop-blur-xl">
        Loading account details...
      </section>
    );
  }

  async function handleProfileUpdate(event) {
    event.preventDefault();
    setProfileStatus("");
    setLoadingSection("profile");
    try {
      await updateProfile({ name: name || null });
      setProfileStatus("Profile updated successfully.");
    } catch (err) {
      setProfileStatus(err?.message || "Unable to update profile.");
    } finally {
      setLoadingSection(null);
    }
  }

  async function handleEmailUpdate(event) {
    event.preventDefault();
    setEmailStatus("");
    setLoadingSection("email");
    try {
      await updateEmail({ email });
      setEmailStatus("Email updated. Please re-verify if required.");
    } catch (err) {
      setEmailStatus(err?.message || "Unable to update email.");
    } finally {
      setLoadingSection(null);
    }
  }

  async function handlePasswordUpdate(event) {
    event.preventDefault();
    setPasswordStatus("");
    if (newPassword !== confirmPassword) {
      setPasswordStatus("New passwords do not match.");
      return;
    }
    setLoadingSection("password");
    try {
      await updatePassword({ current_password: currentPassword, new_password: newPassword });
      setPasswordStatus("Password updated. Use your new password next time you sign in.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordStatus(err?.message || "Unable to update password.");
    } finally {
      setLoadingSection(null);
    }
  }

  return (
    <section className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-xl backdrop-blur-xl sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#FFB400]">Account</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Manage your profile</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          Update your personal information, adjust login details, and keep your contact info synchronized across HouseHive.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={handleProfileUpdate}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl backdrop-blur-xl sm:p-8"
        >
          <h2 className="text-lg font-semibold">Profile details</h2>
          <p className="mt-1 text-sm text-slate-200">Refresh your display name used across dashboards and notifications.</p>

          <label className="mt-6 block text-sm font-medium text-slate-200">
            Full name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
              placeholder="Your full name"
            />
          </label>

          {profileStatus && (
            <p className="mt-4 text-sm text-slate-100">{profileStatus}</p>
          )}

          <button
            type="submit"
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#FFB400] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:bg-[#f39c00]"
            disabled={loadingSection === "profile"}
          >
            {loadingSection === "profile" ? "Saving..." : "Save profile"}
          </button>
        </form>

        <form
          onSubmit={handleEmailUpdate}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl backdrop-blur-xl sm:p-8"
        >
          <h2 className="text-lg font-semibold">Email address</h2>
          <p className="mt-1 text-sm text-slate-200">
            Update the email used for logins, alerts, and billing receipts.
          </p>

          <label className="mt-6 block text-sm font-medium text-slate-200">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
              required
            />
          </label>

          {emailStatus && <p className="mt-4 text-sm text-slate-100">{emailStatus}</p>}

          <button
            type="submit"
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#FFB400] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:bg-[#f39c00]"
            disabled={loadingSection === "email"}
          >
            {loadingSection === "email" ? "Updating..." : "Update email"}
          </button>
        </form>
      </div>

      <form
        onSubmit={handlePasswordUpdate}
        className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl backdrop-blur-xl sm:p-8"
      >
        <h2 className="text-lg font-semibold">Password</h2>
        <p className="mt-1 text-sm text-slate-200">
          Set a strong password with at least 8 characters, mixing upper and lower case letters, numbers, and symbols.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <label className="block text-sm font-medium text-slate-200">
            Current password
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-200">
            New password
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-200">
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
              required
            />
          </label>
        </div>

        {passwordStatus && <p className="mt-4 text-sm text-slate-100">{passwordStatus}</p>}

        <button
          type="submit"
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#FFB400] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:bg-[#f39c00]"
          disabled={loadingSection === "password"}
        >
          {loadingSection === "password" ? "Updating..." : "Update password"}
        </button>
      </form>
    </section>
  );
}
