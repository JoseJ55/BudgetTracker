const request = window.indexedDB.open('BudgetDB', 1);

request.onupgradeneeded = ({target}) => {
    console.log("upgrade")
    const db = target.result;
    const objectStore = db.createObjectStore("BudgetDB", {keyPath: "listID"})

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

// let transaction = {
//     name: nameEl.value,
//     value: amountEl.value,
//     date: new Date().toISOString()
//   };
const offlineAdd = () =>{
    // get data to add to indexdb when offline
    let nameEl = document.querySelector("#t-name");
    let amountEl = document.querySelector("#t-amount");
    // let errorEl = document.querySelector(".form .error");
    // console.log("add")
    let data = {
        name: nameEl.value,
        value: amountEl.value,
        date: new Date().toISOString()
    };

    console.log(data)

    const db  = request.result;
    const transaction = db.transaction(["BudgetDB"], "readwrite")
    const budgetStore = transaction.objectStore("BudgetDB")
    const budgetIndex = budgetStore.index("budget")
    const budgetAuto = budgetStore.autoIncrement

    budgetStore.add(data)

    const getRequest = budgetStore.get('1')
    getRequest.onsuccess = () => {
        console.log(getRequest.result)
    }
    // thinking of adding a global variable to keep track of id for key index
    // then restart teh variable when back online.
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