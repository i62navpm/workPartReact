import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-xhr-backend'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'es',
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    keySeparator: false,
    interpolation: {
      formatSeparator: ','
    },
    react: {
      wait: true
    }
  })

export default i18n
