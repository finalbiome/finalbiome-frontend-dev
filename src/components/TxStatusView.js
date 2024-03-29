import { Icon, Message } from 'semantic-ui-react'


function TxStatusView({
  status,
  setStatus
}) {

  // const tid = window.setTimeout(() => setStatus(''), 5000);

  if (!status) return (null)

  const onDismiss = () => {
    setStatus('')
    // window.clearTimeout(tid);
  }

  const iconName = (status) => {
    switch (true) {
      case status === 'Sending...':
        return 'spinner'
      // 😉 Finalized. Block hash...
      case status[1] === '\uDE09':
        return 'flag checkered'
      // 😞 Transaction Failed:...
      case status[1] === '\uDE1E':
      case status[0] === 'E':
        return 'exclamation triangle'
    
      default:
        return 'info'
    }
  }
  const info = (status) => {
    return (status[1] !== '\uDE1E' && status[0] !== '\uD83D' && status[0] !== 'E')
  }
  const positive = (status) => {
    // autoCleanStatus()
    return status[1] === '\uDE09'
  }
  const negative = (status) => {
    return status[1] === '\uDE1E' || status[0] === 'E'
  }

  return (
    <Message
        hidden={!status}
        icon
        onDismiss={onDismiss}
        info={info(status)}
        positive={positive(status)}
        negative={negative(status)}
      >
        <Icon name={iconName(status)} loading={status === 'Sending...'} />
        <Message.Content>{status}</Message.Content>
      </Message>
  )
}

export {
  TxStatusView
}
