<template>
    <div class="container mt-5 text-center">
        <h1>Access Denied</h1>

        <p class="text-danger">
            Your username or password is incorrect.
        </p>

        <RouterLink to="/login" class="btn btn-primary">
            Try Again
        </RouterLink>
    </div>
</template>