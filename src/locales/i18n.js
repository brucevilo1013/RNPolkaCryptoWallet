import i18n, { getLanguages } from 'react-native-i18n'
import en from './en-US/index'
import zh from './zh-CN/index'

getLanguages().then(languages => {
  if (languages[0] == 'en' || languages[0] == 'en-US') {
    i18n.defaultLocale = 'en'
  } else {
    i18n.defaultLocale = 'zh'
  }
})

i18n.fallbacks = true
i18n.translations = {
  en,
  zh
}
export default i18n
