// frontend/src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import BadgeCard from "../components/BadgeCard";
import { useAuth } from "../context/AuthContext";
import editIcon from "../assets/edit.png";


export default function Profile() {
  const { user, setUser, loading, logout } = useAuth();
  const [newGoal, setNewGoal] = useState("");
  const [editableName, setEditableName] = useState(user?.name || "");
  const [editableState, setEditableState] = useState(user?.state || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [communityStats, setCommunityStats] = useState({ posts: 0, likes: 0, comments: 0 });
  const [rank, setRank] = useState(null);

  const suggestedGoals = [
    "Cycle to work 3 times a week",
    "Reduce meat consumption by 50%",
    "Plant 5 trees this year",
    "Switch to reusable bags",
    "Use public transport twice a week",
    "Install solar panels",
    "Limit air conditioner usage",
    "Start composting kitchen waste",
    "Reduce single-use plastics",
    "Save water by shorter showers",
  ];

  if (loading) return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left card skeleton */}
        <div className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700 animate-pulse">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-700 mb-4"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
            <div className="grid grid-cols-2 gap-3 w-full">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
        {/* Right cards skeleton */}
        <div className="md:col-span-2 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl p-4 bg-white dark:bg-gray-800 border border-gray-700 animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  if (!user) return <div className="text-center mt-10">No profile found.</div>;

  useEffect(() => {
    setEditableName(user.name || "");
    setEditableState(user.state || "");
  }, [user.name, user.state]);

  useEffect(() => {
    const loadCommunityStatsAndRank = async () => {
      try {
        // Community stats
        const postsRes = await api.get("/community/posts");
        const posts = postsRes.data || [];
        const userId = user._id;

        const myPosts = posts.filter((p) => {
          const pid = typeof p.user === "object" ? p.user?._id : p.user;
          return pid === userId;
        });

        const postCount = myPosts.length;
        const likeCount = myPosts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
        const commentCount = posts.reduce((sum, p) => {
          const comments = p.comments || [];
          return (
            sum +
            comments.filter((c) => {
              const cid = typeof c.user === "object" ? c.user?._id : c.user;
              return cid === userId;
            }).length
          );
        }, 0);

        setCommunityStats({ posts: postCount, likes: likeCount, comments: commentCount });

        // Rank from national leaderboard
        const lbRes = await api.get("/leaderboard/national");
        const results = lbRes.data?.results || [];
        const idx = results.findIndex((entry) => entry.user && entry.user._id === userId);
        setRank(idx >= 0 ? idx + 1 : null);
      } catch (err) {
        console.error("Profile stats/rank error:", err);
      }
    };

    loadCommunityStatsAndRank();
  }, [user._id]);

  const redeemedCount = (user.rewards || []).filter((r) => r.redeemed).length;
  const badgesCount = user.badges?.length || 0;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profile", file);
    try {
      const res = await api.post("/auth/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Profile upload error:", err);
    }
  };

  const addGoal = async (goalText) => {
    if (!goalText) return;
    try {
      const res = await api.post("/auth/goals", { goal: goalText });
      setUser(res.data);
      setNewGoal("");
    } catch (err) {
      console.error("Add goal error:", err);
    }
  };

  const editGoal = async (index, newText) => {
    try {
      await api.put(`/auth/goals/${index}`, { text: newText });
      const updated = [...(user.goals || [])];
      updated[index] = { ...updated[index], text: newText };
      setUser({ ...user, goals: updated });
    } catch (err) {
      console.error("Edit goal error:", err);
    }
  };

  const deleteGoal = async (index) => {
    try {
      await api.delete(`/auth/goals/${index}`);
      const updated = [...(user.goals || [])];
      updated.splice(index, 1);
      setUser({ ...user, goals: updated });
    } catch (err) {
      console.error("Delete goal error:", err);
    }
  };

  const completeGoal = async (index) => {
    try {
      await api.put(`/auth/goals/${index}`, { completed: true });
      const updated = [...(user.goals || [])];
      updated[index] = { ...updated[index], completed: true };
      setUser({ ...user, goals: updated });
    } catch (err) {
      console.error("Complete goal error:", err);
    }
  };

  const saveProfile = async () => {
    try {
      setSavingProfile(true);
      const res = await api.put("/auth/profile", {
        name: editableName,
        state: editableState,
      });
      setUser(res.data);
    } catch (err) {
      console.error("Update profile error:", err);
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="col-span-1 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 shadow-2xl border border-blue-600/30"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex flex-col items-center">
            <label className="relative inline-block">
  {user.photoURL ? (
    <img
      src={user.photoURL}
      alt="Profile"
      className="w-32 h-32 rounded-full object-cover ring-4 ring-emerald-400 shadow-md"
    />
  ) : (
    <div className="w-32 h-32 rounded-full bg-emerald-600 flex items-center justify-center text-4xl font-bold ring-4 ring-emerald-400 shadow-md">
      {user.name?.charAt(0)?.toUpperCase() || "U"}
    </div>
  )}

  {/* hidden file input */}
  <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />


<button
  type="button"
  onClick={() => document.querySelector('input[type="file"]').click()}
  className="
    absolute
    bottom-0 left-1/2
    -translate-x-1/2 translate-y-[-10%]   /* CHANGED: negative value moves it UP */
    w-[70%] h-7
    rounded-b-full
    bg-white/4 dark:bg-white/4
    backdrop-blur-sm
    border-t border-white/10 dark:border-white/10
    flex items-center justify-center
    shadow-sm
    text-gray-900 dark:text-white
    transition hover:bg-white/10 dark:hover:bg-white/10
  "
  aria-label="Edit profile photo"
  title="Edit profile photo"
>
  <img src={editIcon} alt="Edit" className="w-4 h-4 opacity-75" />
</button>
</label>

          
<div className="w-full mt-6">

  {/* Name + Email */}
  <div className="text-center mb-4">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
      {user.name}
    </h2>
    <p className="text-xs text-gray-600 dark:text-gray-300">
      {user.email}
    </p>
  </div>

  {/* 2×2 Stats Grid */}
  <div className="grid grid-cols-2 gap-3">

    {/* Rank Card */}
    <div className="rounded-xl p-4 bg-gray-100 dark:bg-gray-800 text-center shadow-sm">
      <p className="text-xs text-gray-600 dark:text-gray-300">Rank</p>
      <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
        {rank ? `#${rank}` : "—"}
      </p>
    </div>

    {/* Badges Card */}
    <div className="rounded-xl p-4 bg-gray-100 dark:bg-gray-800 text-center shadow-sm">
      <p className="text-xs text-gray-600 dark:text-gray-300">Badges</p>
      <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
        {badgesCount}
      </p>
    </div>

    {/* Posts Card — uses already computed communityStats */}
    <div className="rounded-xl p-4 bg-gray-100 dark:bg-gray-800 text-center shadow-sm">
      <p className="text-xs text-gray-600 dark:text-gray-300">Posts</p>
      <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
        {communityStats.posts}
      </p>
    </div>

    {/* Points Card — if no points system, keep 0 */}
    <div className="rounded-xl p-4 bg-gray-100 dark:bg-gray-800 text-center shadow-sm">
      <p className="text-xs text-gray-600 dark:text-gray-300">Points</p>
      <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
        {user.points ?? 0}
      </p>
    </div>

  </div>
</div>



            {/* ---------- SAVE CHANGES DIALOG BOX (kept) ---------- */}
            <div className="w-full mt-6">
              <h4 className="text-center font-semibold mb-3 text-gray-900 dark:text-gray-200">Edit Profile</h4>

              <div className="space-y-3">
                <input
                  type="text"
                  value={editableName}
                  onChange={(e) => setEditableName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-sm text-gray-800 placeholder-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />

                <input
                  type="text"
                  value={editableState}
                  onChange={(e) => setEditableState(e.target.value)}
                  placeholder="Your state"
                  className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-sm text-gray-800 placeholder-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />

                <button
                  onClick={saveProfile}
                  disabled={savingProfile}
                  className="w-full px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium shadow-sm"
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={logout}
                  className="w-full px-3 py-2 rounded-lg border border-red-500 text-red-400 text-sm font-medium hover:bg-red-900/10"
                >
                  Logout
                </button>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Right: badges, goals, community (darker compact look) */}
        <motion.div className="md:col-span-2 space-y-6" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
          <div className="rounded-2xl p-4 bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700 border border-blue-600/30">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Badges</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {user.badges?.map((b, i) => <BadgeCard key={i} badge={b} justUnlocked={false} />)}
              {(!user.badges || user.badges.length === 0) && (
                <p className="text-sm text-white/60 col-span-full">No badges earned yet. Complete actions and challenges to unlock badges!</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl p-4 bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700 border border-blue-600/30">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Goals for Reducing Emissions</h3>

            <div className="flex flex-wrap gap-2 mb-4">
              {suggestedGoals.map((g, i) => (
                <button
                  key={i}
                  onClick={() => addGoal(g)}
                  className="px-3 py-1 text-sm rounded-full border border-gray-300 text-gray-800 dark:border-gray-600 dark:text-white/80"
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Write your own goal..."
                className="flex-1 px-3 py-2 rounded bg-gray-100 text-gray-800 placeholder-gray-500 dark:bg-white/5 dark:text-white dark:placeholder-gray-400 text-sm"
              />
              <button onClick={() => addGoal(newGoal)} className="px-4 py-2 bg-emerald-500 rounded text-white text-sm">Add</button>
            </div>

            <ul className="space-y-2">
              {user.goals?.map((goal, index) => (
                <li key={index} className={`flex items-center justify-between px-3 py-2 rounded ${goal.completed ? 'bg-gray-200 text-gray-600 line-through dark:bg-white/8 dark:text-white/60' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white'}`}>
                  <input
                    type="text"
                    value={goal.text}
                    onChange={(e) => editGoal(index, e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 dark:text-white"
                    disabled={goal.completed}
                  />
                  <div className="flex gap-2 ml-3">
                    {!goal.completed && (
                      <button onClick={() => completeGoal(index)} className="px-2 py-1 bg-emerald-500 text-white rounded text-xs">✅</button>
                    )}
                    <button onClick={() => deleteGoal(index)} className="px-2 py-1 bg-red-600 text-white rounded text-xs">❌</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl p-4 bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700 border border-blue-600/30">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">My Community Activity</h3>
            <p className="text-sm text-gray-700 dark:text-white/70">Posts: {communityStats.posts} · Likes received: {communityStats.likes} · Comments made: {communityStats.comments}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
