interface ShowCastCharacter {
    id: number
    url: string
    name: string
    image?: {
        medium?: string
        original?: string
    }
    _links: {
        self: {
            href: string
        }
    }
}
