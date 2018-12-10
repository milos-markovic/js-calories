const StorageCtrl = (function(){


  return {
      storeItem: function(item, totalCalories){

        item.totalCalories = totalCalories;
        let items = [];

          if(localStorage.getItem('items') == null){
              items.push(item);

              localStorage.setItem('items', JSON.stringify(items));
          }else{
              items = JSON.parse(localStorage.getItem('items'));

              items.push(item);

              localStorage.setItem('items',JSON.stringify(items));
          }
      },
      getItemsFromStorage: function(){
        let items;

        if(localStorage.getItem('items') == null){
          items = [];
        }else{
          items = JSON.parse(localStorage.getItem('items'));
        }
        return items;
      },
      updateItemStorage: function(updatedItem){

          let items = JSON.parse(localStorage.getItem('items'));

          items.forEach(function(item, index){

              if(updatedItem.id === item.id){
                  items.splice(index, 1, updatedItem);
              }
          });
          localStorage.setItem('items', JSON.stringify(items));
      },
      deleteItemFromStorage: function(id){

        let items = JSON.parse(localStorage.getItem('items'));

        items.forEach(function(item, index){

            if(id === item.id){
                items.splice(index, 1);
            }
        });
        localStorage.setItem('items', JSON.stringify(items));
      },
      deleteAllFromStorage: function(){

            let items = this.getItemsFromStorage();

            let self = this;

            items.forEach(function(item){

                self.deleteItemFromStorage(item.id);

            });

      }

  }

})();

const ItemCtrl = (function(){

    const DataObject = function(id, food, calories){
      this.id = id;
      this.food = food;
      this.calories = calories;
    }

    const data = {

        // items: [
        //   { id: 0, food: 'spanac', calories: 1000 },
        //   { id: 1, food: 'pasulj', calories: 800 },
        //   { id: 2, food: 'kelj', calories: 400 }
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        curentItem: null,
        total: 0
     }

    return {
       getItems: function(){
         return data.items;
       },
       dateLog: function(){
         return data;
       },
       insertInput: function(input){
          let id;

          if(data.items.length > 0){
              id = data.items[data.items.length - 1].id + 1;
          }else{
              id = 0;
          }
          const item = new DataObject(id, input.food, input.calories);

          data.items.push(item);

          return item;
       },
       getTotalCalories: function(){

           let total = 0;

           data.items.forEach(function(item){

                total += parseInt(item.calories);

           });

           data.total = total;

           return data.total;
       },
       setCurentItem: function(id){

          let found = null;

          data.items.forEach(function(item){

              if(item.id === parseInt(id)){

                   found = item;
              }

          });

          data.curentItem = found;

          return data.curentItem;
       },
       updateItem: function(input){

            let updatedItem = null;

            data.items.forEach(function(item){

                if(data.curentItem.id === item.id){
                    item.food = input.food;
                    item.calories = input.calories;

                    updatedItem = item;
                }

            })
            data.curentItem = updatedItem;

            return data.curentItem;
       },
       deleteItem: function(){
          //  console.log(data.curentItem.id);
            const ids = [];

            data.items.forEach(function(item){

                  ids.push(item.id);
            });

            const index = ids.indexOf(data.curentItem.id);

            data.items.splice(index,1);

       },
       deleteAllItems: function(){

            data.items = [];
       },
       getCurentItem: function(){
         return data.curentItem;
       },
       resetTotalCalories: function(){
         data.total = 0;
       }

    }


})();

