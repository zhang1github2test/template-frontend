<template>
  <component :is="linkProps.is" v-bind="linkProps">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { isExternal } from '@/utils/validate'

interface Props {
  to: string
}

const props = defineProps<Props>()

const linkProps = computed(() => {
  if (isExternal(props.to)) {
    return {
      is: 'a',
      href: props.to,
      target: '_blank',
      rel: 'noopener noreferrer'
    }
  }

  return {
    is: 'router-link',
    to: props.to
  }
})
</script>