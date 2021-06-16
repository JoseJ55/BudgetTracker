const request = window.indexedDB.open('BudgetDB', 1);

request.onupgradeneeded = ({target}) => {
    console.log("upgrade")
    const db = target.result;
    const objectStore = db.createObjectStore("BudgetDB")

    objectStore.createIndex("budget", "budget")
}

request.onsuccess = event =>  {
    console.log(request.result);
}

const offlineData = () => {
    const addBtn = document.querySelector("#add-btn")
    const subBtn = document.querySelector("#sub-btn")
    addBtn.addEventListener("click", offlineAdd)
    subBtn.addEventListener("click", offlineSub)
}

const offlineAdd = () =>{
    // get data to add to indexdb when offline
    console.log("add")
    // find out what kind of data is being sent to the db
}

const offlineSub = () => {
    // get data to sub to indexdb when offline
    console.log("sub")
}

const saveRecord = (record) => {
    console.log('Save record invoed');

    const transaction = db.transaction(['BudgetStore'], 'readwrite')

    const store = transaction.objectStore('BudgetStore');

    store.add(record);
}

window.addEventListener('offline', offlineData);