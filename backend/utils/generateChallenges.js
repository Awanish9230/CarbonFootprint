// backend/utils/generateChallenges.js
import User from "../models/User.js";

// Example pool of challenges
const challengePool = [
  {
    title: "Use Public Transport",
    description: "Take public transport instead of personal vehicle today.",
    pointsReward: 20,
    carbonReduction: 5,
    badgeReward: "Eco Commuter",
  },
  {
    title: "Plant a Tree",
    description: "Plant a tree in your garden or community.",
    pointsReward: 30,
    carbonReduction: 10,
    badgeReward: "Tree Planter",
  },
  {
    title: "Avoid Plastic",
    description: "Avoid using single-use plastic for one day.",
    pointsReward: 15,
    carbonReduction: 3,
    badgeReward: "Plastic-Free Hero",
  },
  {
    title: "Save Electricity",
    description: "Reduce electricity consumption by switching off unused devices.",
    pointsReward: 10,
    carbonReduction: 2,
  },
];

// Generate new challenges for a user
export async function generateDailyChallenges(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    user.challenges = user.challenges || [];

    // Only generate if there are no active challenges
    const today = new Date().toISOString().split("T")[0];
    const hasTodayChallenge = user.challenges.some(
      (c) =>
        c.startDate &&
        c.startDate.toISOString().split("T")[0] === today &&
        !c.completed
    );

    if (hasTodayChallenge) return user; // Already has today's challenge

    // Pick 2 random challenges from pool
    const newChallenges = [];
    const poolCopy = [...challengePool];

    for (let i = 0; i < 2 && poolCopy.length > 0; i++) {
      const idx = Math.floor(Math.random() * poolCopy.length);
      const challenge = poolCopy.splice(idx, 1)[0];

      newChallenges.push({
        ...challenge,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        completed: false,
        progress: 0,
      });
    }

    user.challenges.push(...newChallenges);
    await user.save();

    return user;
  } catch (err) {
    console.error("Error generating daily challenges:", err.message);
    return null;
  }
}
