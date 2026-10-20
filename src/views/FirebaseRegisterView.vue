<template>
    <div class="container mt-5">
        <div class="col-md-6 offset-md-3">
            <h1>Create an Account</h1>
            <p class="text-secondary">
                New accounts always receive the <strong>user</strong> role.
                Admin access is assigned in Firebase trusted config, not on this form.
            </p>

            <div v-if="createdUser" class="alert alert-success">
                Registered {{ createdUser.email }} with role: {{ createdUser.role }}
            </div>

            <div v-if="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
            </div>

            <form @submit.prevent="register">
                <div class="mb-3">
                    <label class="form-label" for="register-email">Email</label>
                    <input id="register-email" v-model="email" type="email" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="register-password">Password</label>
                    <input id="register-password" v-model="password" type="password" class="form-control" minlength="6" required />
                </div>
                <button type="submit" class="btn btn-primary" :disabled="saving">
                    Save to Firebase
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { firebaseRegister } from '../auth'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const createdUser = ref(null)
const saving = ref(false)
const router = useRouter()

const register = async () => {
    errorMessage.value = ''
    createdUser.value = null
    saving.value = true

    try {
        createdUser.value = await firebaseRegister(email.value, password.value)
        email.value = ''
        password.value = ''
        router.push({ name: 'FireLogin' })
    } catch (error) {
        errorMessage.value = `Registration failed: ${error.code || error.message}`
        console.log(error.code)
    } finally {
        saving.value = false
    }
}
</script>
