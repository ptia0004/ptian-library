import { ref } from 'vue'

export const isAuthenticated = ref(
  sessionStorage.getItem('isAuthenticated') === 'true'
)

const VALID_USERNAME = 'member'
const VALID_PASSWORD = 'library123'

export const login = (username, password) => {
  const valid =
    username === VALID_USERNAME &&
    password === VALID_PASSWORD

  isAuthenticated.value = valid

  if (valid) {
    sessionStorage.setItem('isAuthenticated', 'true')
  } else {
    sessionStorage.removeItem('isAuthenticated')
  }

  return valid
}

export const logout = () => {
  isAuthenticated.value = false
  sessionStorage.removeItem('isAuthenticated')
}