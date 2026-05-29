export interface User {
  id: number
  email: string
  firstName: string
  lastName?: string
}

export interface Cv {
  id: number
  name: string
  targetCompany?: string
  jobOfferUrl?: string
  isDefault: boolean
  createdAt: string
}
