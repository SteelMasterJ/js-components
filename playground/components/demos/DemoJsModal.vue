<script setup>
import { markRaw, ref } from "vue";
import { JsIcon, JsMarkdown, JsModal, JsNavItem } from "@steelmasterj/js-components";

const modalOpen = ref(false);
const modalSize = ref("md");
const lockedModalOpen = ref(false);
const dynamicModalOpen = ref(false);
const customHeaderModalOpen = ref(false);
const dynamicModalContent = markRaw(JsMarkdown);

function openModal(size) {
  modalSize.value = size;
  modalOpen.value = true;
}
</script>

<template>
  <div class="pg-stack">
    <div class="pg-card">
      <h3>Sizes (sm, md, lg, full), Locked Mode, Dynamic :component &amp; Custom Slots</h3>
      <div class="pg-row">
        <JsNavItem
          size="sm"
          theme="light"
          :item="{ label: 'Open Small Modal', button: 'button' }"
          @click="openModal('sm')"
        />
        <JsNavItem
          size="sm"
          theme="blue"
          :item="{ label: 'Open Medium Modal (Header + Footer)', button: 'button' }"
          @click="openModal('md')"
        />
        <JsNavItem
          size="sm"
          theme="light"
          :item="{ label: 'Open Large Modal', button: 'button' }"
          @click="openModal('lg')"
        />
        <JsNavItem
          size="sm"
          theme="light"
          :item="{ label: 'Open Fullscreen Modal', button: 'button' }"
          @click="openModal('full')"
        />
        <JsNavItem
          size="sm"
          theme="orange"
          :item="{ label: 'Open Locked Modal (No Backdrop/ESC)', button: 'button' }"
          @click="lockedModalOpen = true"
        />
        <JsNavItem
          size="sm"
          theme="lightblue"
          :item="{ label: 'Open Dynamic :component Modal', button: 'button' }"
          @click="dynamicModalOpen = true"
        />
        <JsNavItem
          size="sm"
          theme="purple"
          :item="{ label: 'Open Custom #header Slot Modal', button: 'button' }"
          @click="customHeaderModalOpen = true"
        />
      </div>
    </div>

    <JsModal
      v-model="modalOpen"
      :size="modalSize"
      :title="`Modal Example (${modalSize.toUpperCase()})`"
    >
      <p>
        Try pressing <strong>Tab</strong> and <strong>Shift+Tab</strong> to
        verify focus stays trapped inside the modal, or press
        <strong>Escape</strong> (or click the backdrop) to close and restore
        focus to the trigger button.
      </p>
      <label class="pg-field">
        Sample focusable input
        <input type="text" placeholder="Type something..." />
      </label>
      <template #footer="{ close }">
        <JsNavItem size="sm" theme="light" :item="{ label: 'Cancel', button: 'button' }" @click="close" />
        <JsNavItem size="sm" theme="blue" :item="{ label: 'Confirm', button: 'button' }" @click="close" />
      </template>
    </JsModal>

    <JsModal
      v-model="lockedModalOpen"
      title="Action Required"
      size="sm"
      :close-on-backdrop="false"
      :close-on-esc="false"
      :hide-close="true"
    >
      <p>
        Backdrop clicks and Escape are disabled here. You must explicitly
        choose an action below.
      </p>
      <template #footer="{ close }">
        <JsNavItem size="sm" theme="blue" :item="{ label: 'Acknowledge', button: 'button' }" @click="close" />
      </template>
    </JsModal>

    <JsModal
      v-model="dynamicModalOpen"
      title="Dynamic :component Rendering"
      :component="dynamicModalContent"
      :component-props="{
        val: 'Rendered dynamically via **:component** + **:component-props** gn[Works!]',
        parse: true,
      }"
    >
      <template #footer="{ close }">
        <JsNavItem size="sm" theme="light" :item="{ label: 'Done', button: 'button' }" @click="close" />
      </template>
    </JsModal>

    <JsModal v-model="customHeaderModalOpen" size="md" aria-label="Custom header modal">
      <template #header="{ titleId }">
        <div class="pg-row">
          <JsIcon name="check-circle" color="#1e7e34" />
          <h2 :id="titleId" style="margin: 0; font-size: 1.1rem;">Custom Header Slot</h2>
        </div>
      </template>
      <p>
        Use the <code>#header</code> scoped slot (receiving <code>titleId</code> and
        <code>close</code>) to compose custom badges, icons, or subheadings.
      </p>
      <template #footer="{ close }">
        <JsNavItem size="sm" theme="blue" :item="{ label: 'Close', button: 'button' }" @click="close" />
      </template>
    </JsModal>
  </div>
</template>
