'use strict'

const DynamoHelper = require('../resources/dynamo_helper')
const constantes = require('../resources/constantes')
const utilItemCtrl = require('./utilItemCtrl')
const dynamo = new DynamoHelper()


async function updateItem(data) {
  console.log(`${process.env.LOG_ENVIRONMENT} -> start update item... ${JSON.stringify(data)}`)

  if (await utilItemCtrl.shoppingCarExist(data)) {
    let shoppingCar = (await utilItemCtrl.getShoppingCar(data))[0]

    let itemIdx = shoppingCar.items.findIndex(itemTarget => itemTarget.itemId === data.item.itemId);

    if (itemIdx > -1) {

      shoppingCar.items[itemIdx].value = data.item.value ? data.item.value : shoppingCar.items[itemIdx].value
      shoppingCar.items[itemIdx].qty = data.item.qty ? data.item.qty : 1
      shoppingCar.items[itemIdx].updateDate = new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' })

      let nextItem = shoppingCar.items.length
      shoppingCar.qty = nextItem

      const params = {
        TableName: process.env.TABLE_SHOPPING_CAR,
        Item: {
          user_profile: shoppingCar.user_profile,
          qty: shoppingCar.qty,
          items: shoppingCar.items
        }
      }
      await dynamo.saveData(params)

    } else {
      throw new TypeError('item is not in shopping car yet!!')
    }

  } else {
    throw new TypeError('shopping car us empty!!')
  }
}

module.exports = {
  updateItem
}
