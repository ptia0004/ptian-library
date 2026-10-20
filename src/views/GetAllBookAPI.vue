<template>
  <pre>{{ jsondata }}</pre>
  <p v-if="error">{{ error }}</p>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const jsondata = ref(null);
const error = ref(null);

const getAllBookAPI = async () => {
  try {
    const response = await axios.get(
      'https://us-central1-fit5032-ef8e5.cloudfunctions.net/getAllBooks'
    );
    jsondata.value = JSON.stringify(response.data, null, 2);
    error.value = null;
  } catch (err) {
    error.value = 'Error fetching books';
    jsondata.value = null;
  }
};

onMounted(() => {
  getAllBookAPI();
});
</script>
