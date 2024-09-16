import type { MaybeRef } from '@vueuse/shared'
import type { WebFrame } from 'electron'
import type { Ref } from 'vue-demi'
import { isRef, ref, watch } from 'vue-demi'

export function useZoomLevel(level: MaybeRef<number>): Ref<number>
export function useZoomLevel(webFrame: WebFrame, level: MaybeRef<number>): Ref<number>
export function useZoomLevel(webFrame: WebFrame): Ref<number>
export function useZoomLevel(): Ref<number>

/**
 * Reactive WebFrame zoom level
 *
 * @see https://www.electronjs.org/docs/api/web-frame#webframesetzoomlevellevel
 * @see https://vueuse.org/useZoomLevel
 */
export function useZoomLevel(...args: any[]): Ref<number> {
  let webFrame: WebFrame | undefined
  let newLevel: Ref<number> | null = null

  if (
    args.length === 0
    || (isRef(args[0]) && typeof args[0].value === 'number')
    || typeof args[0] === 'number'
  ) {
    webFrame = window.require ? window.require('electron').webFrame : undefined
    newLevel = args.length > 0 ? ref(args[0]) : null
  }
  else {
    webFrame = args[0]
    newLevel = args.length > 1 ? ref(args[1]) : null
  }

  if (!webFrame)
    throw new Error('provide WebFrame module or enable nodeIntegration')

  const level = ref(newLevel ?? webFrame.getZoomLevel())

  watch(
    level,
    (f, o) => {
      if (typeof f === 'number' && f !== o)
        webFrame?.setZoomLevel(f)
    },
    { immediate: true },
  )

  return level
}
