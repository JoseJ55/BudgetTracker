const request = window.indexedDB.open('BudgetDB', 1);

let num = 0;

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

const offlineAdd = () =>{
    num += 1;
    // get data to add to indexdb when offline
    let nameEl = document.querySelector("#t-name");
    let amountEl = document.querySelector("#t-amount");
    
    let data = {
        listID: num,
        transaction: "add",
        name: nameEl.value,
        value: amountEl.value,
        date: new Date().toISOString()
    };

    console.log(data)

    const db  = request.result;
    const transaction = db.transaction(["BudgetDB"], "readwrite")
    const budgetStore = transaction.objectStore("BudgetDB")
    const budgetIndex = budgetStore.index("budget")
    
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
    // console.log("sub")
    num += 1;
    // get data to add to indexdb when offline
    let nameEl = document.querySelector("#t-name");
    let amountEl = document.querySelector("#t-amount");
    
    let data = {
        listID: num,
        transaction: "sub",
        name: nameEl.value,
        value: amountEl.value,
        date: new Date().toISOString()
    };

    console.log(data)

    const db  = request.result;
    const transaction = db.transaction(["BudgetDB"], "readwrite")
    const budgetStore = transaction.objectStore("BudgetDB")
    const budgetIndex = budgetStore.index("budget")
    
    budgetStore.add(data)
    
}

const backOnline = () =>{
    console.log("online")
    const db  = request.result;
    const transaction = db.transaction(["BudgetDB"], "readwrite")
    const budgetStore = transaction.objectStore("BudgetDB")
    const budgetIndex = budgetStore.index("budget")
    const getData = budgetIndex.getAll()
    getData.onsuccess = () => {
        console.log(getData.result)
    }
}

window.addEventListener('offline', offlineData);
window.addEventListener('online', backOnline)