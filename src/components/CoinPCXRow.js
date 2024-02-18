import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Text } from 'react-native'
import moment from 'moment/moment'
import { formatBalance } from '@polkadot/util'
import { ScreenWidth } from '../util/Common'
import chainxAPI from '../util/chainxAPI'

export default class CoinPCXRow extends Component {
  render() {
    const { item, index, navigation, address } = this.props
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.7}
        onPress={() => {
          navigation.navigate('PCX_Transfer_Hash_Detail', { data: item })
        }}
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          height: 64,
          borderBottomWidth: 1,
          borderColor: '#F0F0F0'
        }}
      >
        <View style={{ marginLeft: ScreenWidth / 16.3, flex: 1 }}>
          <Text
            ellipsizeMode="middle"
            numberOfLines={1}
            style={{ fontSize: 14, color: '#4FACD1', width: ScreenWidth * 0.7 }}
          >
            {'form: ' + chainxAPI.getAddress(item.signed)}
          </Text>
          <Text
            ellipsizeMode="middle"
            numberOfLines={1}
            style={{ fontSize: 14, color: '#76CE29', width: ScreenWidth * 0.7 }}
          >
            {'to: ' + chainxAPI.getAddress(item.payee)}
          </Text>
          <Text style={{ marginTop: 5, fontSize: 13, color: '#AAAAAA' }}>
            {moment(item.time).format('DD/MM/YYYY HH:mm:ss')}
          </Text>
        </View>
        {/* 余额 | Balance */}
        <Text
          style={{
            marginRight: 5,
            fontSize: 12,
            color: '#3E2D32'
          }}
        >
          {(() => {
            if (chainxAPI.getIfTransferIn(address, item.signed)) {
              return `- ${String(parseInt(item.value) / 100000000)}`
            } else {
              return `+ ${String(parseInt(item.value) / 100000000)}`
            }
          })()}
        </Text>
        <Image
          source={(() => {
            if (chainxAPI.getIfTransferIn(address, item.signed)) {
              return require('../assets/images/public/assets_btc_down.png')
            } else {
              return require('../assets/images/public/assets_btc_up.png')
            }
          })()}
          style={{ width: 7, height: 12, marginRight: 5 }}
        />
      </TouchableOpacity>
    )
  }
}
