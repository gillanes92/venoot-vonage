<template>
  <div class="flex flex-col gap-2">
    <div
      class="flex flex-row bg-green-400 rounded-lg text-black p-3 cursor-pointer justify-center font-bold"
      @click="
        s.banner = null;
        s.lastBanner = null;
      "
    >
      Nueva Pregunta
    </div>
    <div
      class="flex flex-col bg-slate-600 rounded-lg text-white p-3 cursor-pointer justify-center font-bold"
      v-for="question in s.questions"
    >
      <div class="text-xl">
        <span class="text-slate-300">Q.</span> {{ question.title }}
      </div>

      <div
        v-for="(option, index) in question.options"
        class="flex flex-row text-sm italic w-full"
      >
        <div>
          <span class="text-slate-300">{{ index + 1 }}.</span> {{ option.text }}
        </div>
        <div class="grow"></div>
        <div class="text-md text-blue-200">{{ option.selected }}</div>
      </div>
      <div class="bg-yellow-600 w-full p-2 text-center rounded-lg mt-3" @click="changeStatus(question)">
        {{ nextStatusText(question.status) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "../../store";
import { useAuth } from "@websanova/vue-auth"

const auth = useAuth();
const s = useStore();

const nextStatusText = (currentStatus) => {
  switch (currentStatus) {
    case "idle":
      return "Iniciar";

    case "active":
      return "Terminar";

    case "done":
      return "Mostrar";

    case "shown":
      return "Esconder";
  }
};

const changeStatus = (question) => {
  switch (question.status) {
    case "idle":
      question.status = "active";
      window.Echo.private(`event.${auth.user().event_id}`)
        .whisper('poll.start', {})
      break;

    case "active":
      question.status = "done";
      window.Echo.private(`event.${auth.user().event_id}`)
        .whisper('poll.close', {})
      break;

    case "done":
      question.status = "shown";
      break;

    case "shown":
      question.status = "done";
      break;
  }
};
</script>

<style lang="scss" scoped></style>
