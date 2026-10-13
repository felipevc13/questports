import {
  createInstallStepLedger,
  installStepEventsForConnectPhase,
  installStepEventsForConnectResult,
  type InstallStepEvent
} from '~/lib/analytics'

/**
 * The connect/authorize slice of an install_step ledger.
 * The port page records the same steps around questAdb.connect(); the navbar uses this helper
 * so a header connect emits that sequence without starting an install.
 */
export function createConnectStepSession() {
  const ledger = createInstallStepLedger()
  let sawAuthorize = false

  const push = (events: InstallStepEvent[]): InstallStepEvent[] => {
    const accepted: InstallStepEvent[] = []
    for (const event of events) {
      const ok = event.status === 'start'
        ? ledger.start(event.step)
        : ledger.finish(event.step, event.status)
      if (ok) accepted.push(event)
    }
    return accepted
  }

  return {
    start(): InstallStepEvent[] {
      return push([{ step: 'connect', status: 'start' }])
    },
    onPhase(phase: string): InstallStepEvent[] {
      const events = installStepEventsForConnectPhase(phase)
      if (events.some(event => event.step === 'authorize')) sawAuthorize = true
      return push(events)
    },
    finish(connected: boolean): InstallStepEvent[] {
      return push(installStepEventsForConnectResult({ connected, sawAuthorize }))
    }
  }
}
