// backend/utils/generateChallenges.js
import User from "../models/User.js";

// Expanded pool of 70+ challenges
const challengePool = [
  { title: "Use Public Transport", description: "Take public transport instead of personal vehicle today.", pointsReward: 20, carbonReduction: 5, badgeReward: "Eco Commuter" },
  { title: "Plant a Tree", description: "Plant a tree in your garden or community.", pointsReward: 30, carbonReduction: 10, badgeReward: "Tree Planter" },
  { title: "Avoid Plastic", description: "Avoid using single-use plastic for one day.", pointsReward: 15, carbonReduction: 3, badgeReward: "Plastic-Free Hero" },
  { title: "Save Electricity", description: "Reduce electricity consumption by switching off unused devices.", pointsReward: 10, carbonReduction: 2, badgeReward: "Energy Saver" },
  { title: "Recycle Waste", description: "Recycle paper, plastic, and other recyclable items.", pointsReward: 15, carbonReduction: 4, badgeReward: "Recycler" },
  { title: "Use Bicycle or Walk", description: "Walk or cycle instead of using a vehicle.", pointsReward: 25, carbonReduction: 6, badgeReward: "Healthy Commuter" },
  { title: "Compost Organic Waste", description: "Compost kitchen or garden waste.", pointsReward: 15, carbonReduction: 5, badgeReward: "Composter" },
  { title: "Save Water", description: "Limit water usage by turning off taps when not needed.", pointsReward: 10, carbonReduction: 2, badgeReward: "Water Saver" },
  { title: "Switch to LED", description: "Replace incandescent bulbs with LED bulbs.", pointsReward: 10, carbonReduction: 3, badgeReward: "Bright Eco" },
  { title: "Unplug Devices", description: "Unplug electronic devices when not in use.", pointsReward: 10, carbonReduction: 2, badgeReward: "Plug-Out Hero" },
  { title: "Use Renewable Energy", description: "Use solar panels or other renewable energy sources.", pointsReward: 20, carbonReduction: 8, badgeReward: "Renewable Champion" },
  { title: "Eco-friendly Shopping", description: "Buy products with minimal packaging.", pointsReward: 15, carbonReduction: 3, badgeReward: "Green Shopper" },
  { title: "Bring Reusable Bag", description: "Use reusable bags for shopping.", pointsReward: 10, carbonReduction: 2, badgeReward: "Bag Hero" },
  { title: "Avoid Fast Fashion", description: "Avoid buying new clothes for a week.", pointsReward: 15, carbonReduction: 5, badgeReward: "Fashion Saver" },
  { title: "Use Energy-efficient Appliances", description: "Use appliances with high energy efficiency rating.", pointsReward: 15, carbonReduction: 4, badgeReward: "Efficiency Pro" },
  { title: "Carpool", description: "Share a ride with others to reduce emissions.", pointsReward: 20, carbonReduction: 5, badgeReward: "Carpooler" },
  { title: "Eat More Vegetables", description: "Replace one meal with a vegetarian option.", pointsReward: 10, carbonReduction: 2, badgeReward: "Veggie Lover" },
  { title: "Avoid Meat for a Day", description: "Go meatless for a day.", pointsReward: 15, carbonReduction: 4, badgeReward: "Meatless Hero" },
  { title: "Reduce Food Waste", description: "Consume leftovers or plan meals to avoid waste.", pointsReward: 10, carbonReduction: 3, badgeReward: "Waste Reducer" },
  { title: "Use Reusable Bottle", description: "Avoid single-use water bottles.", pointsReward: 10, carbonReduction: 2, badgeReward: "Bottle Saver" },
  { title: "Digital Documents", description: "Avoid printing and use digital documents.", pointsReward: 10, carbonReduction: 2, badgeReward: "Paperless Pro" },
  { title: "Use Eco-friendly Detergent", description: "Use biodegradable or eco-friendly cleaning products.", pointsReward: 10, carbonReduction: 2, badgeReward: "Clean Green" },
  { title: "Turn off Lights", description: "Turn off lights when leaving a room.", pointsReward: 5, carbonReduction: 1, badgeReward: "Light Saver" },
  { title: "Reduce Air Conditioning", description: "Use AC less or set a higher temperature.", pointsReward: 10, carbonReduction: 3, badgeReward: "Cool Saver" },
  { title: "Participate in Clean-up", description: "Join a community clean-up activity.", pointsReward: 20, carbonReduction: 5, badgeReward: "Community Hero" },
  { title: "Use Eco Apps", description: "Use apps to track carbon footprint.", pointsReward: 5, carbonReduction: 1, badgeReward: "App Eco" },
  { title: "Energy-efficient Shower", description: "Take shorter showers to save energy.", pointsReward: 10, carbonReduction: 2, badgeReward: "Shower Saver" },
  { title: "Reuse Items", description: "Repurpose old items instead of discarding.", pointsReward: 10, carbonReduction: 2, badgeReward: "Recycler Pro" },
  { title: "Buy Local Products", description: "Support local products to reduce transport emissions.", pointsReward: 15, carbonReduction: 3, badgeReward: "Local Hero" },
  { title: "Avoid Fast Food Packaging", description: "Choose restaurants with minimal packaging.", pointsReward: 10, carbonReduction: 2, badgeReward: "Packaging Saver" },
  { title: "Reduce Car Engine Idling", description: "Turn off car engine when stationary.", pointsReward: 10, carbonReduction: 2, badgeReward: "Idle Reducer" },
  { title: "Use Public Library", description: "Borrow books instead of buying new ones.", pointsReward: 5, carbonReduction: 1, badgeReward: "Book Smart" },
  { title: "Green Roof or Balcony Plants", description: "Grow plants on balcony or roof.", pointsReward: 15, carbonReduction: 4, badgeReward: "Plant Parent" },
  { title: "Eco-friendly Transport Week", description: "Use only sustainable transport for a week.", pointsReward: 50, carbonReduction: 15, badgeReward: "Transport Champion" },
  { title: "DIY Cleaning Products", description: "Make your own eco-friendly cleaning products.", pointsReward: 10, carbonReduction: 2, badgeReward: "DIY Green" },
  { title: "Use Recycled Paper", description: "Switch to recycled paper for printing.", pointsReward: 5, carbonReduction: 1, badgeReward: "Paper Recycler" },
  { title: "Reduce Hot Water Usage", description: "Use less hot water in showers or washing.", pointsReward: 10, carbonReduction: 3, badgeReward: "Hot Water Saver" },
  { title: "Share Eco Tips", description: "Teach others eco-friendly habits.", pointsReward: 10, carbonReduction: 2, badgeReward: "Eco Mentor" },
  { title: "Track Carbon Footprint", description: "Record your daily carbon usage.", pointsReward: 5, carbonReduction: 1, badgeReward: "Tracker" },
  { title: "Buy Second-hand Items", description: "Purchase second-hand items instead of new.", pointsReward: 10, carbonReduction: 2, badgeReward: "Second-hand Hero" },
  { title: "Support Eco Brands", description: "Buy from environmentally responsible brands.", pointsReward: 15, carbonReduction: 3, badgeReward: "Eco Supporter" },
  { title: "Avoid Disposable Cups", description: "Use reusable coffee cups.", pointsReward: 5, carbonReduction: 1, badgeReward: "Cup Saver" },
  { title: "Create Compost Bin", description: "Set up a compost bin for organic waste.", pointsReward: 20, carbonReduction: 5, badgeReward: "Compost Creator" },
  { title: "Home Insulation Check", description: "Check and improve insulation at home.", pointsReward: 20, carbonReduction: 4, badgeReward: "Insulation Inspector" },
  { title: "Switch to Cold Water Laundry", description: "Wash clothes in cold water.", pointsReward: 10, carbonReduction: 3, badgeReward: "Cold Wash Hero" },
  { title: "Bike to Work", description: "Use bicycle instead of car for commute.", pointsReward: 25, carbonReduction: 6, badgeReward: "Bike Commuter" },
  { title: "Use Public Bike Share", description: "Use shared bicycles instead of cars.", pointsReward: 20, carbonReduction: 5, badgeReward: "Shared Rider" },
  { title: "Pick Up Litter", description: "Pick up litter in your area.", pointsReward: 10, carbonReduction: 2, badgeReward: "Litter Hero" },
  { title: "Plant Indoor Plants", description: "Add indoor plants to improve air quality.", pointsReward: 10, carbonReduction: 2, badgeReward: "Indoor Gardener" },
  { title: "Solar Water Heating", description: "Use solar energy to heat water.", pointsReward: 25, carbonReduction: 8, badgeReward: "Solar Pro" },
  { title: "Reduce Packaging Waste", description: "Avoid products with excessive packaging.", pointsReward: 10, carbonReduction: 2, badgeReward: "Package Reducer" },
  { title: "Use Car-sharing Services", description: "Share rides to reduce emissions.", pointsReward: 20, carbonReduction: 5, badgeReward: "Ride Sharer" },
  { title: "Eco-friendly Gifts", description: "Give gifts with minimal environmental impact.", pointsReward: 10, carbonReduction: 2, badgeReward: "Green Giver" },
  { title: "Volunteer in Tree Plantation", description: "Participate in tree plantation drives.", pointsReward: 25, carbonReduction: 7, badgeReward: "Tree Volunteer" },
  { title: "Use Energy-efficient Fridge", description: "Switch to an energy-efficient refrigerator.", pointsReward: 15, carbonReduction: 4, badgeReward: "Fridge Saver" },
  { title: "Switch to Natural Cleaning Products", description: "Use non-toxic cleaning products.", pointsReward: 10, carbonReduction: 2, badgeReward: "Green Cleaner" },
  { title: "Use Eco-friendly Paint", description: "Choose paints with low VOC.", pointsReward: 10, carbonReduction: 2, badgeReward: "Paint Green" },
  { title: "Eco-friendly Travel", description: "Plan a vacation with minimal environmental impact.", pointsReward: 20, carbonReduction: 5, badgeReward: "Travel Green" },
  { title: "Avoid Single-use Straws", description: "Use reusable or no straws.", pointsReward: 5, carbonReduction: 1, badgeReward: "Straw Saver" },
  { title: "Create Rainwater Harvesting", description: "Set up a rainwater collection system.", pointsReward: 25, carbonReduction: 7, badgeReward: "Rain Harvester" },
];


// Generate new challenges for a user
export async function generateDailyChallenges(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    user.challenges = user.challenges || [];

    const today = new Date().toISOString().split("T")[0];

    // Check if today's challenges already exist
    const hasTodayChallenge = user.challenges.some(
      (c) => c.startDate && c.startDate.toISOString().split("T")[0] === today && !c.completed
    );
    if (hasTodayChallenge) return user;

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
      availableChallenges = challengePool;
    }

    // Pick 2 random challenges for today
    const newChallenges = [];
    const poolCopy = [...availableChallenges];
    for (let i = 0; i < 2 && poolCopy.length > 0; i++) {
      const idx = Math.floor(Math.random() * poolCopy.length);
      const challenge = poolCopy.splice(idx, 1)[0];

      // Ensure badgeReward exists
      const badgeReward = challenge.badgeReward || `${challenge.title} Badge`;

      newChallenges.push({
        ...challenge,
        badgeReward, 
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


