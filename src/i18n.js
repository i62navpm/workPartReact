import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n.use(LanguageDetector).init({
  resources: {
    es: {
      translations: {
        'Business form': 'Formulario de empresa',
        Name: 'Nombre',
        Cif: 'Cif',
        Address: 'Dirección',
        Phone: 'Teléfono',
        Email: 'Email',
        Web: 'Web',
        Save: 'Guardar',
        'Name is required': 'El nombre es obligatorio',
        'Cif is required': 'El Cif es obligatorio',
        'The length must be 9 characters':
          'La longitud debe de ser de 9 caracteres',
        'The length must be 9 numbers': 'La longtud debe de ser de 9 números',
        'Email is not valid': 'El correo no es válido',
        'Business created/edited succesfully!':
          'Empresa creada/edita correctamente'
      }
    }
  },
  fallbackLng: 'es',
  debug: true,
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
