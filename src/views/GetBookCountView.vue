<template>
    <div>
        <h1>Book Counter</h1>

        <button @click="getBookCount">
            Get Book Count
        </button>

        <p v-if="count !== null">
            Total number of books: {{ count }}
        </p>

        <p v-if="error">
            {{ error }}
        </p>
    </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'

const count = ref(null)
const error = ref(null)

const getBookCount = async () => {
    try {
        const response = await axios.get(
            'https://us-central1-fit5032-ef8e5.cloudfunctions.net/countBooks'
        )
        count.value = response.data.count
        error.value = null
    } catch (err) {
        error.value = 'Error fetching book count'
        count.value = null
    }
}
</script>