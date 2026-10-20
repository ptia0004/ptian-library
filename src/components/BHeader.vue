<script setup>
import { useRouter } from 'vue-router'
import { currentUser, isAuthenticated, logout } from '../auth'

const router = useRouter()

const handleLogout = async () => {
  await logout()
  router.push({ name: 'Logout' })
}
</script>

<template>
  <div class="container">
    <header class="d-flex flex-wrap justify-content-center align-items-center py-3 gap-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <RouterLink to="/" class="nav-link" exact-active-class="active">
            Home
          </RouterLink>
        </li>

        <li v-if="isAuthenticated" class="nav-item">
          <RouterLink to="/about" class="nav-link" active-class="active">
            About
          </RouterLink>
        </li>

        <li v-if="!isAuthenticated" class="nav-item">
          <RouterLink to="/login" class="nav-link" active-class="active">
            Login
          </RouterLink>
        </li>
        <li class="nav-item">
          <router-link to="/getbookcount" class="nav-link" active-class="active">
            Get Book Count
          </router-link>
        </li>
        <li class="nav-item">
          <RouterLink to="/WeatherCheck" class="nav-link" active-class="active">
            Get Weather
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/CountBookAPI" class="nav-link" active-class="active">
            Count Book API
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/GetAllBookAPI" class="nav-link" active-class="active">
            Get All Book API
          </RouterLink>
        </li>
        <li v-if="!isAuthenticated" class="nav-item">
          <RouterLink to="/FireLogin" class="nav-link" active-class="active">
            Firebase Login
          </RouterLink>
        </li>

        <li v-if="!isAuthenticated" class="nav-item">
          <RouterLink to="/FireRegister" class="nav-link" active-class="active">
            Firebase Register
          </RouterLink>
        </li>

        <li v-else class="nav-item">
          <button type="button" class="nav-link" @click="handleLogout">
            Logout
          </button>
        </li>
        <li class="nav-item">
          <router-link to="/addbook" class="nav-link" active-class="active">Add Book</router-link>
        </li>
      </ul>

      <p v-if="currentUser" class="mb-0 small text-secondary">
        {{ currentUser.email }} · role: {{ currentUser.role }}
      </p>
    </header>
  </div>
</template>
<style scoped>
.b-example-divider {
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow:
    inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1),
    inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.form-control-dark {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: var(--bs-gray);
}

.form-control-dark:focus {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.text-small {
  font-size: 85%;
}

.dropdown-toggle {
  outline: 0;
}
</style>
