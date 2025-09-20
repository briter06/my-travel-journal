import { Coordinates } from "./Coordinates"

export type Place = {
    name?: string,
    city: string,
    country: string,
    coordinates: Coordinates,
    description: string
}

export type Trip = {
    from: string
    to: string
    date: string
}