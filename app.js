// Expenses Class: Represents Expenses
class Expenses {
    constructor(title, amount) {
        this.title = title;
        this.amount = amount;
    }
}

// Budget Class: Represents Budget
class Budget {
    constructor(budget) {
        this.budget = budget;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayExpenses() {
        const expenses = Store.getExpenses();      
        expenses.forEach((expense) => UI.addExpenseToList(expense));
    }
 
    static addExpenseToList(expense) {
        const list = document.querySelector('#expense-list');
        const row = document.createElement('tr');
        row.innerHTML = `
         <td><span class="text-primary">${expense.title}</td>
         <td><span class="text-primary">${expense.amount}</td>
         <td><a href="#" class="btn btn-danger btn-sm 
         delete">X</a></td>
        `;
        list.appendChild(row);
    }

    static addBudgetAndCalculate(budget) {
        const list = document.querySelector('#budget-list');
        const row = document.createElement('tr');
        row.innerHTML = `
         <td  id="cal"><i class="fas fa-dollar-sign text-primary"></i>
         <strong><span class="text-primary">${budget.budget}</span></td>
         <td><i class="fas fa-dollar-sign text-primary"></i>
         <strong><span class="text-primary">${budget.expenses}</span></td>
         <td><i class="fas fa-dollar-sign text-primary"></i>
         <strong><span class="text-primary">${budget.balance}</span></td>
        `;
        list.appendChild(row);
    }

    static deleteExpense(el){
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    // Alert message
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#addExpense-form');
        container.insertBefore(div, form);
        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#amount').value = '';
        document.querySelector('#budget').value = '';
    }
}

// Store Class: Handles Storage
class Store {
    static getExpenses() {
        let expenses;
        if(localStorage.getItem('expenses') === null) {
            expenses = [];
        } else {
            expenses = JSON.parse(localStorage.getItem('expenses'));
        }
        return expenses;
    }


    static addExpense(expense) {
        const expenses = Store.getExpenses();

        expenses.push(expense);

        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    static removeExpense(amount) {
        const expenses = Store.getExpenses();

        expenses.forEach((expense, index) => {
            if(expense.amount === amount) {
                expenses.splice(index, 1);
            }
        });

        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

}

// Event: Display expenses
document.addEventListener('DOMContentLoaded', UI.displayExpenses);

// Event: Add a Expense
document.querySelector('#addExpense-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    // const budget = document.querySelector('#budget').value;
    const title = document.querySelector('#title').value;
    const amount = document.querySelector('#amount').value;

    // Validate
    if(title === '' ||  amount === ''){
        UI.showAlert('Please fill in all fields', 'danger');
    } else {

        // Instatiate expense
        const expense = new Expenses(title, amount);

        // Add expense to UI
        UI.addExpenseToList(expense);

        // Add expense to store
        Store.addExpense(expense);

        // Show success message
        UI.showAlert('Expense Added', 'success');

        // Clear fields
        UI.clearFields();
    }
});

// Event: Add Balance
document.querySelector('#addBudget-form').addEventListener('submit', (e) => {
    
    // Prevent actual submit
    e.preventDefault();
    if(document.getElementById("cal") !== null){ 
        document.getElementById("cal").parentElement.remove();
    }

    // Get form values
    const budget = document.querySelector('#budget').value;

    // Validate
    if(budget === ''){
        UI.showAlert('Please fill in required field', 'danger');
    } else {
        

        // Instatiate expense
        const balance = new Budget(budget);
        var array = Store.getExpenses();
        if(Object.keys(array).length !== 0 && array.constructor !== Object){
        var val = array.reduce(function(previousValue, currentValue) {
            return {
                amount: parseInt(previousValue.amount, 10) + parseInt(currentValue.amount, 10),
            }
          });
          var a = val['amount'];
        }
        
        balance.expenses = a;
        var b = balance.budget - a;
        balance.balance = b;

        // Add budget to UI
        UI.addBudgetAndCalculate(balance);

        // Show success message
        UI.showAlert('Budget Added', 'success');

        // Clear fields
        UI.clearFields();
    }
});

// Event: Check/Uncheck Expense
// function toggle(checked) {
//     var elm = document.getElementById('checkbox');
//     if (checked != elm.checked) {
//       elm.click();
//       UI.deleteBook(e.target)
//     }
//   }

// Event: Remove Expense
document.querySelector('#expense-list').addEventListener('click', (e) => {
    // Remove book from UI
    UI.deleteExpense(e.target);

    // Remove expense from store
    Store.removeExpense(e.target.parentElement.previousElementSibling.textContent);

    // Show success message
    UI.showAlert('Expense Deleted', 'success');
});
