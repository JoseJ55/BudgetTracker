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
    let nameEl = document.querySelector("#t-name");
    let amountEl = document.querySelector("#t-amount");
    
    let data = {
        listID: num.toString(),
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
}

const offlineSub = () => {
    num += 1;
    let nameEl = document.querySelector("#t-name");
    let amountEl = document.querySelector("#t-amount");
    
    let data = {
        listID: num.toString(),
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
    num = 0;

    const db  = request.result;
    const transaction = db.transaction(["BudgetDB"], "readwrite")
    const budgetStore = transaction.objectStore("BudgetDB")

    const getAllData = budgetStore.getAll()
    
    getAllData.onsuccess = async () => {
        for(var i = 0; i < getAllData.result.length; i++){
            let name = getAllData.result[i].name
            let value;
            let date = getAllData.result[i].date
            let data = []
            let innerData = {}

            if(getAllData.result[i].transaction === "add"){
                value = getAllData.result[i].value;
            } else{
                getAllData.result[i].value *= -1;
                value = getAllData.result[i].value;
            }

            innerData.name = name;
            innerData.value = value.toString();
            innerData.date = date;

            data.push(innerData)

            try{
                await fetch("/api/transaction", {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                    }
                })
            } catch (err) {
                console.log(err)
            }
        }
    }

    budgetStore.clear()
}

window.addEventListener('offline', offlineData);
window.addEventListener('online', backOnline)