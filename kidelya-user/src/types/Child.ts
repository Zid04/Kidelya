
export interface Child {
  idchildren: number

  firstname: string
  lastname: string

  birthday: string | null
  specificationnote?: string | null
  sexe?: string | null
  photourl?: string | null

  iduser: number

  created_at?: string
  updated_at?: string
}
