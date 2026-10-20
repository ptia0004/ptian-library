<template>
    <div class="about container mt-4">
        <h1>About Our Library</h1>
        <p>
            Welcome to our digital library! We're dedicated to providing a vast collection of books and resources to our
            community.
        </p>

        <div v-if="currentUser" class="alert" :class="currentUser.role === 'admin' ? 'alert-warning' : 'alert-info'">
            <p class="mb-1"><strong>Signed in as:</strong> {{ currentUser.email }}</p>
            <p class="mb-1"><strong>Role:</strong> {{ currentUser.role }}</p>
            <p v-if="currentUser.role === 'admin'" class="mb-0">
                Admin area: you can manage library members and reviews.
            </p>
            <p v-else class="mb-0">
                Member area: you can browse and borrow books.
            </p>
        </div>
    </div>
</template>

<script setup>
import { currentUser } from '../auth'
</script>

<style></style>
