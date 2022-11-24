interface ShowCastPerson {
    id: number
    url: string
    name: string
    country?: ShowCountry
    birthday: string
    deathday: string | null
    gender: string
    image?: {
        medium?: string
        original?: string
    }
    updated: number
    _links: {
        self: {
            href: string
        }
    }
}
