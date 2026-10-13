import { ref } from 'vue'

/** Who opened the current WebUSB connect. Install and the navbar share one headset. */
export type ConnectOrigin = 'navbar' | 'install'

export const connectOrigin = ref<ConnectOrigin | null>(null)

export function claimConnectOrigin(origin: ConnectOrigin) {
  connectOrigin.value = origin
}
