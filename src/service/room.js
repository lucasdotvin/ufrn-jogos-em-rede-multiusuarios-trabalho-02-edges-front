export default class RoomService {
  authService = null

  constructor(authService) {
    this.authService = authService
  }

  async list() {
    const url = import.meta.env.VITE_API_URL + '/api/v1/rooms/'
    const response = await this.authService.authenticatedFetch(url)

    if (!response.ok) {
      return false
    }

    const { rooms } = await response.json()

    return rooms
  }

  async store(name) {
    const url = import.meta.env.VITE_API_URL + '/api/v1/rooms/'
    const response = await this.authService.authenticatedFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    })

    if (!response.ok) {
      return false
    }

    return await response.json()
  }

  async findActive() {
    const url = import.meta.env.VITE_API_URL + '/api/v1/rooms/my-active-room'
    const response = await this.authService.authenticatedFetch(url)

    if (!response.ok) {
      return false
    }

    return await response.json()
  }

  async ingress(roomUuid) {
    const url = import.meta.env.VITE_API_URL + `/api/v1/rooms/${roomUuid}/ingress/`
    const response = await this.authService.authenticatedFetch(url, {
      method: 'POST'
    })

    if (!response.ok) {
      return false
    }

    return await response.json()
  }

  subscribeToGlobalRoomEvents() {
    const url = import.meta.env.VITE_WEBSOCKET_URL + `/api/v1/ws/rooms/events`

    return this.authService.authenticatedWebSocket(url)
  }

  subscribeToRoomEvents(roomUuid) {
    const url = import.meta.env.VITE_WEBSOCKET_URL + `/api/v1/ws/rooms/${roomUuid}/events`

    return this.authService.authenticatedWebSocket(url)
  }
}
