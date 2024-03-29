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
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Clipboard,
  StatusBar,
  Platform,
  SafeAreaView,
  Alert,
  CameraRoll,
  PermissionsAndroid
} from 'react-native'
import {
  // captureScreen,
  captureRef
} from 'react-native-view-shot'
import QRCode from 'react-native-qrcode'
import Identicon from 'polkadot-identicon-react-native'
import { observer, inject } from 'mobx-react'
import { ScreenWidth, ScreenHeight, accountId, doubleClick } from '../../../util/Common'
import Header from '../../../components/Header'
import i18n from '../../../locales/i18n'

@inject('rootStore')
@observer
class QRCodeView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      address: this.props.rootStore.stateStore.currentAccount.address
    }
    this.copy = this.copy.bind(this)
    this.back = this.back.bind(this)
    this.mainViewRef = React.createRef()
  }

  /**
   * @description 复制|Click the copy
   */
  async copy() {
    Clipboard.setString(this.state.address)
    Alert.alert('', i18n.t('TAB.CopySuccess'))
  }

  /**
   * @description 返回|Click the back
   */
  back() {
    this.props.navigation.navigate('Tabbed_Navigation')
  }

  requestExternalStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
        title: 'My App Storage Permission',
        message: 'My App needs access to your storage so you can save your photos'
      })
      return granted
    } catch (err) {
      console.error('Failed to request permission ', err)
      return null
    }
  }

  async shareScreenShot() {
    if (Platform.OS == 'android') {
      this.requestExternalStoragePermission()
    }
    const { makingImage } = this.state
    if (makingImage) return

    this.setState({ makingImage: true }, async () => {
      try {
        const captureConfig = {
          format: 'png',
          quality: 0.7,
          result: Platform.OS == 'android' ? 'tmpfile' : 'base64',
          width: 750
        }
        let imguri = ''
        // try {
        //   imgBase64 = await captureScreen (captureConfig);
        // } catch (e) {
        try {
          imguri = await captureRef(this.mainViewRef.current, captureConfig)
        } catch (ex) {
          throw ex
        }
        // }
        console.log(imguri)
        this.setState({ showTitle: true })
        this.saveImage(Platform.OS == 'ios' ? `data:image/png;base64,${imguri}` : imguri)
      } catch (e) {
        Alert.alert(i18n.t('Assets.shotErr') + e.toString())
        console.log(e)
      } finally {
        this.setState({ makingImage: false })
      }
    })
  }

  async saveImage(screenShotShowImg) {
    CameraRoll.saveToCameraRoll(screenShotShowImg)
      .then(result => {
        Alert.alert('', i18n.t('Assets.saveSuccess'))
      })
      .catch(error => {
        Alert.alert('', i18n.t('Assets.saveErr') + `\n${error}`)
      })
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#4C4547' }}>
        {/* 标题栏 | The title bar  */}
        <StatusBar
          hidden={false}
          backgroundColor="#4C4547" // 状态栏背景颜色 | Status bar background color | Status bar background color
          barStyle={Platform.OS == 'android' ? 'light-content' : 'dark-content'} // 状态栏样式（黑字）| Status bar style (black) | Status bar style (black)
        />
        <View
          style={{
            width: ScreenWidth,
            height: ScreenHeight,
            backgroundColor: '#4C4547'
          }}
        >
          {/* 导航栏 | The navigation bar */}
          <Header
            navigation={this.props.navigation}
            title={i18n.t('Assets.Receive')}
            rightIcon={require('../../../assets/images/Assets/sweep_code_share.png')}
            rightPress={this.shareScreenShot.bind(this)}
          />
          <View
            style={{
              marginTop: 20,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              style={{ width: 330 }}
              resizeMode="stretch"
              source={require('../../../assets/images/Assets/sweep_code_line.png')}
            />
            <View
              style={{
                borderRadius: 8,
                backgroundColor: '#FFF',
                width: 312,
                height: ScreenHeight * 0.7526,
                marginTop: -13,
                alignItems: 'center'
              }}
            >
              <Identicon
                style={{ marginTop: 50, marginBottom: 12 }}
                value={this.props.rootStore.stateStore.currentAccount.address}
                size={46}
                theme="polkadot"
              />
              <Text style={{ color: '#474747', fontSize: 17, marginBottom: 30 }}>
                {this.props.rootStore.stateStore.currentAccount.account}
              </Text>
              <View
                style={{
                  width: 160,
                  height: 160,
                  overflow: 'hidden',
                  backgroundColor: '#FF93B1',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8
                }}
              >
                <View
                  style={{
                    width: 144,
                    height: 144,
                    overflow: 'hidden',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  ref={this.mainViewRef}
                >
                  <QRCode value={accountId(this.state.address)} size={144} bgColor="black" fgColor="white" />
                </View>
              </View>
              <Text
                style={{
                  width: ScreenWidth * 0.5,
                  fontWeight: '200',
                  fontSize: 13,
                  marginTop: 12,
                  color: '#474747'
                }}
                ellipsizeMode="middle"
                numberOfLines={1}
              >
                {this.state.address}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  doubleClick(this.copy)
                }}
              >
                <View
                  style={{
                    backgroundColor: '#F14B79',
                    width: 180,
                    height: 49,
                    borderRadius: 8,
                    marginTop: 30,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ fontSize: 16, color: '#FFF' }}>{i18n.t('Assets.CopyAddress')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}
export default QRCodeView
