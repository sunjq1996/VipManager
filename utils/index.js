import { bmob } from '@/utils/exports.js'

function success_ (res) {
  console.info(res)
}

function fail_ (err) {
  console.error(err)
}

// 增
export const insert_ = (table, data, success, fail) => {
  // 校验回调函数
  let callback = {
    success: success || success_,
    fail: fail || fail_
  }
  try {
    var query = bmob.Query(table)
    for (var key in data) {
      query.set(key, data[key])
    }
    query.save().then(res => callback.success(res))
      .catch(err => callback.fail(err))
  } catch (err) {
    callback.fail(err)
  }
}

// 删
export const delete_ = (table, id, success, fail) => {
  // 校验回调函数
  let callback = {
    success: success || success_,
    fail: fail || fail_
  }
  try {
    var query = bmob.Query(table)
    query.destroy(id).then(res => callback.success(res))
      .catch(err => callback.fail(err))
  } catch (err) {
    callback.fail(err)
  }
}

// 改
export const update_ = (table, id, data, success, fail) => {
  // 校验回调函数
  let callback = {
    success: success || success_,
    fail: fail || fail_
  }
  try {
    var query = bmob.Query(table)
    query.set('id', id)
    for (var key in data) {
      query.set(key, data[key])
    }
    query.save().then(res => callback.success(res))
      .catch(err => callback.fail(err))
  } catch (err) {
    callback.fail(err)
  }
}

// 查
export const search_ = (table, condition, skip, limit, success, fail) => {
  // 校验回调函数
  let callback = {
    success: success || success_,
    fail: fail || fail_
  }
  try {
    var query = bmob.Query(table)
    for (var i = 0; i < condition.length; i++) {
      query.equalTo(condition[i].key, condition[i].option, condition[i].value)
    }
    query.skip(skip||0)
    query.limit(limit||200)
    query.order('-createdAt')
    query.find().then(res => callback.success(res))
      .catch(err => callback.fail(err))
  } catch (err) {
    callback.fail(err)
  }
}

// 统计记录总数
export const count_ = (table, condition, success, fail) => {
  // 校验回调函数
  let callback = {
    success: success || success_,
    fail: fail || fail_
  }
  try {
    var query = bmob.Query(table)
    for (var i = 0; i < condition.length; i++) {
      query.equalTo(condition[i].key, condition[i].option, condition[i].value)
    }
    query.count().then(res => callback.success(res))
      .catch(err => callback.fail(err))
  } catch (err) {
    callback.fail(err)
  }
}

// 获取1条记录
export const get_ = (table, id, success, fail) => {
  // 校验回调函数
  let callback = {
    success: success || success_,
    fail: fail || fail_
  }
  try {
    var query = bmob.Query(table)
    query.get(id).then(res => callback.success(res))
      .catch(err => callback.fail(err))
  } catch (err) {
    callback.fail(err)
  }
}

// 原子操作
export const atom_ = (table, id, key, num, success, fail) => {
  // 校验回调函数
  let callback = {
    success: success || success_,
    fail: fail || fail_
  }
  try {
    var query = bmob.Query(table)
    query.get(id).then(res => {
      res.increment(key, num) // 原子操作加减
      res.save()
      callback.success(res)
    }).catch(err => callback.fail(err))
  } catch (err) {
    callback.fail(err)
  }
}

// 获取店铺Id
export const getHouseId = () => {
  var val = uni.getStorageSync('house-id')
  if (!val) {
    return ''
  }
  return val
}

// 更新店铺Id
export const setHouseId = (houseId) => {
  uni.setStorageSync('house-id', houseId)
}


// 检测是否已登录
export const checkSignin = () => {
  if (getHouseId()) {
    return true
  }
  return false
}

function formatNumber(n) {
    const str = n.toString()
    return str[1] ? str : `0${str}`
}

// 日期格式化
export const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('-')
  // const t2 = [hour, minute, second].map(formatNumber).join(':')
  // return `${t1} ${t2}`
  // const t3 = [hour, minute].map(formatNumber ).join(':')
  return `${t1}`
}