const UICtrl = (function(){

    return {

        showItems: function(items){

            let tbody = document.createElement("tbody");

            let tr = '';

            items.forEach(function(item){

                tr += `<tr id='item-${item.id}'><td>${item.food}</td><td>${item.calories}</td><td><a href='#'><i class="fas fa-edit"></i></a></td></tr>`;

            });
            tbody.innerHTML = tr;

            const table = document.querySelector('table');

            table.insertAdjacentElement('beforeend',tbody);
        },
        getInputs: function(){
           return {
              food: document.querySelector("#food").value,
              calories: document.querySelector("#calories").value
           };
        },
        showInsertedItem: function(itemObject){

            const tr = document.createElement('tr');

            tr.id = `item-${itemObject.id}`;

            tr.innerHTML = `<td>${itemObject.food}</td><td>${itemObject.calories}</td><td><a href='#'><i class="fas fa-edit"></i></a></td>`;

            const tbody = document.querySelector('tbody');

            tbody.insertAdjacentElement('beforeend',tr);
        },
        hideButtons: function(){

            document.querySelector('#update').style.display = 'none';
            document.querySelector('#delete').style.display = 'none';
            document.querySelector("#count").style.display = 'inline';
        },
        showButtons: function(){

          document.querySelector('#update').style.display = 'inline';
          document.querySelector('#delete').style.display = 'inline';
          document.querySelector("#count").style.display = 'inline';
        },
        showTotalCalories: function(totalCalories){

          document.querySelector("#total").textContent = totalCalories;
        },
        clearInputs: function(){
            document.querySelector("#food").value = '';
            document.querySelector("#calories").value = '';
        },
        showCurentItem: function(curentObject){

            document.querySelector("#food").value = curentObject.food;
            document.querySelector("#calories").value = curentObject.calories;

            this.showButtons();

        },
        showUpdatedItem: function(updatedItem){

          const trs = document.querySelectorAll('tr');

          const trsArray = Array.from(trs);

          trsArray.forEach(function(tr){

              if(tr.id === `item-${updatedItem.id}`){

                 tr.innerHTML = `<td>${updatedItem.food}</td><td>${updatedItem.calories}</td><td><a href='#'><i class="fas fa-edit"></i></a></td>`;
              }

          });
        },
        removeItem: function(item){

            const trs = document.querySelectorAll("tr");

            const trsArray = Array.from(trs);

            trsArray.forEach(function(element){

                if(element.id === `item-${item.id}`){
                   element.remove();
                }

            })
        },
        removeAllItems: function(){

            const trs = document.querySelectorAll('tbody tr');

            const trs_array = Array.from(trs);

            const removeTableRows = trs_array.filter(function( tr ){

                  tr.remove();

            });

            document.querySelector('#total').textContent = '0';

        }

    }

})();

const App = (function(ItemCtrl, UICtrl, StorageCtrl){


    function loadEventListeners(){

        document.querySelector("#count").addEventListener('click', addItem);

        document.querySelector("table").addEventListener('click',editState);

        document.querySelector("#update").addEventListener('click',updateItem);

        document.querySelector("#delete").addEventListener('click',deleteItem);

        document.querySelector("#clear-all").addEventListener('click',clearAll);
    }

    const clearAll = function(e){

      StorageCtrl.deleteAllFromStorage();

      ItemCtrl.deleteAllItems();

      UICtrl.removeAllItems();



      e.preventDefault();
    }

    const deleteItem = function(e){

        ItemCtrl.deleteItem();

        const curentItem = ItemCtrl.getCurentItem();

        UICtrl.removeItem(curentItem);

        const totalCalories = ItemCtrl.getTotalCalories();

        UICtrl.showTotalCalories(totalCalories);

        UICtrl.hideButtons();

        UICtrl.clearInputs();

        StorageCtrl.deleteItemFromStorage(curentItem.id);

        e.preventDefault();
    }
    const updateItem = function(e){

        const inputs = UICtrl.getInputs();

        const updatedItem = ItemCtrl.updateItem(inputs);

        UICtrl.showUpdatedItem(updatedItem);

        const totalCalories = ItemCtrl.getTotalCalories();

        UICtrl.showTotalCalories(totalCalories);

        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.hideButtons();

        UICtrl.clearInputs();

        e.preventDefault();
    }

    const editState = function(e){

        if(e.target.classList.contains('fa-edit')){

            let elementId  = e.target.parentNode.parentNode.parentNode.id;

            let arrayId = elementId.split("-");

            let id = arrayId[1];

            const curentItem = ItemCtrl.setCurentItem(id);

            UICtrl.showCurentItem(curentItem);
        }
    }

    const addItem = function(e){

      const inputs = UICtrl.getInputs();

      if(inputs.food !== '' && inputs.calories !== ''){

        const itemObject = ItemCtrl.insertInput(inputs);

        UICtrl.showInsertedItem(itemObject);

        const totalCalories = ItemCtrl.getTotalCalories();

        StorageCtrl.storeItem(itemObject, totalCalories);

        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearInputs();

        e.preventDefault();
      }

    }

    return {
      init: function(){

          UICtrl.clearInputs();

          const getItems = ItemCtrl.getItems();

          UICtrl.showItems(getItems);

          UICtrl.hideButtons();

          loadEventListeners();
      }
    }

})(ItemCtrl, UICtrl, StorageCtrl);

App.init();
