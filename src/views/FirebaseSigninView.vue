<template>
    <div class="container mt-5">
        <div class="col-md-6 offset-md-3">
            <h1>Sign in</h1>
            <p class="text-secondary">
                Sign in with a Firebase account. The page and console both show the assigned role.
            </p>

            <div v-if="displayedUser" class="alert alert-success">
                <p class="mb-1">Firebase Sign in Successful!</p>
                <p class="mb-0">
                    Current user: {{ displayedUser.email }} · role: {{ displayedUser.role }}
                </p>
            </div>

            <div v-if="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
            </div>

            <form @submit.prevent="signin">
                <div class="mb-3">
                    <label class="form-label" for="signin-email">Email</label>
                    <input id="signin-email" v-model="email" type="email" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="signin-password">Password</label>
                    <input id="signin-password" v-model="password" type="password" class="form-control" required />
                </div>
                <button type="submit" class="btn btn-primary" :disabled="signingIn">
                    Sign in via Firebase
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { currentUser, firebaseLogin } from '../auth'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const signedInUser = ref(null)
const signingIn = ref(false)
const displayedUser = computed(() => signedInUser.value || currentUser.value)

const signin = async () => {
    errorMessage.value = ''
    signedInUser.value = null
    signingIn.value = true

    try {
        signedInUser.value = await firebaseLogin(email.value, password.value)
    } catch (error) {
        errorMessage.value = `Sign in failed: ${error.code || error.message}`
        console.log(error.code)
    } finally {
        signingIn.value = false
    }
}
</script>
