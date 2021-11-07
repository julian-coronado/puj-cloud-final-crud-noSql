'use strict';

const addCtrl = require('./controllers/addItemCtrl')
const updateCtrl = require('./controllers/updateItemCtrl')
const removeCtrl = require('./controllers/removeItemCtrl')
const getallCtrl = require('./controllers/getAllItemsCtrl')
const constantes = require('./resources/constantes')


/**
 * Headers to send back to client
 */
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD, OPTIONS'
}

/**
 * Function to send response to client
 * @param statusCode {number}
 * @param body {*}
 * @returns {{statusCode: *, headers: string, body: *}}
 */
const sendResponse = (statusCode, body) => {
  return {
    statusCode: statusCode,
    headers: headers,
    body: body
  }

}


module.exports.manageItem = async (event, context, callback) => {
  try {
    //console.log(`${process.env.LOG_ENVIRONMENT} -> init manage item... ${JSON.stringify(event)}`)
    let response = { message: 'Sucess!' }

    if (event.path.includes('update')) {
      await updateCtrl.updateItem(JSON.parse(event.body))
    }
    else if (event.path.includes('remove')) {
      await removeCtrl.removeItem(JSON.parse(event.body))
    } else {
      await addCtrl.addItem(JSON.parse(event.body))
    }

    return callback(null, sendResponse(constantes.SUCESSFULL_EXECUTION, JSON.stringify(response)))

  } catch (error) {
    console.error(error)
    if (error instanceof TypeError) {
      return callback(null, sendResponse(constantes.SERVER_ERROR, JSON.stringify({
        message: error.message
      })))
    } else {
      return callback(null, sendResponse(constantes.SERVER_ERROR, JSON.stringify({
        message: error
      })))
    }
  }
}

module.exports.getAllItems = async (event, context) => {
  try {
    console.log(`${process.env.LOG_ENVIRONMENT} -> init get all items... ${JSON.stringify(event)}`)

    const datos = await getallCtrl.getAllItems()
    return sendResponse(constantes.SUCESSFULL_EXECUTION, JSON.stringify(datos))
  } catch (error) {
    console.error(error)
    return sendResponse(constantes.SERVER_ERROR, JSON.stringify(error))
  }
}
