const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "./note.proto";

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const NotesService = grpc.loadPackageDefinition(packageDefinition).NotesService;

const client = new NotesService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

module.exports = client;

//Contoh pemanggilan fungsi CRUD pada client.js

// client.addNotes(
//   {
//     id: "3",
//     title: "Note 3",
//     content: "Content 3",
//     count: 90
//   },
//   (error, notes) => {
//     if (!error) {
//       console.log('successfully create data')
//       console.log(notes)
//     } else {
//       console.error(error)
//     }
//   }
// )