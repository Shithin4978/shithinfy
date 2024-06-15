// Reference to the Firebase Realtime Database
const dbRef = database.ref('/data');

// Function to create data
function createData() {
  const name = document.getElementById('name').value.trim();
  if (name !== '') {
    const newData = {
      name: name
    };
    dbRef.push(newData);
    document.getElementById('name').value = '';
    fetchData();
  } else {
    alert('Please enter a name');
  }
}

// Function to read data
function fetchData() {
  dbRef.on('value', function(snapshot) {
    const dataList = document.getElementById('dataList');
    dataList.innerHTML = '';
    snapshot.forEach(function(childSnapshot) {
      const data = childSnapshot.val();
      const li = document.createElement('li');
      li.innerText = data.name;
      dataList.appendChild(li);
    });
  });
}

// Function to update data
function updateData() {
  const newName = document.getElementById('updateName').value.trim();
  if (newName !== '') {
    dbRef.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        const data = childSnapshot.val();
        if (data.name === newName) {
          const key = childSnapshot.key;
          dbRef.child(key).update({ name: newName });
        }
      });
    });
    document.getElementById('updateName').value = '';
    fetchData();
  } else {
    alert('Please enter a new name');
  }
}

// Function to delete data
function deleteData() {
  const nameToDelete = document.getElementById('deleteName').value.trim();
  if (nameToDelete !== '') {
    dbRef.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        const data = childSnapshot.val();
        if (data.name === nameToDelete) {
          const key = childSnapshot.key;
          dbRef.child(key).remove();
        }
      });
    });
    document.getElementById('deleteName').value = '';
    fetchData();
  } else {
    alert('Please enter a name to delete');
  }
}

// Fetch initial data on page load
fetchData();
