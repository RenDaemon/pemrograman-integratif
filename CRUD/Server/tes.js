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