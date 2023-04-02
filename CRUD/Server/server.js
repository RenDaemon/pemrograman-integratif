const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "./note.proto";
const { db } = require("./config.js");
const notesRef = db.collection('notes');
const notesController = require('./controller');
const app = require('express')();

app.use('/api', notesController);

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const notesProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
let notes = {
    notes:  [
        { id: "1", title: "Note 1", content: "Content 1", count: 3 },
        { id: "2", title: "Note 2", content: "Content 2", count: 4 },
      ]
}


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

server.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server running at http://127.0.0.1:50051");
    server.start();
  }
);

app.listen(5000, () => {
    console.log('Server listening on port 5000');
  });