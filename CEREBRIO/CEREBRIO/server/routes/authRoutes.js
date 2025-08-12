const express = require('express');
const passport = require('passport');
const router = express.Router();

// Step 1: Start Google OAuth flow
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

// Step 2: Google redirects here after successful authentication
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
        session: true // keep user session if you're using express-session
    }),
    (req, res) => {
        // ✅ Redirect to frontend dashboard after login
        res.redirect('http://localhost:3000/dashboard'); // update with your frontend dashboard URL
    }
);

// Step 3: Logout user and destroy session
router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('http://localhost:3000'); // Redirect to homepage after logout
    });
});

// Step 4: Get currently logged-in user
router.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user); // Send user object to frontend
    } else {
        res.status(401).json({ message: "Not authenticated" });
    }
});

module.exports = router;
