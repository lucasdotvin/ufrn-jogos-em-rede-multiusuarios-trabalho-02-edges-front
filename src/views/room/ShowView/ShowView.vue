<script setup>
import XCard from '@/components/XCard.vue'
import XTitle from '@/components/XTitle.vue'
import { useRoomStore } from '@/stores/room.js'
import { computed, inject, onMounted, ref } from 'vue'
import XLink from '@/components/XLink.vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import XDialog from '@/components/XDialog.vue'
import RoomEventsListener from '@/listener/room/room.js'
import PlayerList from '@/views/room/ShowView/partial/PlayerList.vue'
import { usePlayerStore } from '@/stores/player.js'
import { useToastStore } from '@/stores/toast.js'
import XButton from '@/components/XButton.vue'

const router = useRouter()

const roomService = inject('service.room')

const playerStore = usePlayerStore()
const roomStore = useRoomStore()
const toastStore = useToastStore()

const readyLoading = ref(false)
const showRoomLeaveConfirmationDialog = ref(false)

let roomEventsWebsocket
let roomEventsListener

const playersCountLabel = computed(() => {
  const playersCount = Object.keys(playerStore.activeRoomPlayers).length

  return `(${playersCount}/${roomStore.activeRoom.max_players})`
})

onMounted(async () => {
  toastStore.addToast({
    type: 'info',
    text: 'Conectando à sala...'
  })

  roomEventsWebsocket = await roomService.subscribeToRoomEvents(roomStore.activeRoom.uuid)

  if (roomEventsWebsocket) {
    roomEventsListener = new RoomEventsListener(roomEventsWebsocket)
  }
})

onBeforeRouteLeave(() => {
  roomEventsListener.close()
})

const goBackToLobby = async () => {
  roomStore.setLeavingRoom(true)

  router.push({ name: 'lobby' }).finally(() => {
    playerStore.setPlayers([])
    playerStore.setReadyPlayerUuids([])
    playerStore.setUserCurrentlyPlaying(undefined)

    roomStore.setLeavingRoom(false)
    roomStore.setActiveRoom(null)
  })
}

const handleLobbyLinkClick = async () => {
  if (playerStore.activeRoomWinner) {
    await goBackToLobby()
    return
  }

  showRoomLeaveConfirmationDialog.value = true
}

const handleLeaveConfirm = async () => {
  await goBackToLobby()
}

const handleReadyButtonClick = async () => {
  readyLoading.value = true

  try {
    // TO DO
  } catch (error) {
    toastStore.addToast({
      type: 'error',
      text: error.message
    })
  }

  readyLoading.value = false
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-row gap-5">
      <aside class="w-52">
        <div>
          <header class="mb-4 text-center">
            <XCard>
              <XTitle>
                Jogadores

                <span v-text="playersCountLabel" />
              </XTitle>
            </XCard>
          </header>

          <PlayerList />
        </div>
      </aside>

      <aside>
        <XButton
          @click="handleReadyButtonClick"
          class="w-full"
          :loading="readyLoading"
        >
          Estou Pronto!
        </XButton>
      </aside>
    </div>

    <footer class="text-center">
      <XLink @click.capture.prevent="handleLobbyLinkClick" to="/lobby"> Voltar ao Lobby </XLink>
    </footer>
  </div>

  <XDialog
    v-model="showRoomLeaveConfirmationDialog"
    class="text-center"
    @confirm="handleLeaveConfirm"
  >
    <p class="mb-0.5 font-medium">Deseja realmente sair da sala?</p>

    <p class="text-sm">Caso o jogo já tenha começado, a sua saída será considerada desistência.</p>
  </XDialog>
</template>
