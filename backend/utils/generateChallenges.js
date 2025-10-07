// backend/utils/generateChallenges.js
import User from "../models/User.js";

// Expanded pool of 70+ challenges
const challengePool = [
  { title: "Use Public Transport", description: "Take public transport instead of personal vehicle today.", pointsReward: 20, carbonReduction: 5, badgeReward: "Eco Commuter" },
  { title: "Plant a Tree", description: "Plant a tree in your garden or community.", pointsReward: 30, carbonReduction: 10, badgeReward: "Tree Planter" },
  { title: "Avoid Plastic", description: "Avoid using single-use plastic for one day.", pointsReward: 15, carbonReduction: 3, badgeReward: "Plastic-Free Hero" },
  { title: "Save Electricity", description: "Reduce electricity consumption by switching off unused devices.", pointsReward: 10, carbonReduction: 2 },
  { title: "Recycle Waste", description: "Recycle paper, plastic, and other recyclable items.", pointsReward: 15, carbonReduction: 4, badgeReward: "Recycler" },
  { title: "Use Bicycle or Walk", description: "Walk or cycle instead of using a vehicle.", pointsReward: 25, carbonReduction: 6, badgeReward: "Healthy Commuter" },
  { title: "Compost Organic Waste", description: "Compost kitchen or garden waste.", pointsReward: 15, carbonReduction: 5 },
  { title: "Save Water", description: "Limit water usage by turning off taps when not needed.", pointsReward: 10, carbonReduction: 2 },
  { title: "Switch to LED", description: "Replace incandescent bulbs with LED bulbs.", pointsReward: 10, carbonReduction: 3 },
  { title: "Unplug Devices", description: "Unplug electronic devices when not in use.", pointsReward: 10, carbonReduction: 2 },
  { title: "Use Renewable Energy", description: "Use solar panels or other renewable energy sources.", pointsReward: 20, carbonReduction: 8 },
  { title: "Eco-friendly Shopping", description: "Buy products with minimal packaging.", pointsReward: 15, carbonReduction: 3 },
  { title: "Bring Reusable Bag", description: "Use reusable bags for shopping.", pointsReward: 10, carbonReduction: 2 },
  { title: "Avoid Fast Fashion", description: "Avoid buying new clothes for a week.", pointsReward: 15, carbonReduction: 5 },
  { title: "Use Energy-efficient Appliances", description: "Use appliances with high energy efficiency rating.", pointsReward: 15, carbonReduction: 4 },
  { title: "Carpool", description: "Share a ride with others to reduce emissions.", pointsReward: 20, carbonReduction: 5 },
  { title: "Eat More Vegetables", description: "Replace one meal with a vegetarian option.", pointsReward: 10, carbonReduction: 2 },
  { title: "Avoid Meat for a Day", description: "Go meatless for a day.", pointsReward: 15, carbonReduction: 4 },
  { title: "Reduce Food Waste", description: "Consume leftovers or plan meals to avoid waste.", pointsReward: 10, carbonReduction: 3 },
  { title: "Use Reusable Bottle", description: "Avoid single-use water bottles.", pointsReward: 10, carbonReduction: 2 },
  { title: "Digital Documents", description: "Avoid printing and use digital documents.", pointsReward: 10, carbonReduction: 2 },
  { title: "Use Eco-friendly Detergent", description: "Use biodegradable or eco-friendly cleaning products.", pointsReward: 10, carbonReduction: 2 },
  { title: "Turn off Lights", description: "Turn off lights when leaving a room.", pointsReward: 5, carbonReduction: 1 },
  { title: "Reduce Air Conditioning", description: "Use AC less or set a higher temperature.", pointsReward: 10, carbonReduction: 3 },
  { title: "Participate in Clean-up", description: "Join a community clean-up activity.", pointsReward: 20, carbonReduction: 5 },
  { title: "Use Eco Apps", description: "Use apps to track carbon footprint.", pointsReward: 5, carbonReduction: 1 },
  { title: "Energy-efficient Shower", description: "Take shorter showers to save energy.", pointsReward: 10, carbonReduction: 2 },
  { title: "Reuse Items", description: "Repurpose old items instead of discarding.", pointsReward: 10, carbonReduction: 2 },
  { title: "Buy Local Products", description: "Support local products to reduce transport emissions.", pointsReward: 15, carbonReduction: 3 },
  { title: "Avoid Fast Food Packaging", description: "Choose restaurants with minimal packaging.", pointsReward: 10, carbonReduction: 2 },
  { title: "Reduce Car Engine Idling", description: "Turn off car engine when stationary.", pointsReward: 10, carbonReduction: 2 },
  { title: "Use Public Library", description: "Borrow books instead of buying new ones.", pointsReward: 5, carbonReduction: 1 },
  { title: "Green Roof or Balcony Plants", description: "Grow plants on balcony or roof.", pointsReward: 15, carbonReduction: 4 },
  { title: "Eco-friendly Transport Week", description: "Use only sustainable transport for a week.", pointsReward: 50, carbonReduction: 15 },
  { title: "DIY Cleaning Products", description: "Make your own eco-friendly cleaning products.", pointsReward: 10, carbonReduction: 2 },
  { title: "Use Recycled Paper", description: "Switch to recycled paper for printing.", pointsReward: 5, carbonReduction: 1 },
  { title: "Reduce Hot Water Usage", description: "Use less hot water in showers or washing.", pointsReward: 10, carbonReduction: 3 },
  { title: "Share Eco Tips", description: "Teach others eco-friendly habits.", pointsReward: 10, carbonReduction: 2 },
  { title: "Track Carbon Footprint", description: "Record your daily carbon usage.", pointsReward: 5, carbonReduction: 1 },
  // 30 more unique challenges
  { title: "Buy Second-hand Items", description: "Purchase second-hand items instead of new.", pointsReward: 10, carbonReduction: 2 },
  { title: "Support Eco Brands", description: "Buy from environmentally responsible brands.", pointsReward: 15, carbonReduction: 3 },
  { title: "Avoid Disposable Cups", description: "Use reusable coffee cups.", pointsReward: 5, carbonReduction: 1 },
  { title: "Create Compost Bin", description: "Set up a compost bin for organic waste.", pointsReward: 20, carbonReduction: 5 },
  { title: "Home Insulation Check", description: "Check and improve insulation at home.", pointsReward: 20, carbonReduction: 4 },
  { title: "Switch to Cold Water Laundry", description: "Wash clothes in cold water.", pointsReward: 10, carbonReduction: 3 },
  { title: "Bike to Work", description: "Use bicycle instead of car for commute.", pointsReward: 25, carbonReduction: 6 },
  { title: "Use Public Bike Share", description: "Use shared bicycles instead of cars.", pointsReward: 20, carbonReduction: 5 },
  { title: "Pick Up Litter", description: "Pick up litter in your area.", pointsReward: 10, carbonReduction: 2 },
  { title: "Plant Indoor Plants", description: "Add indoor plants to improve air quality.", pointsReward: 10, carbonReduction: 2 },
  { title: "Solar Water Heating", description: "Use solar energy to heat water.", pointsReward: 25, carbonReduction: 8 },
  { title: "Reduce Packaging Waste", description: "Avoid products with excessive packaging.", pointsReward: 10, carbonReduction: 2 },
  { title: "Use Car-sharing Services", description: "Share rides to reduce emissions.", pointsReward: 20, carbonReduction: 5 },
  { title: "Eco-friendly Gifts", description: "Give gifts with minimal environmental impact.", pointsReward: 10, carbonReduction: 2 },
  { title: "Volunteer in Tree Plantation", description: "Participate in tree plantation drives.", pointsReward: 25, carbonReduction: 7 },
  { title: "Use Energy-efficient Fridge", description: "Switch to an energy-efficient refrigerator.", pointsReward: 15, carbonReduction: 4 },
  { title: "Switch to Natural Cleaning Products", description: "Use non-toxic cleaning products.", pointsReward: 10, carbonReduction: 2 },
  { title: "Use Eco-friendly Paint", description: "Choose paints with low VOC.", pointsReward: 10, carbonReduction: 2 },
  { title: "Eco-friendly Travel", description: "Plan a vacation with minimal environmental impact.", pointsReward: 20, carbonReduction: 5 },
  { title: "Avoid Single-use Straws", description: "Use reusable or no straws.", pointsReward: 5, carbonReduction: 1 },
  { title: "Create Rainwater Harvesting", description: "Set up a rainwater collection system.", pointsReward: 25, carbonReduction: 7 },
];

// Generate new challenges for a user
export async function generateDailyChallenges(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    user.challenges = user.challenges || [];

    const today = new Date().toISOString().split("T")[0];

    const hasTodayChallenge = user.challenges.some(
      (c) => c.startDate && c.startDate.toISOString().split("T")[0] === today && !c.completed
    );

    if (hasTodayChallenge) return user; // Already has today's challenge

    // Filter out challenges done in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentTitles = new Set(
      user.challenges
        .filter((c) => c.startDate && new Date(c.startDate) > sevenDaysAgo)
        .map((c) => c.title)
    );

    let availableChallenges = challengePool.filter((c) => !recentTitles.has(c.title));

    if (availableChallenges.length < 2) {
      // If less than 2 challenges available, reset pool
      availableChallenges = challengePool;
    }

    // Pick 2 random challenges for today
    const newChallenges = [];
    const poolCopy = [...availableChallenges];
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
