<template>
    <div class="container mt-5">
        <h1>Add Book</h1>
        <p class="text-secondary">
            New books are saved to the Firestore <code>books</code> collection.
        </p>
        <form @submit.prevent="addBook">
            <div class="mb-3">
                <label for="isbn">ISBN:</label>
                <input type="text" v-model="isbn" id="isbn" required class="form-control">
            </div>
            <div class="mb-3">
                <label for="name">Name:</label>
                <input type="text" v-model="name" id="name" required class="form-control">
            </div>
            <button type="submit" class="btn btn-primary">Add Book</button>
        </form>
        <p v-if="statusMessage" class="mt-3">{{ statusMessage }}</p>
        <BookList :reload-token="reloadToken" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import db from '../firebase/init.js'
import { collection, addDoc } from 'firebase/firestore'
import BookList from '../components/BookList.vue'

const isbn = ref('')
const name = ref('')
const statusMessage = ref('')
const reloadToken = ref(0)

const addBook = async () => {
    try {
        const docRef = await addDoc(collection(db, 'books'), {
            isbn: Number(isbn.value),
            name: name.value
        })

        console.log('Document written with ID: ', docRef.id)
        statusMessage.value = `Book added: ${name.value} (ISBN ${isbn.value})`

        isbn.value = ''
        name.value = ''
        reloadToken.value += 1
    } catch (error) {
        console.error('Error adding document: ', error)
        statusMessage.value = `Failed to add book: ${error.message}`
    }
}
</script>
