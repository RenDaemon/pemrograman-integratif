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

client.getAllNotes({}, (error, notes) => {
  if (!error) {
    console.log('successfully fetch data')
    console.log(notes)
  } else {
    console.error(error)
  }
})