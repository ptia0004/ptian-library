<template>
    <div class="container mt-5 text-center">
        <h1>Logged out</h1>
        <p>You have been signed out of the library.</p>
        <p class="text-secondary">Current user: null</p>
        <RouterLink to="/FireLogin" class="btn btn-primary">
            Sign in again
        </RouterLink>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { auth } from '../firebase/init'

onMounted(() => {
    console.log('Current user:', auth.currentUser)
})
</script>
