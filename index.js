import {menuArray} from "/data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const foodList = document.getElementById("food-list")
const orderArray = []
let totalCost = 0

document.addEventListener("click", function(e){
    if (e.target.dataset.addBtn) {
        addFoodItem(e.target.dataset.addBtn)
    } else if (e.target.dataset.removeBtn) {
        removeFoodItem(e.target.dataset.removeBtn)
    } else if (e.target.id === "complete-order-btn") {
        showModal()
    } else if (e.target.id === "submit-btn" && formFilled()) {
        e.preventDefault()
        hideModal()
        hideOrderSummary()
        showThanks()
    } else if (e.target.id === "close-btn") {
        hideModal()
    }
})

function addFoodItem (foodId) {
    const targetMenuObj = menuArray.filter(function(menuItem){
        return menuItem.id === Number(foodId)
    })[0]
    
    const orderObj = new Order(targetMenuObj.name, targetMenuObj.price)
    orderArray.push(orderObj)
    
    totalCost += targetMenuObj.price
    
    const sum = document.getElementById("sum")
    
    renderOrders()
    showOrderSummary()

}

function removeFoodItem (foodId) {
    const targetOrderObj = orderArray.filter(function(orderItem){
        return orderItem.id === foodId
    })
    
    const index = orderArray.indexOf(targetOrderObj[0])
    orderArray.splice(index, 1)
    totalCost -= targetOrderObj[0].price
    
    renderOrders()
    
    
    if (orderArray.length < 1) {
        hideOrderSummary()
    }
}

function formFilled() {
    const cardLength = document.getElementById("card").value.length
    const cvvLength = document.getElementById("cvv").value.length
    
    if (cardLength === 16 && cvvLength === 3 || cvvLength === 4) {
        return true
    }
    return false
}

function showOrderSummary(){
    document.getElementById("order-summary").style.display = "block"
}

function hideOrderSummary(){
    document.getElementById("order-summary").style.display = "none"
}

function showModal() {
    document.getElementById("modal").style.display="block"
}

function hideModal() {
    document.getElementById("modal").style.display="none"
}

function showThanks() {
    const thanks = document.getElementById("thanks")
    const name = document.getElementById("name")
    thanks.innerHTML = `Thanks, ${name.value}! Your order is on its way!`
    document.getElementById("thanks").style.display="block"
}

function getMenuHtml() {
    let menuHtml = ``
    menuHtml += menuArray.map(function(foodItem){
        return `
        <div class="food-item">
            <h1>${foodItem.emoji}</h1>
            <div>
                <h2>${foodItem.name}</hi>
                <h4>${foodItem.ingredients.join(`, `)}<h3>
                <h3>$${foodItem.price}</h2>
            </div>
            <button data-add-btn="${foodItem.id}">+</button>
        </div>
        `
        }).join('')
    return menuHtml
}

function getOrderHtml() {
    let orderHtml = ``
    orderHtml += orderArray.map(function(order){
        return `
        <div class="order-item">
            <h2>${order.name}</h2>
            <button data-remove-btn="${order.id}">remove</button>
            <h3>$${order.price}</h3>
        </div>
        `
    }).join('')

    return orderHtml
}

function Order (name, price) {
    this.name = name
    this.price = price
    this.id = uuidv4()
}

function renderMenu() {
    document.getElementById("food-list").innerHTML = getMenuHtml()
}

function renderOrders() {
    document.getElementById("order-list").innerHTML = getOrderHtml()
    sum.innerText = `$${totalCost}`
}

renderMenu()