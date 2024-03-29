/*
 * @Description: COPYRIGHT © 2018 rnpolkacryptowallet (HK) LIMITED
 * This file is part of rnpolkacryptowallet.

 It under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License.
 You should have received a copy of the GNU General Public License
 along with rnpolkacryptowallet. If not, see <http://www.gnu.org/licenses/>.

 * @Autor: rnpolkacryptowallet LIMITED
 * @Date: 2019-06-18 21:08:00
 */
import SInfo from 'react-native-sensitive-info'
import Keyring from '@polkadot/keyring'
import { Dimensions, Alert } from 'react-native'
import i18n from '../locales/i18n'
import { async } from 'rxjs/internal/scheduler/async'
// 返回页面宽度
// Get page width
export const ScreenWidth = Dimensions.get('window').width
// 返回页面高度
// Get page height
export const ScreenHeight = Dimensions.get('window').height

/**
 * @description 根据单位名称获取值|Gets the value based on the unit name
 * @param {String} type 单位
 */
export function getUnit(type) {
  let unit = 1
  type = String(type)
  switch (type) {
    case 'pico':
      unit = '1'
      break
    case 'nano':
      unit = '1000'
      break
    case 'micro':
      unit = '1000000'
      break
    case 'milli':
      unit = '1000000000'
      break
    case 'DOT':
      unit = '1000000000000'
      break
    case 'Kilo':
      unit = '1000000000000000'
      break
    case 'Mega':
      unit = '1000000000000000000'
      break
    case 'Giga':
      unit = '1000000000000000000000'
      break
    case 'Tera':
      unit = '1000000000000000000000000'
      break
    case 'Peta':
      unit = '1000000000000000000000000000'
      break
    case 'Exa':
      unit = '1000000000000000000000000000000'
      break
    case 'Zeta':
      unit = '1000000000000000000000000000000000'
      break
    default:
      // Yotta
      unit = '1000000000000000000000000000000000000'
  }
  return unit
}
/**
 * @description 校验密码 方法整合 | Verify password, method integration
 * @param {Object} params            传入的对象 | Incoming object
 * @param {String} params.address    地址 | Address
 * @param {String} params.password   密码 | Password
 * @param {Function} params.success  成功回调方法 | Success callback method
 * @param {Function} params.error    密码错误的回调 | Password error callback method
 */
export function checkPwd(params) {
  const keyring = new Keyring({ type: 'ed25519', addressPrefix: 0x02 })
  SInfo.getItem(params.address, {
    sharedPreferencesName: 'rnpolkacryptowallet',
    keychainService: 'rnpolkacryptowalletKey'
  }).then(result => {
    const loadPair = keyring.addFromJson(JSON.parse(result))
    try {
      loadPair.decodePkcs8(params.password)
    } catch (error) {
      Alert.alert(
        '',
        i18n.t('TAB.PasswordMistake'),
        [
          {
            text: 'OK',
            onPress: () => {
              params.error && params.error()
            }
          }
        ],
        { cancelable: false }
      )
    }
    !loadPair.isLocked && (params.success && params.success(loadPair, SInfo))
  })
}

/**
 * @description 格式化api返回的对象 | Format the object returned by the API
 * @param {Object} data 格式化的对象 | Formatting object
 * @returns 格式化完的对象 | Formatted object
 */
export function formatData(data) {
  if (data) {
    return JSON.parse(JSON.stringify(data))
  }
}

export function axiosGet(url, params) {
  // 将后台接口的公共部分拼接进去
  //判断有木有参数
  if (params) {
    // 定一个空数组
    let paramsArray = []
    //  拆分对象
    Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
    // 判断是否地址拼接的有没有 ？,当没有的时候，使用 ？拼接第一个参数，如果有参数拼接，则用&符号拼接后边的参数
    if (url.search(/\?/) === -1) {
      url = url + '?' + paramsArray.join('&')
    } else {
      url = url + '&' + paramsArray.join('&')
    }
  }
  // 返回一个promise
  return new Promise((resolve, reject) => {
    //fetch请求
    fetch(url, { method: 'GET' })
      .then(response => response.json())
      .then(resulet => {
        resolve(resulet)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @description 请求接口 方法整合 | Request interface method integration
 * @param {String} url 请求的地址 | Requested url
 * @param {String} params 请求的参数 | Requested parameters
 * @param {String} type  请求的方式  默认 post | The mode of request defaults to post
 * @param {Boolean} noJson 是否需要对数据进行处理 默认false(需要) | Need to process the data, default false
 */
export function axios(url, params, type = 'POST', noJson = false) {
  const map = {
    method: type
  }
  const privateHeaders = {
    'Content-Type': 'application/json'
  }
  map.headers = privateHeaders
  map.follow = 20
  map.timeout = 0
  map.body = params
  if (noJson) {
    return new Promise((resolve, reject) => {
      fetch(url, map)
        .then(responseData => {
          resolve(responseData)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
  return new Promise((resolve, reject) => {
    fetch(url, map)
      .then(response => response.json())
      .then(responseData => {
        if (responseData) {
          resolve(responseData)
        } else {
          reject(console.log('responseData is null'))
        }
      })
      .catch(error => {
        reject(error)
      })
  })
}
/**
 * @description 增加网络类型 | Add network type
 * @param {String} address 地址 | Address
 * @param {String} networkType 网络类型 | Network type
 */
export function accountId(address, networkType = 'substrate') {
  if (typeof address !== 'string' || address.length === 0) {
    return ''
  } else {
    return `${networkType}:${address}`
  }
}
/**
 * @description 根据扫描结果判断 网络类型和地址 | Determine the network type and address based on the scan results
 * @param {String} data 识别到的JSONString | JSONString recognized
 */
export function ScannerType(data) {
  if (typeof data !== 'string' || !data) {
    return ''
  } else {
    let type = ''
    let QRData = ''
    try {
      if (data.indexOf('substrate:') > -1) {
        type = 'substrate'
        QRData = data.split('substrate:')[1]
      } else if (data.indexOf('signData') > -1) {
        type = 'signData'
        QRData = data
      } else if (data.indexOf('SignDetail') > -1) {
        type = 'SignDetail'
        QRData = JSON.stringify(JSON.parse(data).signature)
      } else {
        type = ''
        QRData = data
      }
    } catch (e) {
      type = ''
      QRData = data
    }
    return {
      type: type,
      data: QRData
    }
  }
}
let isCalled = false
let timer = null
/**
 * @description 连续点击判断 | Keep clicking to judge
 * @param yourFunction 点击事件 | Click event
 * @param interval 时间间隔，可省略，默认2000毫秒 | Time interval, can be omitted, default 2000 ms
 *
 */
export function doubleClick(clickFun, interval = 2000) {
  if (!isCalled) {
    isCalled = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      isCalled = false
    }, interval)
    return clickFun()
  }
}
