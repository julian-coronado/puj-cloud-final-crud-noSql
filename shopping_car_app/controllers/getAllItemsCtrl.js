'use strict'

const DynamoHelper = require('../resources/dynamo_helper')
const constantes = require('../resources/constantes')
const dynamo = new DynamoHelper()

async function getAllItems() {
  console.log(`${process.env.LOG_ENVIRONMENT} -> start getAllItems...`)
  const params = {
    TableName: process.env.TABLE_SHOPPING_CAR
  }
  const data = await dynamo.loadData(params)
  console.log(`${process.env.LOG_ENVIRONMENT} -> end getAllProducts successfull with ${JSON.stringify(data)}`)
  return data.Items
}

module.exports = {
  getAllItems
}
