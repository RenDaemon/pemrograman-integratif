const express = require('express');
const router = express.Router();
const client = require('./client');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

// Get all notes
router.get('/notes', (req, res) => {
  client.getAllNotes({}, (error, response) => {
    if (error) {
      console.error(error);
      res.status(500).send(error);
    } else {
      res.send(response);
    }
  });
});

// Add a new note
router.post('/notes', (req, res) => {
  const count = req.body.count;
  const title = req.body.title;
  const content = req.body.content;

  const notesItem = {
    count: count,
    title: title,
    content: content,
  };

  client.addNotes(notesItem, (error, response) => {
    if (error) {
      console.error(error);
      res.status(500).send(error);
    } else {
      res.send(response);
    }
  });
});

// Delete a note
router.delete('/notes/:id', (req, res) => {
  const notesId = req.params.id;

  const notesItem = {
    id: notesId,
  };

  client.deleteNotes(notesItem, (error, response) => {
    if (error) {
      console.error(error);
      res.status(500).send(error);
    } else {
      res.send(response);
    }
  });
});

// Get a single note by ID
router.get('/notes/:id', (req, res) => {
  const notesId = req.params.id;

  const notesItem = {
    id: notesId,
  };

  client.getNotes(notesItem, (error, response) => {
    if (error) {
      console.error(error);
      res.status(500).send(error);
    } else {
      res.send(response);
    }
  });
});

// Edit a note
router.post('/notes/:id/edit', (req, res) => {
  const notesId = req.params.id;

  const notesItem = {
    id: notesId,
    count: req.body.count,
    title: req.body.title,
    content: req.body.content,
  };

  client.editNotes(notesItem, (error, response) => {
    if (error) {
      console.error(error);
      res.status(500).send(error);
    } else {
      res.send(response);
    }
  });
});

module.exports = router;