'use strict';

const isBlank = function(value) {
  return (!value || /^\s*$/.test(value))
}
const containsKey = function(value){
  for (let index = 1; index < arguments.length; index++) {
    if (value === null || typeof value !== 'object' || !value.hasOwnProperty(arguments[index])) {
      return false
    }
    value = value[arguments[index]]
  }
  return true
}
const getErrorMessage = function(error, defaultMessage) {
  if (containsKey(error.response.data, "error") && containsKey(error.response.data, "message")) {
    return error.response.data.message
  }
  return typeof defaultMessage === 'string' ? defaultMessage : '예기치 않은 서버 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.'
}

export default {
    isBlank, containsKey, getErrorMessage
}