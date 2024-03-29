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
import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'
import { NavigationActions, StackActions } from 'react-navigation'
import PasswordGesture from 'react-native-gesture-password'
import { observer, inject } from 'mobx-react'
import i18n from '../../../../locales/i18n'

@inject('rootStore')
@observer
class Gesture extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'right',
      message:
        this.props.rootStore.stateStore.GestureState == 0 ? i18n.t('Profile.setGesture') : i18n.t('Profile.inputPWD')
    }
    this.onStart = this.onStart.bind(this)
    this.onEnd = this.onEnd.bind(this)
  }

  /**
   * @description 滑动结束|End of the slide
   * @param {String} password 密码|password
   */
  onEnd(password) {
    // 第一次设置密码
    // First time to set the gesture password
    if (this.props.rootStore.stateStore.GestureState == 0) {
      this.props.rootStore.stateStore.GestureState = 1
      this.props.rootStore.stateStore.Gesture = password
      this.setState({
        status: 'right',
        message: i18n.t('Profile.confirmGesture')
      })
    } else {
      // 确认上一次输入密码
      // Confirm the gesture password
      if (this.props.rootStore.stateStore.GestureState == 1) {
        // 确认成功
        // Confirm success
        if (password == this.props.rootStore.stateStore.Gesture) {
          this.props.rootStore.stateStore.GestureState = 2
          this.props.rootStore.stateStore.Gesture = password
          AsyncStorage.setItem('Gesture', password)
          this.setState({
            status: 'right',
            message: i18n.t('Profile.gestureSuccess')
          })
          setTimeout(() => {
            let resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'Settings' })]
            })
            this.props.navigation.dispatch(resetAction)
          }, 500)
        } else {
          // 确认失败
          // Confirm faild
          this.props.rootStore.stateStore.GestureState = 0
          this.setState({
            status: 'wrong',
            message: i18n.t('Profile.gestureFailed')
          })
        }
      } else {
        // 验证密码
        // Verify gesture password
        if (this.props.rootStore.stateStore.GestureState == 2) {
          if (password == this.props.rootStore.stateStore.Gesture) {
            this.setState({
              status: 'right',
              message: i18n.t('TAB.PasswordCorrect')
            })
            setTimeout(() => {
              let resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Tabbed_Navigation' })]
              })
              this.props.navigation.dispatch(resetAction)
            }, 500)
          } else {
            this.setState({
              status: 'wrong',
              message: i18n.t('TAB.PasswordMistake')
            })
          }
        }
      }
    }
  }

  /**
   * @description 开始滑动|Start to slide
   */
  onStart() {
    this.setState({
      status: 'normal',
      message: i18n.t('Profile.inputPWD')
    })
  }

  /**
   * @description 重置密码|Reset password
   */
  onReset() {
    this.setState({
      status: 'normal',
      message: i18n.t('Profile.inputPWD_d')
    })
  }

  render() {
    return (
      <PasswordGesture
        // ref="pg"
        status={this.state.status}
        message={this.state.message}
        textStyle={{ fontSize: 25 }}
        normalColor="#1b8ae8"
        rightColor="green"
        wrongColor="#eb0550"
        style={{ backgroundColor: '#fff' }}
        outerCircle={true}
        innerCircle={true}
        onStart={() => this.onStart()}
        interval={500}
        onEnd={password => this.onEnd(password)}
      />
    )
  }
}
export default Gesture
