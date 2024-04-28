<template>
    <v-navigation-drawer permanent v-if="(userStorage.currentUser !== null)">
        <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
            :title="userStorage.currentUser.user.name"></v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" :to="{ name: 'dashboard' }"
                value="dashboard"></v-list-item>
            <div v-if="activeRole?.role_name !== null">
                <v-list-item v-if="activeRole?.role_name === 'Super Admin'" prepend-icon="mdi-home-group"
                    title="Organization" :to="{ name: 'organization' }" value="organization"></v-list-item>
                <v-list-item v-if="activeRole?.role_name === 'Super Admin'" prepend-icon="mdi-account-group-outline"
                    title="User" :to="{ name: 'user' }" value="user"></v-list-item>
                <v-list-item v-if="activeRole?.role_name === 'Super Admin'" prepend-icon="mdi-cog-outline" title="Role"
                    :to="{ name: 'role' }" value="role"></v-list-item>
                <v-list-item prepend-icon="mdi-account" title="My Profile" :to="{ name: 'profile' }"
                    value="profile"></v-list-item>
            </div>
        </v-list>

        <template v-slot:append>
            <v-list density="compact" nav>
                <v-list-item @click="logoutUser" block prepend-icon="mdi-power" class="bg-red-darken-2" color="white"
                    title="Logout" value="logout"></v-list-item>
            </v-list>
        </template>
    </v-navigation-drawer>
</template>


<script setup>
import { useUserStorage } from '@/stores/userStorage'
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const userStorage = useUserStorage()

const { activeRole } = storeToRefs(userStorage)

const { logoutUser } = userStorage

onMounted(() => {
    userStorage.dataUser()
})
</script>
