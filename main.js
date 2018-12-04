// STORAGE CONTROLLER
const StorageCtrl = (function(){
    
    // public methods
    return {
          
    }
})();

// ITEM CONTROLLER
const ItemCtrl = (function(){
    
    // item constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // data structure / state
    const data = {
        items: [
            // {id: 0, name: 'Steak Dinner', calories: 1100},
            // {id: 1, name: 'Cookie', calories: 200},
            // {id: 2, name: 'Eggs', calories: 350}
        ],
        currentItem: null,
        totalCalories: 0
    }

    // public 
    return {
        getItems: () => {
            return data.items;
        },
        addItem: (name, calories) => {
            // create id for item
            let id;
            if (data.items.length > 0) {
                id = data.items[data.items.length -1].id + 1;   // data array items' index ([]) is zero-based and will increment by one             
            } else {
                id = 0;
            }

            // calories to number
            calories = parseInt(calories);

            // create a new item, add to items array
            newItem = new Item(id, name, calories);
            data.items.push(newItem);

            return newItem;
        },
        getItemById: (ID) => {
            let found = null;

            // loop through item
            data.items.forEach((item) => {
                if (item.id === ID) {
                    found = item;
                } 
            });
            return found;
        },
        updateItem: (name, calories) => {
            // turn cals to number
            calories = parseInt(calories);

            let found = null;

            // update the item structure
            data.items.forEach((item) => {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: (id) => {
            // get id
            const ids = data.items.map((item) => {
                return item.id
            });

            // get index
            const index = ids.indexOf(id);

            // remove item from data structure
            data.items.splice(index, 1);
        },
        clearAllItems: () => {
            data.items = [];
        },
        setCurrentItem: (itemToEdit) => {
            data.currentItem = itemToEdit;
        },
        getCurrentItem: () => {
            return data.currentItem;
        },
        getTotalCalories: () => {
            let total = 0;

            // loop through items to add cals
            data.items.forEach((item) => {
                total += item.calories;
            });

            // set ttl cal in the data structure
            data.totalCalories = total;

            return data.totalCalories;
        },
        logData: () => {
            return data;
        }
    }
})();

// UI CONTROLLER
const UICtrl = (function(){
   
    // create UI selector
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    };

    // public 
    return {
        populateItemList: (items) => {
            let html = '';

            items.forEach((item) => {
                html += `<li class="collection-item" id="item-${item.id}">
                            <strong>${item.name}: </strong><em>${item.calories} calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>
                        </li>`;
            });

            // insert lis
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: () => {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: (item) => {
            // show the list (otherwise no visible items will be added to DOM)
            document.querySelector(UISelectors.itemList).style.display = 'block';

            // create li elem
            const li = document.createElement('li');
            // add class to li
            li.className = 'collection-item';
            // add id to li
            li.id = `item-${item.id}`;
            // add html
            li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>`;
            // insert li elem
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

        },
        updateListItem: (item) => {
            // get node list
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // convert node list into array
            listItems = Array.from(listItems);

            // loop through
            listItems.forEach((listItem) => {
                let itemId = listItem.getAttribute('id');

                if (itemId === `item-${item.id}`) {
                    document.querySelector(`#${itemId}`).innerHTML = 
                    `<strong>${item.name}: </strong><em>${item.calories} calories</em>
                     <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                     </a>`;
                }
            });
        },
        deleteListItem: (id) => {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCals(totalCalories);
            UICtrl.clearEditState();
        },
        clearInputs: () => {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: () => {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: () => {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            
            // turn node list into array
            listItems = Array.from(listItems);
            listItems.forEach((item) => {
                item.remove();  
            });
        },
        hideList: () => {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCals: (totalCalories) => {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: () => {
            UICtrl.clearInputs();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: () => {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: () => {
            return UISelectors;
        }
    }
})();

// MAIN APP CONTROLLER
const AppCtrl = (function(ItemCtrl, UICtrl){                // add StorageCtrl
    
    // load all event listeners
    const loadEventListeners = () => {
        // get UI selectors
        const UISelectors = UICtrl.getSelectors();

        // add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // disable enter key on submit
        document.addEventListener('keypress', (e) => {
            if (e.keyCode === 13 || e.which === 13) { 
                e.preventDefault();
                return false;
            }
        });

        // edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', (e) => {
            UICtrl.clearEditState();
            e.preventDefault();
        });

        // clear items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

    }; 

    // add item submit
    const itemAddSubmit = (e) => {
        // get form input from UICtrl
        const input = UICtrl.getItemInput();
        
        // check if inputs are not empty
        if (input.name !== '' && input.calories !== '') {
            // add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // add item to UI list
            UICtrl.addListItem(newItem);

            // get ttl calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // show ttl cals in the UI
            UICtrl.showTotalCals(totalCalories);

            // clear inputs
            UICtrl.clearInputs();
        }

        e.preventDefault();
    };

    // edit item click event
    const itemEditClick = (e) => {
        if (e.target.classList.contains('edit-item')) {
            // get li id
            const listId = e.target.parentNode.parentNode.id;

            // break lis into an array
            const listIdArray = listId.split('-');

            // get actual id
            const ID = parseInt(listIdArray[1]);

            // get item
            const itemToEdit = ItemCtrl.getItemById(ID);
            
            // set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // add item to form in the DOM
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    };

    // item update submit
    const itemUpdateSubmit = (e) => {
        // get item input
        const input = UICtrl.getItemInput();

        // update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // update the UI
        UICtrl.updateListItem(updatedItem);

        // get ttl calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // show ttl cals in the UI
        UICtrl.showTotalCals(totalCalories);
        
        UICtrl.clearEditState();

        e.preventDefault();
    };

    // item delete submit
    const itemDeleteSubmit = (e) => {
        // get id from current item
        const currentItem = ItemCtrl.getCurrentItem();

        // delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // delete from UI
        UICtrl.deleteListItem(currentItem.id);
        
        e.preventDefault();
    };

    // clear all items click
    const clearAllItemsClick = () => {
        // delete all items from data structure
        ItemCtrl.clearAllItems();

        // delete all items from UI
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCals(totalCalories);
        UICtrl.removeItems();

        // hide ul
        UICtrl.hideList();
    };

    // public methods
    return {
        init: () => {
            // set initial state
            UICtrl.clearEditState();

           // fetch items from ItemCtrl data structure
           const items = ItemCtrl.getItems();

           // check if there are any items
           if (items.length === 0) {
                // hide list item
                UICtrl.hideList();
           } else {
                // populate DOM list with items
                UICtrl.populateItemList(items);
           }

            // get ttl calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // show ttl cals in the UI
            UICtrl.showTotalCals(totalCalories);

           // load all the event listeners
           loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);                                       // add StorageCtrl

// initialize the app
AppCtrl.init();