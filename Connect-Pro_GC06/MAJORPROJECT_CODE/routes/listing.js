const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); // there is single written in listing.js file
const Listing = require("../models/listing.js"); // there is single written in listing.js file
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js"); // requiring specific things only
const listingController = require("../controllers/listings.js"); //need all the things
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn, 
    upload.single('listing[image]'),  //here multer will process the image data in listing, it will take the data in req.file
    validateListing,
    wrapAsync(listingController.createListing)
);

// new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
   .route("/:id")
   .get(wrapAsync(listingController.showListing))
   .put(isLoggedIn, 
    isOwner, 
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingController.updateListing))
   .delete(isLoggedIn, 
    isOwner, 
    wrapAsync(listingController.destroyListing)
);

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;

// index route
// router.get("/",wrapAsync(listingController.index));

// show route
// router.get("/:id", wrapAsync(listingController.showListing));

// create route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// update route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// delete route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));
