// frontend/src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import BadgeCard from "../components/BadgeCard";
import { useAuth } from "../context/AuthContext";

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

  if (loading) return <div className="text-center mt-10">Loading...</div>;
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

  // -------------------- Handlers --------------------
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
      const res = await api.post("/auth/goals", { goal: goalText }); // ✅ send as string
      setUser(res.data);
      setNewGoal("");
    } catch (err) {
      console.error("Add goal error:", err);
    }
  };

  const editGoal = async (index, newText) => {
    try {
      await api.put(`/auth/goals/${index}`, { text: newText });
      const updated = [...user.goals];
      updated[index].text = newText;
      setUser({ ...user, goals: updated });
    } catch (err) {
      console.error("Edit goal error:", err);
    }
  };

  const deleteGoal = async (index) => {
    try {
      await api.delete(`/auth/goals/${index}`);
      const updated = [...user.goals];
      updated.splice(index, 1);
      setUser({ ...user, goals: updated });
    } catch (err) {
      console.error("Delete goal error:", err);
    }
  };

  const completeGoal = async (index) => {
    try {
      await api.put(`/auth/goals/${index}`, { completed: true });
      const updated = [...user.goals];
      updated[index].completed = true; // ✅ mark completed
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

  // -------------------- JSX --------------------
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Left: Profile */}
      <motion.div
        className="flex flex-col space-y-6 border-2 border-blue-500 p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-2xl"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center w-full">
          {/* Profile Image / Initial Avatar */}
          <label className="cursor-pointer relative group">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-green-500 shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-green-700 mb-4 border-4 border-green-500 shadow-md group-hover:scale-105 transition-transform duration-300 flex items-center justify-center text-3xl font-bold text-white">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <p className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Click to change
            </p>
          </label>

          {/* Profile Info */}
          <div className="text-center mt-4 space-y-2 w-full">
            <div className="text-sm"><b>Name:</b> {user.name}</div>
            <div className="text-sm"><b>Email:</b> {user.email}</div>
            <div className="text-sm"><b>State:</b> {user.state || "—"}</div>
            <div className="text-sm"><b>Rank:</b> {rank ? `#${rank}` : "Not ranked yet"}</div>
            <div className="text-sm"><b>Badges:</b> {badgesCount}</div>
            <div className="text-sm"><b>Redeemed Items:</b> {redeemedCount}</div>
          </div>

          {/* Edit & Logout */}
          <div className="mt-4 w-full space-y-3">
            <h4 className="font-semibold text-sm mb-1 text-center text-gray-800 dark:text-gray-100">Edit Profile</h4>
            <input
              type="text"
              value={editableName}
              onChange={(e) => setEditableName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700"
            />
            <input
              type="text"
              value={editableState}
              onChange={(e) => setEditableState(e.target.value)}
              placeholder="Your state"
              className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700"
            />
            <button
              onClick={saveProfile}
              disabled={savingProfile}
              className="w-full px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
            >
              {savingProfile ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={logout}
              className="w-full px-3 py-2 rounded-lg border border-red-500 text-red-600 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              Logout
            </button>
          </div>
        </div>
      </motion.div>



      {/* Right: Badges, Goals, Community */}
      <motion.div
        className="md:col-span-2 space-y-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Badges */}
        <div className="border-2 border-blue-500 p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
          <h3 className="font-semibold mb-3 text-lg">Badges</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {user.badges?.map((b, i) => <BadgeCard key={i} badge={b} />)}
            {(!user.badges || user.badges.length === 0) && (
              <p className="text-sm text-gray-600 dark:text-gray-300 col-span-full">No badges earned yet. Complete actions and challenges to unlock badges!</p>
            )}
          </div>
        </div>

        {/* Redeemed Rewards */}
        <div className="border-2 border-blue-500 p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
          <h3 className="font-semibold mb-3 text-lg">Redeemed Rewards</h3>
          {redeemedCount === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">You haven't redeemed any rewards yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {user.rewards
                ?.filter((r) => r.redeemed)
                .map((r) => (
                  <div key={r.item} className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900 flex flex-col items-center text-center">
                    {r.image && (
                      <img src={r.image} alt={r.item} className="w-12 h-12 object-contain mb-1 rounded" />
                    )}
                    <div className="text-xs font-semibold">{r.item}</div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Goals */}
        <div className="border-2 border-blue-500 p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
          <h3 className="font-semibold mb-3 text-lg">Goals for Reducing Emissions</h3>

          {/* Suggested Goals */}
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestedGoals.map((g, i) => (
              <button
                key={i}
                onClick={() => addGoal(g)}
                className="px-3 py-1 text-sm rounded-full border hover:bg-green-100 dark:hover:bg-green-900"
              >
                {g}
              </button>
            ))}
          </div>

          {/* Custom Goal Input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Write your own goal..."
              className="flex-1 px-3 py-2 border rounded dark:bg-gray-700"
            />
            <button
              onClick={() => addGoal(newGoal)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add
            </button>
          </div>

          {/* User Goals */}
          <ul className="space-y-2">
            {user.goals?.map((goal, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center justify-between px-3 py-2 rounded hover:shadow-md ${goal.completed ? "bg-gray-300 line-through" : "bg-green-50 dark:bg-gray-700"
                  }`}
              >
                <input
                  type="text"
                  value={goal.text}
                  onChange={(e) => editGoal(index, e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                  disabled={goal.completed}
                />
                <div className="flex gap-2">
                  {!goal.completed && (
                    <button
                      onClick={() => completeGoal(index)}
                      className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                    >
                      ✅
                    </button>
                  )}
                  <button
                    onClick={() => deleteGoal(index)}
                    className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                  >
                    ❌
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Community */}
        <div className="border-2 border-blue-500 p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
          <h3 className="font-semibold mb-3 text-lg">My Community Activity</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Posts: {communityStats.posts} · Likes received: {communityStats.likes} · Comments made: {communityStats.comments}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
