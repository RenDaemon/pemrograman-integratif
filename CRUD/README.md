
# CRUD gRPC project
## Pre-requisite
- Node js
- Firebase
- @grpc/grpc-js
- @grpc/proto-loader
- express

Dalam project ini saya menggunakan bahasa Nodejs, Firebase sebagai database, dan express untuk membuat endpoint.

## Struktur file 
server.js  
client.js    
controller.js   
config.js  
notes.proto
tes.js

## CRUD function
### server.js 
`untuk menyalakan service gRPC `  
Fungsi CRUD pada server yang terhubung dengan firebase database
```sh
server.addService(notesProto.NotesService.service, {
    getAllNotes: (call, callback) => {
      notesRef.get()
        .then(querySnapshot => {
          const notes = [];
          querySnapshot.forEach(doc => {
            notes.push({ ...doc.data(), id: doc.id });
          });
          callback(null, { notes });
        })
        .catch(error => {
          console.error(error);
          callback(error, { notes: [] });
        });
    },
    addNotes: (call, callback) => {
      const _notes = { ...call.request };
      notesRef.add(_notes)
        .then(docRef => {
          callback(null, { ..._notes, id: docRef.id });
        })
        .catch(error => {
          console.error(error);
          callback(error, { ..._notes });
        });
    },
    deleteNotes: (call, callback) => {
      const notesId = call.request.id;
      notesRef.doc(notesId).delete()
        .then(() => {
          callback(null, { notes: [] });
        })
        .catch(error => {
          console.error(error);
          callback(error, { notes: [] });
        });
    },
    editNotes: (call, callback) => {
      const notesId = call.request.id;
      const notesRefItem = notesRef.doc(notesId);
      const notesItem = { ...call.request };
      notesRefItem.set(notesItem)
        .then(() => {
          callback(null, { ...notesItem, id: notesId });
        })
        .catch(error => {
          console.error(error);
          callback(error, { ...notesItem });
        });
    },
    getNotes: (call, callback) => {
      const notesId = call.request.id;
      notesRef.doc(notesId).get()
        .then(docSnapshot => {
          if (docSnapshot.exists) {
            callback(null, { ...docSnapshot.data(), id: docSnapshot.id });
          } else {
            callback(null, { id: null });
          }
        })
        .catch(error => {
          console.error(error);
          callback(error, { id: null });
        });
    },
  });
``` 
### client.js
`untuk memanggil service gRPC`  
Contoh pemanggilan fungsi CRUD pada client
```sh
module.exports = client;

//Contoh pemanggilan fungsi CRUD pada client.js

client.addNotes(
  {
    id: "3",
    title: "Note 3",
    content: "Content 3",
    count: 90
  },
  (error, notes) => {
    if (!error) {
      console.log('successfully create data')
      console.log(notes)
    } else {
      console.error(error)
    }
  }
)
```
### notes.proto 
`file proto untuk project gRPC CRUD`  
```
syntax = "proto3";

message Notes {
    string id = 1;
    string title = 2;
    string content = 3;
    int32 count = 4;
}

service NotesService {
    rpc getAllNotes (Empty) returns (NotesList) {}
    rpc getNotes (NotesId) returns (Notes) {}
    rpc deleteNotes (NotesId) returns (Empty) {}
    rpc editNotes (Notes) returns (Notes) {}
    rpc addNotes (Notes) returns (Notes) {}
}

message Empty {}

message NotesList {
   repeated Notes notes = 1;
}

message NotesId {
    string id = 1;
}
```
### config.js 
`config untuk menghubungkan ke firebase`
```sh
const firebase = require('firebase/compat/app');
require('firebase/compat/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyA3I-TPs-BKt89HMe3rdlOmvWLAW7YAafQ",
    authDomain: "grpc-45e9c.firebaseapp.com",
    projectId: "grpc-45e9c",
    storageBucket: "grpc-45e9c.appspot.com",
    messagingSenderId: "1036332256902",
    appId: "1:1036332256902:web:14b2e3a3d404c3e2da0b07"
  };
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();

  module.exports = { firebaseApp, db };
```
### controller.js
`untuk mengatur endpoint menggunakan express`
```sh
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
```
### tes.js
`untuk testing semua fungsi CRUD berjalan dengan lancar`
```sh
const client = require("./client");

// read data 
client.getAllNotes({}, (error, notes) => {
  if (!error) {
    console.log('successfully fetch data')
    console.log(notes)
  } else {
    console.error(error)
  }
})

// add notes 
client.addNotes(
  {
    id: "3",
    title: "Note 3",
    content: "Content 3",
    count: 90
  },
  (error, notes) => {
    if (!error) {
      console.log('successfully create data')
      console.log(notes)
    } else {
      console.error(error)
    }
  }
)

// edit notes 
client.editNotes(
  {
    id: "2",
    title: "Note 2 edited",
    content: "Content 2 edited",
    count: 100
  },
  (error, notes) => {
    if (!error) {
      console.log('successfully edit data')
      console.log(notes)
    } else {
      console.error(error)
    }
  }
)

// delete notes 
client.deleteNotes(
  {
    id: "2"
  }, 
  (error, notes) => {
    if (!error) {
      console.log('successfully delete data')
      console.log(notes)
    } else {
      console.error(error)
    }
  }
)
```