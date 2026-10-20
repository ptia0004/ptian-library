<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../auth'

const username = ref('')
const password = ref('')

const route = useRoute()
const router = useRouter()

const accessWasDenied = computed(
    () => route.query.denied === 'true'
)

const handleLogin = async () => {
    const successful = await login(username.value, password.value)

    if (!successful) {
        router.push({ name: 'AccessDenied' })
        return
    }

    const requestedPage = route.query.redirect

    const destination =
        typeof requestedPage === 'string' && requestedPage.startsWith('/')
            ? requestedPage
            : '/about'

    router.push(destination)
}
</script>

<template>
    <div class="container mt-5">
        <div class="col-md-6 offset-md-3">
            <h1>Member Login</h1>
            <p class="text-secondary">
                Use the username and password from the homepage registration form,
                or the demo account <strong>member</strong> / <strong>library123</strong>.
            </p>

            <div v-if="accessWasDenied" class="alert alert-danger">
                Please log in before accessing the members area.
            </div>

            <form @submit.prevent="handleLogin">
                <div class="mb-3">
                    <label for="login-username" class="form-label">
                        Username
                    </label>

                    <input id="login-username" v-model="username" type="text" class="form-control" required />
                </div>

                <div class="mb-3">
                    <label for="login-password" class="form-label">
                        Password
                    </label>

                    <input id="login-password" v-model="password" type="password" class="form-control" required />
                </div>

                <button type="submit" class="btn btn-primary">
                    Login
                </button>
            </form>
        </div>
    </div>
</template>