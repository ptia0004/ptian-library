<template>
    <div class="mt-5">
        <h2>Manage books</h2>
        <p class="text-secondary">
            Update or delete a Firestore document, then check the Firebase console.
        </p>

        <p v-if="statusMessage">{{ statusMessage }}</p>

        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>ISBN</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="book in allBooks" :key="book.id">
                    <td>
                        <input
                            v-if="editingId === book.id"
                            v-model="editName"
                            type="text"
                            class="form-control"
                            required
                        >
                        <span v-else>{{ book.name }}</span>
                    </td>
                    <td>
                        <input
                            v-if="editingId === book.id"
                            v-model="editIsbn"
                            type="text"
                            class="form-control"
                            required
                        >
                        <span v-else>{{ book.isbn }}</span>
                    </td>
                    <td class="text-nowrap">
                        <template v-if="editingId === book.id">
                            <button type="button" class="btn btn-sm btn-success me-2" @click="updateBook(book)">
                                Save
                            </button>
                            <button type="button" class="btn btn-sm btn-secondary" @click="cancelEdit">
                                Cancel
                            </button>
                        </template>
                        <template v-else>
                            <button type="button" class="btn btn-sm btn-outline-primary me-2" @click="startEdit(book)">
                                Update
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-danger" @click="deleteBook(book)">
                                Delete
                            </button>
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>

        <h2 class="mt-5">Books with ISBN &gt; 1000</h2>
        <p class="text-secondary">
            Retrieved with <code>where</code>, <code>orderBy</code> and <code>limit(5)</code>.
        </p>
        <ul>
            <li v-for="book in queriedBooks" :key="book.id">
                {{ book.name }} (ISBN: {{ book.isbn }})
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import db from '../firebase/init.js'
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore'

const props = defineProps({
    reloadToken: {
        type: Number,
        default: 0
    }
})

const allBooks = ref([])
const queriedBooks = ref([])
const editingId = ref('')
const editName = ref('')
const editIsbn = ref('')
const statusMessage = ref('')

const mapDocs = (snapshot) => {
    const books = []
    snapshot.forEach((item) => {
        books.push({ id: item.id, ...item.data() })
    })
    return books
}

const fetchAllBooks = async () => {
    const snapshot = await getDocs(collection(db, 'books'))
    allBooks.value = mapDocs(snapshot)
}

const fetchQueriedBooks = async () => {
    const q = query(
        collection(db, 'books'),
        where('isbn', '>', 1000),
        orderBy('isbn', 'asc'),
        limit(5)
    )
    const snapshot = await getDocs(q)
    queriedBooks.value = mapDocs(snapshot)
}

const fetchBooks = async () => {
    try {
        await Promise.all([fetchAllBooks(), fetchQueriedBooks()])
    } catch (error) {
        console.error('Error fetching books: ', error)
        statusMessage.value = `Failed to load books: ${error.message}`
    }
}

const startEdit = (book) => {
    editingId.value = book.id
    editName.value = book.name
    editIsbn.value = String(book.isbn)
}

const cancelEdit = () => {
    editingId.value = ''
    editName.value = ''
    editIsbn.value = ''
}

const updateBook = async (book) => {
    try {
        await updateDoc(doc(db, 'books', book.id), {
            name: editName.value,
            isbn: Number(editIsbn.value)
        })
        statusMessage.value = `Updated ${editName.value}`
        cancelEdit()
        await fetchBooks()
    } catch (error) {
        console.error('Error updating book: ', error)
        statusMessage.value = `Failed to update book: ${error.message}`
    }
}

const deleteBook = async (book) => {
    try {
        await deleteDoc(doc(db, 'books', book.id))
        statusMessage.value = `Deleted ${book.name}`
        if (editingId.value === book.id) {
            cancelEdit()
        }
        await fetchBooks()
    } catch (error) {
        console.error('Error deleting book: ', error)
        statusMessage.value = `Failed to delete book: ${error.message}`
    }
}

onMounted(() => {
    fetchBooks()
})

watch(
    () => props.reloadToken,
    () => {
        fetchBooks()
    }
)
</script>
