import { computed, ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { auth } from './firebase/init'

// Admin is granted here (or via Firebase custom claims), not on the register form.
export const ADMIN_EMAILS = ['ptia0004@student.monash.edu']

const REGISTERED_USERS_KEY = 'libraryRegisteredUsers'
const LOCAL_PROFILE_KEY = 'libraryLocalProfile'

const loadRegisteredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]')
  } catch {
    return []
  }
}

export const registeredUsers = ref(loadRegisteredUsers())

const saveRegisteredUsers = () => {
  localStorage.setItem(
    REGISTERED_USERS_KEY,
    JSON.stringify(registeredUsers.value)
  )
}

const loadLocalProfile = () => {
  try {
    return JSON.parse(sessionStorage.getItem(LOCAL_PROFILE_KEY) || 'null')
  } catch {
    return null
  }
}

export const currentUser = ref(loadLocalProfile())

const sessionAuthenticated = ref(
  sessionStorage.getItem('isAuthenticated') === 'true'
)

export const isAuthenticated = computed(
  () => !!currentUser.value || sessionAuthenticated.value
)

export const userRole = computed(() => currentUser.value?.role ?? null)

const VALID_USERNAME = 'member'
const VALID_PASSWORD = 'library123'

const normalizeEmail = (email) => (email || '').trim().toLowerCase()

export const resolveRole = async (user) => {
  if (!user) {
    return null
  }

  try {
    const token = await user.getIdTokenResult()

    if (token.claims.admin === true || token.claims.role === 'admin') {
      return 'admin'
    }

    if (typeof token.claims.role === 'string' && token.claims.role) {
      return token.claims.role
    }
  } catch {
    // Custom claims are optional; fall through to the admin email list.
  }

  if (ADMIN_EMAILS.map(normalizeEmail).includes(normalizeEmail(user.email))) {
    return 'admin'
  }

  return 'user'
}

export const toUserProfile = (user, role) => {
  if (!user) {
    return null
  }

  return {
    uid: user.uid,
    email: user.email,
    role
  }
}

const setLocalProfile = (profile) => {
  currentUser.value = profile

  if (profile) {
    sessionStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile))
  } else {
    sessionStorage.removeItem(LOCAL_PROFILE_KEY)
  }

  return profile
}

const syncFirebaseUser = async (user) => {
  if (!user) {
    if (!sessionAuthenticated.value) {
      setLocalProfile(null)
    }
    return currentUser.value
  }

  const role = await resolveRole(user)
  return setLocalProfile(toUserProfile(user, role))
}

let resolveAuthReady
export const waitForAuth = new Promise((resolve) => {
  resolveAuthReady = resolve
})

onAuthStateChanged(auth, async (user) => {
  await syncFirebaseUser(user)
  resolveAuthReady?.()
  resolveAuthReady = null
})

const findRegisteredUser = (username, password) =>
  registeredUsers.value.find(
    (user) =>
      user.username.toLowerCase() === username.trim().toLowerCase() &&
      user.password === password
  )

export const registerLibraryUser = async ({ username, password, ...details }) => {
  const name = username.trim()

  if (
    registeredUsers.value.some(
      (user) => user.username.toLowerCase() === name.toLowerCase()
    )
  ) {
    throw new Error('That username is already registered. Please log in.')
  }

  const account = {
    username: name,
    password,
    role: 'user',
    ...details
  }

  registeredUsers.value.push(account)
  saveRegisteredUsers()

  if (name.includes('@')) {
    try {
      await firebaseRegister(name, password)
    } catch (error) {
      console.log(error.code || error.message)
    }
  }

  console.log('Library Register Successful!')
  console.log('Current user:', { username: name, role: 'user' })

  return account
}

export const login = async (username, password) => {
  const name = username.trim()

  if (name.includes('@')) {
    try {
      await firebaseLogin(name, password)
      sessionAuthenticated.value = true
      sessionStorage.setItem('isAuthenticated', 'true')
      return true
    } catch (error) {
      console.log(error.code || error.message)
    }
  }

  const registered = findRegisteredUser(name, password)
  const demoAccount =
    name === VALID_USERNAME && password === VALID_PASSWORD

  const valid = Boolean(registered || demoAccount)

  sessionAuthenticated.value = valid

  if (!valid) {
    sessionStorage.removeItem('isAuthenticated')
    setLocalProfile(null)
    return false
  }

  sessionStorage.setItem('isAuthenticated', 'true')
  const profile = setLocalProfile({
    uid: registered ? `local:${registered.username}` : 'local:member',
    email: registered?.username || VALID_USERNAME,
    role: registered?.role || 'user'
  })

  console.log('Sign in Successful!')
  console.log('Current user:', profile)

  return true
}

export const firebaseRegister = async (email, password) => {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  )
  const role = await resolveRole(credential.user)
  const profile = toUserProfile(credential.user, role)

  console.log('Firebase Register Successful!')
  console.log('Current user:', profile)

  await signOut(auth)

  return profile
}

export const firebaseLogin = async (email, password) => {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const profile = await syncFirebaseUser(credential.user)

  console.log('Firebase Sign in Successful!')
  console.log('Current user:', profile)

  return profile
}

export const logout = async () => {
  sessionAuthenticated.value = false
  sessionStorage.removeItem('isAuthenticated')
  setLocalProfile(null)

  if (auth.currentUser) {
    await signOut(auth)
  }

  console.log('Logged out')
  console.log('Current user:', auth.currentUser)
}
