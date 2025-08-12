const express = require("express");
const router = express.Router();
const leaderboardController = require("../controllers/leaderboardController");

// Leaderboard Donatur
router.get("/donors/top", leaderboardController.getTopDonors);
router.get("/donors/rank/:userId", leaderboardController.getUserDonationRank);

// Leaderboard Komunitas
router.get("/communities/top", leaderboardController.getTopCommunities);
router.get("/communities/rank/:communityId", leaderboardController.getCommunityContributionRank);

// Visualisasi Data
router.get("/data/categories", leaderboardController.getDonationCategoryCounts);
router.get("/data/provinces", leaderboardController.getProvinceDonationCounts);

module.exports = router;
