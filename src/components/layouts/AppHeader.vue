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

<script>
import { useUserStorage } from '@/stores/userStorage';
import { storeToRefs } from 'pinia'
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router'

import InputLogin from '../forms/InputLogin.vue';

export default {
  components: {
    InputLogin,
  },
  setup(props, { emit }) {
    const userStorage = useUserStorage()
    const router = useRouter()

    const { dialog, activeRole, me, selectedRole } = storeToRefs(userStorage)

    const openLogin = () => {
      dialog.value = true
    }

    const menu = ref(false)
    console.log('header activeRole: ', activeRole.value)

    const myRoleList = reactive(me?.value?.roles)

    const handleSwitchRole = (idx) => {
      selectedRole.value = idx
      const changedRole = myRoleList[idx]
      activeRole.value.org_name = changedRole.org_name
      activeRole.value.role_name = changedRole.role_name
      console.log('emit clicked')
      localStorage.setItem('activeRole', JSON.stringify(changedRole))
      emit('dataUpdated', activeRole.value);
      router.push({ name: 'dashboard' })
    };

    onMounted(() => {
      userStorage.dataUser()
    })

    return {
      userStorage,
      openLogin,
      menu,
      myRoleList,
      dialog,
      me,
      activeRole,
      handleSwitchRole,
    }
  }
}

</script>