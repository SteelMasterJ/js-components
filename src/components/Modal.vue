<template>
  <div to="modal">
    <div class="modal-wrapper">
      <div class="overlay" @click="$router.back()"></div>
      <div class="modal">
        <!-- you can use v-bind to pass down all props -->
        <component :is="component" v-bind="$attrs" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "JsModal",
  props: ["component"],
};
</script>

<style scoped>
.modal-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
.modal {
  position: fixed;
  z-index: 1000;
  margin: auto;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 5em;
  border: 1px solid #ccc;
  border-radius: 1em;
  box-shadow: 0 0 1em #00000033;
}

.overlay {
  z-index: 999;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: #00000055;
}
</style>

