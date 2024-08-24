<script setup>
import { UserCircleIcon } from '@heroicons/vue/16/solid'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { usePlayerStore } from '@/stores/player.js'

const props = defineProps({
  player: {
    type: Object,
    required: true
  }
})

const authStore = useAuthStore()
const playerStore = usePlayerStore()

const isCurrentPlayer = computed(() => {
  return props.player.uuid === authStore.user.uuid
})

const playerNameLabel = computed(() => {
  if (isCurrentPlayer.value) {
    return 'Você'
  }

  return props.player.name
})

const isReady = computed(() => {
  return playerStore.readyPlayerUuids.includes(props.player.uuid)
})
</script>

<template>
  <li
    class="background-transparent group flex w-full items-center space-x-2 border-x border-t border-zinc-400/50 p-4 text-left transition last:border-b"
  >
    <div class="flex flex-1 flex-col space-y-0.5 overflow-hidden">
      <div class="flex flex-row items-center gap-1.5">
        <UserCircleIcon class="h-4 w-4 flex-none opacity-40" />

        <span
          class="flex-1 truncate text-sm font-medium tracking-wide"
          :class="{
            italic: isCurrentPlayer
          }"
          v-text="playerNameLabel"
        />
      </div>

      <div class="flex flex-row items-center gap-1.5">
        <template v-if="isReady">
          <span class="flex-1 truncate text-xs font-thin tracking-wide"> Pronto </span>
        </template>

        <template v-else>
          <span class="flex-1 truncate text-xs font-thin tracking-wide"> Aguardando </span>
        </template>
      </div>
    </div>
  </li>
</template>
