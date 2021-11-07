'use strict'

const DynamoHelper = require('../resources/dynamo_helper')
const constantes = require('../resources/constantes')
const utilItemCtrl = require('./utilItemCtrl')
const dynamo = new DynamoHelper()


async function addItem(data) {
  console.log(`${process.env.LOG_ENVIRONMENT} -> start add Items Ctrl... ${JSON.stringify(data)}`)

  if (await utilItemCtrl.shoppingCarExist(data)) {

    let shoppingCar = (await utilItemCtrl.getShoppingCar(data))[0]

    let itemIdx = shoppingCar.items.findIndex(itemTarget => itemTarget.itemId === data.item.itemId);

    if (itemIdx > -1) {

      shoppingCar.items[itemIdx].value = data.item.value ? data.item.value : shoppingCar.items[itemIdx].value
      shoppingCar.items[itemIdx].qty = shoppingCar.items[itemIdx].qty + (data.item.qty ? data.item.qty : 1)
      shoppingCar.items[itemIdx].updateDate = new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' })

    }
    else {

      let newItem = {
        itemId : data.item.itemId,
        creationDate : new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }),
        value : data.item.value ? data.item.value : 0,
        qty : data.item.qty ? data.item.qty : 1,
      }

      shoppingCar.items.push(newItem)
    }

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
  }
  else {
    if (data.user_profile && constantes.ALPHANUMERIC_REGEX.test(data.user_profile) && data.item.itemId) {
      const params = {
        TableName: process.env.TABLE_SHOPPING_CAR,
        Item: {
          user_profile: data.user_profile,
          qty: 1,
          items: [{
            itemId: data.item.itemId,
            creationDate: new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }),
            value: data.item.value ? data.item.value : 0,
            qty: data.item.qty ? data.item.qty : 1
          }]
        }
      }
      await dynamo.saveData(params)

    } else {
      console.error(`${process.env.LOG_ENVIRONMENT} -> throws insert item... incomplete data`)
      throw new TypeError('user_profile field requiered!!')
    }
  }
  console.log(`${process.env.LOG_ENVIRONMENT} -> end insertItem successful`)

}

module.exports = {
  addItem
}
