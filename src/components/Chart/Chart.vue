<template>
  <canvas id="chart" class="mx-auto p-10"></canvas>
</template>

<script setup>
import Chart from "chart.js/auto";
import { onMounted } from "vue";
import { useStore } from "../../store";

const s = useStore()

const activeQuestion = s.questions.find(q => q.status === 'shown')

const data = {
  labels: activeQuestion.options.map(o => o.text),
  datasets: [{
    label: activeQuestion.title,
    data: activeQuestion.options.map(o => o.selected),
    hoverOffset: 4
  }]
}

onMounted(() => {
  new Chart(document.getElementById("chart"), {
    type: "pie",
    data
  });
});
</script>

<style lang="scss" scoped></style>
