'use strict'

const DynamoHelper = require('../resources/dynamo_helper')
const constantes = require('../resources/constantes')
const dynamo = new DynamoHelper()


async function getShoppingCar(data) {
  console.log(`${process.env.LOG_ENVIRONMENT} -> start getShoppingCar... ${JSON.stringify(data)}`)

  if (data.user_profile && constantes.ALPHANUMERIC_REGEX.test(data.user_profile)) {

    const params = {
      TableName: process.env.TABLE_SHOPPING_CAR,
      Key: { 'user_profile': data.user_profile },
      KeyConditionExpression: "#userRef = :userInput",
      ExpressionAttributeNames: {
        "#userRef": "user_profile"
      },
      ExpressionAttributeValues: {
        ":userInput": data.user_profile
      }
    }
    const result = await dynamo.loadDataByParams(params)
    console.log(`${process.env.LOG_ENVIRONMENT} -> end getShoppingCar successfull with ${JSON.stringify(result)}`)
    return result.Items
  } else {
    console.error(`${process.env.LOG_ENVIRONMENT} -> throws getShoppingCar... incomplete data`)
    throw new TypeError('Campo marca requerido')
  }


}

async function shoppingCarExist(data) {

  console.log(`${process.env.LOG_ENVIRONMENT} -> start ShoppingCar exist... ${JSON.stringify(data)}`)
  try {
    const params = {
      TableName: process.env.TABLE_SHOPPING_CAR,
      Key: { 'user_profile': data.user_profile },
      AttributesToGet: ['user_profile']
    }

    var exists = false
    let result = await dynamo.loadItemAttrByParams(params);

    console.log(`${process.env.LOG_ENVIRONMENT} -> shoppingcar Exist successfull with ${JSON.stringify(result)}`)
    if (result.Item !== undefined && result.Item !== null) {
      exists = true
    }

    
  } catch (error) {
    exists = false
    console.log(`${process.env.LOG_ENVIRONMENT} -> shoppingcar Exist error with ${JSON.stringify(error)}`)
  }

  return exists
}

module.exports = {
  getShoppingCar, shoppingCarExist
}
