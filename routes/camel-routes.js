const express = require('express');


const CamelModel = require('../models/camel-model');


const router = express.Router();


router.post('/api/camels', (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: 'Log in to make camels. 🐫' });
      return;
    }

    const theCamel = new CamelModel({
      name: req.body.camelName,
      color: req.body.camelColor,
      humps: req.body.camelHumps,
      user: req.user._id
    });

    theCamel.save((err) => {
        // Unknown error from the database
        if (err && theCamel.errors === undefined) {
          res.status(500).json({ message: 'Camel save went to camel 💩' });
          return;
        }

        // Validation error
        if (err && theCamel.errors) {
          res.status(400).json({
            nameError: theCamel.errors.name,
            colorError: theCamel.errors.color,
            humpError: theCamel.errors.humps
          });
          return;
        }

        // Success!
        res.status(200).json(theCamel);
    }); // close theCamel.save()
}); // close router.post('/api/camels', ...


router.get('/api/camels', (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: 'Log in to see camels. 🐫' });
      return;
    }

    CamelModel
      .find()

      // retrieve all the info of the owners (needs "ref" in model)
      .populate('user', { encryptedPassword: 0 })
      // don't retrieve "encryptedPassword" though

      .exec((err, allTheCamels) => {
          if (err) {
            res.status(500).json({ message: 'Camel find went to 💩' });
            return;
          }

          res.status(200).json(allTheCamels);
      });
}); // close router.get('/api/camels', ...


module.exports = router;
