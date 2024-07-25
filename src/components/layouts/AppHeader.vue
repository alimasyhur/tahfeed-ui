<template>
  <v-app-bar color="white" flat>
    <v-app-bar-title :to="{ name: 'home' }">
      <b>tah</b><b style="color: green;">feed</b>
    </v-app-bar-title>

    <v-spacer></v-spacer>
    <v-btn :to="{ name: 'home' }" class="not-uppercase" v-if="(userStorage.currentUser == null)">Home</v-btn>
    <v-btn target="#" class="not-uppercase ml-2" @click="openLogin()"
      v-if="(userStorage.currentUser === null)">Login</v-btn>
    <div class="text-center mx-2" v-if="(userStorage.currentUser !== null)">
      <v-menu v-model="menu" :close-on-content-click="false" location="end">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" class="not-uppercase">
            <small class="not-uppercase"><b style="color: green">{{ activeRole?.org_name }} <span>({{
              activeRole?.role_name
                  }})</span></b></small>
          </v-btn>
        </template>

        <v-card min-width="300">
          <v-list>
            <v-list-item prepend-icon="mdi-cog" subtitle="Switch Role">
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <v-list-item v-for="(role, idx) in myRoleList" :key="idx" class="text-decoration-none bg-white"
              color="grey-darken-3" style="background-color: white;" @click="handleSwitchRole(idx)">
              {{ role.org_name }} ({{ role.role_name }})
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </div>

  </v-app-bar>

  <v-dialog v-model="dialog" width="auto" :dialog="dialog" persistent>
    <v-card class="mx-auto px-4 py-4" width="500" rounded="lg">

      <v-card-text>

        <InputLogin />

      </v-card-text>
    </v-card>

  </v-dialog>
</template>

<script setup>
import { useUserStorage } from '@/stores/userStorage';
import { storeToRefs } from 'pinia'
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import eventBus from "@/stores/eventBus"
// import { useRouter } from 'vue-router';

import InputLogin from '../forms/InputLogin.vue';
// const router = useRouter()

const userStorage = useUserStorage()

const { getMenu, setSelectedRole } = userStorage

const { dialog, selectedRole, activeRole, me } = storeToRefs(userStorage)

const openLogin = () => {
  dialog.value = true
}

const menu = ref(false)

const myRoleList = ref({})
const listMenu = ref({})

const handleSwitchRole = (idx) => {
  selectedRole.value = idx
  setSelectedRole(idx)
  const changedRole = myRoleList.value[idx]
  activeRole.value = changedRole
  localStorage.setItem('activeRole', JSON.stringify(changedRole))
  listMenu.value = getMenu(activeRole.value)
  const newData = {
    activeRole: changedRole,
    listMenu: listMenu.value,
    myRoleList
  }

  eventBus.emit('dataSwitchRole', newData)
};

const updateUserData = (userData) => {
  activeRole.value = userData.activeRole
  myRoleList.value = userData.myRoleList
  listMenu.value = getMenu(userData.activeRole)
};

onMounted(() => {
  if (userStorage?.accessToken !== 'null') {
    userStorage.dataUser()
    const myActiveRole = activeRole.value
    const listMenu = getMenu(myActiveRole)
    myRoleList.value = me?.value.roles
    const initData = {
      activeRole: myActiveRole,
      myRoleList: myRoleList.value,
      listMenu
    }

    eventBus.emit('dataSwitchRole', initData);
  }
})

onBeforeMount(() => {
  eventBus.on('dataUpdated', updateUserData);
})

onUnmounted(() => {
  eventBus.off('dataSwitchRole', updateUserData);
  eventBus.off('dataUpdated', updateUserData);
})

</script>