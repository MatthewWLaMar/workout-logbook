let express = require("express");
let router = express.Router();
let validateSession = require("../middleware/validate-session");
const Logbook = require("../db").import("../models/logbook");

/********************
 *** ENTRY CREATE ***
 *******************/

router.post("/log", validateSession, (req, res) => {
  const logbookEntry = {
    description: req.body.logbook.description,
    definition: req.body.logbook.definition,
    results: req.body.logbook.results,
    owner_id: req.user.id,
  };
  Logbook.create(logbookEntry)
    .then((logbook) => res.status(200).json(logbook))
    .catch((err) => res.status(500).json({ error: err }));
});

/************************
*** FIND USER ENTRIES ***
************************/

router.get("/log", validateSession, (req, res) => {
  let userid = req.user.id;
  Logbook.findAll({
    where: { owner_id: userid },
  })
    .then((logbooks) => res.status(200).json(logbooks))
    .catch((err) => res.status(500).json({ error: err }));
});

/**************************
*** FIND SPECIFIC ENTRY ***
**************************/

router.get("/log/:id", validateSession, (req, res) => {
    let logid = req.params.id; 
    Logbook.findAll({
      where: { id: logid },
    })
      .then((logbooks) => res.status(200).json(logbooks))
      .catch((err) => res.status(500).json({ error: err }));
  });

/****************************
*** UPDATE SPECIFIC ENTRY ***
****************************/

router.put("/log/:id", validateSession, function (req, res) {
  const updateLogbookEntry = {
    description: req.body.logbook.description,
    definition: req.body.logbook.definition,
    results: req.body.logbook.results,   
  };

  const query = { where: { id: req.params.id, owner_id: req.user.id } };

  Logbook.update(updateLogbookEntry, query)
    .then((logbooks) => res.status(200).json(logbooks))
    .catch((err) => res.status(500).json({ error: err }));
});

/***************************
*** DELETE LOGBOOK ENTRY ***
***************************/

router.delete("/log/:id", validateSession, function (req, res) {
    const query = { where: { id: req.params.id, owner_id: req.user.id } };
  
    Logbook.destroy(query)
      .then(() => res.status(200).json({ message: "Logbook Entry Removed" }))
      .catch((err) => res.status(500).json({ error: err }));
  });

module.exports = router;
