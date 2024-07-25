<template>
    <v-navigation-drawer permanent v-if="(userStorage.currentUser !== null)">
        <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
            :title="activeRole.user_name"></v-list-item>
        <v-divider></v-divider>

        <v-list density="compact" nav>
            <!-- {{ listMenu }} -->
            <v-list-item v-for="(menu, idx) in listMenu" :key="idx" :prepend-icon="menu.icon" :title="menu.title"
                :to="{ name: menu.toRoute }" :value="menu.toValue" active-class="active-link" exact>
            </v-list-item>
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
import { onBeforeMount, onMounted, onUnmounted, reactive, ref } from 'vue';
import eventBus from "@/stores/eventBus"
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const userStorage = useUserStorage()
const router = useRouter()

const { logoutUser, getMenu } = userStorage
const { activeRole } = storeToRefs(userStorage)

const listMenu = ref(getMenu(activeRole.value))

const updateDrawerItems = (userData) => {
    listMenu.value = userData.listMenu
    activeRole.value = userData.activeRole
};

const updateSwitchItems = (userData) => {
    listMenu.value = userData.listMenu
    activeRole.value = userData.activeRole
    router.push({ name: 'dashboard' })
};

onBeforeMount(() => {
    eventBus.on('dataSwitchRole', updateSwitchItems);
})

onMounted(() => {
    eventBus.on('dataUpdated', updateDrawerItems);
})

onUnmounted(() => {
    eventBus.off('dataSwitchRole', updateSwitchItems);
    eventBus.off('dataUpdated', updateDrawerItems);
})

</script>

<style>
.active-link {
    font-weight: bold;
    color: red;
}
</style>