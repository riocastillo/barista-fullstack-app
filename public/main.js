function addOrder() {
  cashierOrder.customerName = document.querySelector('.customerName').value
  cashierOrder.specialInstructions = document.querySelector('.customerOrder').value
  // let body = document.querySelector('.hide')
  // body.getElementsByClassName.display = 'none'
  console.log(cashierOrder.customerName)
  fetch('orders', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'customerName': cashierOrder.customerName,
      'customerOrder': cashierOrder,
    })
  })

    .then(response => {
      if (response.ok) {
        document.querySelector('.thanks').innerText = 'Thanks for your order, ' + cashierOrder.customerName + '!'
        // let body = document.querySelector('.hide')
        // body.getElementsByClassName.display = 'none'
        // document.querySelector('#thanksGif').src = "thanks.gif"
      }
    })
}

function completeOrder(orderId, user, customerName) {

  console.log('id:' + orderId + 'user:' + user, customerName)
  fetch('orders', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'orderId': orderId,
      'barista': user
    })
  })
    .then(response => {
      console.log(response)
      if (response.ok) {
        var msg = new SpeechSynthesisUtterance();
        msg.text = "Order for " + customerName + " is ready";
        window.speechSynthesis.speak(msg);
        window.location.reload(true)

      }
    })
}

function deleteList(orderId) {
  fetch('orders', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'orderId': orderId,
    })
  })
    .then(response => {
      console.log(response)
      if (response.ok) {
        window.location.reload(true)
      }
    })
}

let cashierOrder = {
  customerName : '',
  size : 'tall',
  roast : 'light',
  drink : 'coffee',
  custom : [],
  temperature : 'hot',
  specialInstructions : ''
}

function clickButton(event){
  let buttonText = event.target.innerText

  console.log(buttonText)
  if (buttonText === 'tall' || buttonText === 'grande' || buttonText === 'venti'){
    cashierOrder.size = buttonText
  } else if (buttonText === 'light' || buttonText === 'medium' || buttonText === 'dark'){
    cashierOrder.roast = buttonText
  } else if (buttonText === 'coffee' || buttonText === 'cold brew' || buttonText === 'lattee' ||
    buttonText === 'espresso shot' || buttonText === 'cappucino' || buttonText === 'frappucino' ||
    buttonText === 'green tea' || buttonText === 'black tea' || buttonText === 'other tea'){
      cashierOrder.drink = buttonText
  } else if (buttonText === 'hot' || buttonText === 'iced'){
    cashierOrder.temperature = buttonText
  }  else {
    console.log('buttonText' + buttonText)
    cashierOrder.custom.push(buttonText)
  }

}

function customerNameInput(){
  cashierOrder.customerName = document.querySelector('.customerName').value
}

function customerInstruction(){
  cashierOrder.specialInstructions = document.querySelector('.customerOrder').value
}