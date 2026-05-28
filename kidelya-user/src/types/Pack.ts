export interface Pack {
  idpack: number

  title: string
  description?: string | null

  tarification: number
  duration: number

  createdby: number
  illustration?: string | null

  is_published: boolean
  type?: string | null

  created_at?: string
  updated_at?: string
}
