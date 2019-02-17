import { format, formatDistance, formatRelative, subDays } from 'date-fns'

const toYMD = function(date) {
  return format(date, 'YYYY-MM-DD')
}
const toYMDHMS = function(date) {
  return format(date, 'YYYY-MM-DD hh:mm:ss')
}

//=> "Today is a Tuesday"
const toDistance = function(params) {
  return formatDistance(subDays(new Date(), 3), new Date())
}

//=> "3 days ago"
const toRelative = function(params) {
  return formatRelative(subDays(new Date(), 3), new Date())
}

//=> "last Friday at 7:26 p.m."

/* 
    @name   timeFormt
    @desc   时间格式化
    @params 
            input   <string>   输入的时间字符串
            type    <string>   格式化后的时间字符串
*/
const timeFormt = (input, type) => {
  return format(input, type)
}

/* 
    @name   shareNum
    @desc   分享量格式化
    @params
            input   <number>    统计数字
            type    <string>    应用场景[card]
*/
const numFormat = (input, type) => {
  switch (type) {
    case 'card':
      if (input < 1000) {
        return input
      }
      if (input < 10000) {
        return Math.ceil(input / 1000) + 'K+'
      }
      return Math.ceil(input / 10000) + 'W+'
    default:
      return input || '0'
  }
}
/* 
    @name   timeToNow
    @desc   距离多少天
    @params
            val   <string>    日子字符串
*/
const timeToNow = val => {
  if (!val) return val
  let now = new Date().getTime()
  let time = new Date(val.replace(/-/g, '/')).getTime()
  let distance = (now - time) / 1000
  if (distance < 60) {
    return `${parseInt(distance)} 秒前`
  } else if (distance < 60 * 60) {
    return `${parseInt(distance / 60)} 分钟前`
  } else if (distance < 60 * 60 * 60) {
    return `${parseInt(distance / 60 / 60)} 小时前`
  } else {
    return `${parseInt(distance / 60 / 60 / 24)} 天前`
  }
}

export {
  timeFormt,
  toYMD,
  toYMDHMS,
  toDistance,
  toRelative,
  numFormat,
  timeToNow
}
