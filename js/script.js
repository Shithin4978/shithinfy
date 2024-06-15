// Firebase project configuration (replace with your own)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to the database
const database = firebase.database();

// Create button click event listener
document.getElementById('create-btn').addEventListener('click', createItem);

// Function to create a new item
function createItem() {
  const itemName = document.getElementById('item-name').value;

  // Error handling for empty name
  if (!itemName) {
    alert('Please enter an item name.');
    return;
  }

  const newItemId = database.ref('items').push().key; // Generate unique ID
  database.ref(`items/${newItemId}`).set({ name: itemName })
    .then(() => {
      alert('Item created successfully!');
      document.getElementById('item-name').value = ''; // Clear input field
      getItems(); // Refresh item list
    })
    .catch(error => {
      console.error('Error creating item:', error);
      alert('An error occurred. Please try again.');
    });
}

// Function to get all items and display them in the list
function getItems() {
  const itemRef = database.ref('items');

  itemRef.on('value', snapshot => {
    const items = snapshot.val();
    const itemList = document.getElementById('item-list');
    itemList.innerHTML = ''; // Clear previous list items

    if (items) {
      Object.keys(items).forEach(itemId => {
        const item = items[itemId];
        const listItem = document.createElement('li');
        listItem.textContent = item.name;

        // Add buttons for update and delete (optional)
        const updateBtn = document.createElement('button');
        updateBtn.textContent = 'Update';
        updateBtn.addEventListener('click', () => updateItem(itemId, item.name));
        listItem.appendChild(updateBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteItem(itemId));
        listItem.appendChild(deleteBtn);

        itemList.appendChild(listItem);
      });
    } else {
      itemList.innerHTML = '<li>No items found.</li>';
    }
  });
}

// Function to update an item (optional)
function updateItem(itemId, currentName) {
  const newName = prompt('Enter the new name for the item:', currentName);

  if (!newName) {
    return;
  }

  database.ref(`items/${itemId}`).set({ name: newName })
    .then(() => {
      alert('Item updated successfully!');
      getItems(); // Refresh item list
    })
    .catch(error
