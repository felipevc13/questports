import { defineComponent, h, type PropType } from 'vue'
import {
  KOFI_FOOTER_LABEL,
  KOFI_SUCCESS_AFTER,
  KOFI_SUCCESS_BEFORE,
  KOFI_SUCCESS_LINK,
  kofiHref,
  type KofiSurface
} from './kofi'

const SUCCESS_CLASS = 'max-w-full text-[11px] leading-relaxed text-muted-foreground'
const LINK_CLASS = 'inline-flex min-h-11 items-center font-medium text-foreground underline decoration-muted-foreground/40 underline-offset-2 hover:text-primary md:min-h-0'
const FOOTER_CLASS = 'inline-flex min-h-11 items-center justify-center rounded-md px-2 text-center transition-colors hover:text-foreground md:min-h-0 md:justify-start md:px-0'

/** The tip line. Renders nothing when the URL is empty or not http(s). */
export const KofiTipView = defineComponent({
  name: 'KofiTipView',
  props: {
    href: { type: String, default: '' },
    surface: { type: String as PropType<KofiSurface>, required: true }
  },
  emits: ['activate'],
  setup(props, { emit }) {
    return () => {
      const href = kofiHref(props.href)
      if (!href) return null
      const onClick = (event: MouseEvent) => emit('activate', event)
      const link = {
        href,
        target: '_blank',
        rel: 'noopener noreferrer',
        onClick
      }
      if (props.surface === 'footer') {
        return h('a', {
          ...link,
          'data-testid': 'kofi-footer',
          class: FOOTER_CLASS
        }, KOFI_FOOTER_LABEL)
      }
      if (props.surface !== 'install_success') return null
      return h('p', {
        'data-testid': 'kofi-install-success',
        class: SUCCESS_CLASS
      }, [
        KOFI_SUCCESS_BEFORE,
        h('a', {
          ...link,
          'data-testid': 'kofi-install-success-link',
          class: LINK_CLASS
        }, KOFI_SUCCESS_LINK),
        KOFI_SUCCESS_AFTER
      ])
    }
  }
})
