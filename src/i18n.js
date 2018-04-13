import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n.use(LanguageDetector).init({
  resources: {
    es: {
      translations: {
        'Business form': 'Formulario de empresa',
        'Employee form': 'Formulario de empleado',
        Name: 'Nombre',
        Cif: 'Cif',
        Address: 'Dirección',
        Phone: 'Teléfono',
        Email: 'Email',
        Web: 'Web',
        Save: 'Guardar',
        Description: 'Descripción',
        'Name is required': 'El nombre es obligatorio',
        'Password is required': 'La contraseña es obligatoria',
        'The length must be more than 8 characters':
          'La longitudo debe de ser de más de 8 caracteres',
        'Cif is required': 'El Cif es obligatorio',
        'Nif is required': 'El Nif es obligatorio',
        'The length must be 9 characters':
          'La longitud debe de ser de 9 caracteres',
        'The length must be 9 numbers': 'La longtud debe de ser de 9 números',
        'Email is not valid': 'El correo no es válido',
        'Business created/edited succesfully!':
          'Empresa creada/edita correctamente',
        'Employee created/edited succesfully!':
          'Empleado creado/edito correctamente',
        'Full Salary': 'Salario completo',
        'Half Salary': 'Salario reducido',
        Login: 'Entra',
        Password: 'Contraseña',
        'You don\'t have an account yet?': '¿No tienes cuenta?',
        'Forgot the password?': '¿Has olvidado la contraseña?'
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
