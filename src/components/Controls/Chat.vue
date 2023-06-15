<template>
  <div
    class="relative flex flex-col bg-slate-800 h-full rounded-lg border-2 p-2 gap-y-2"
    :style="{ borderColor: s.color + '55' }"
  >
    <div
      v-for="message in s.chatMessages"
      :class="[
        'flex flex-col w-fit text-black py-1 px-2 rounded-xl border border-black/50',
        `bg-${[s.color]}`,
        message.mine ? 'self-end' : 'self-start',
      ]"
      :style="{ backgroundColor: message.mine ? '#41B883' : '#74EBB6' }"
    >
      <div class="font-bold leading-1">{{ message.from }}</div>
      <div class="italic leading-none text-sm pl-2">{{ message.text }}</div>

      <div class="relative" v-if="s.isHost">
        <div class="absolute rounded-full bg-blue-900 text-white -left-4 -bottom-2 cursor-pointer" @click="addMessageAsBanner(message)">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
          />
        </svg>
    </div>
      </div>
    </div>

    <div class="absolute bottom-3 w-full pr-4">
      <input
        type="text"
        class="bg-gray-800 border border-gray-600 text-gray-50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder="Mensaje..."
        v-model="message"
        @keyup.enter="sendChatMessage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "../../store";
import { useAuth } from "@websanova/vue-auth"

const s = useStore();
const auth = useAuth();
const message = ref("");

const sendChatMessage = () => {
  if (!message.value) return

  window.Echo.private(`event.${auth.user().event_id}`)
    .whisper('chat.message', { from: s.name, text: message.value })
  s.chatMessages.push({ from: s.name, text: message.value, mine: true });
  message.value = null
}

const addMessageAsBanner = (chatMessage) => {
  s.vonage.session.signal({ type: 'add-banner', data: JSON.stringify({ title: `Pregunta de ${chatMessage.from}`, text: chatMessage.text, type: 'box'}) })
    s.banners = [...s.banners, { title: `Pregunta de ${chatMessage.from}`, text: chatMessage.text, type: 'box'},]
}
</script>

<style scoped></style>
