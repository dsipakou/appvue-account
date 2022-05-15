export interface Account {
  uuid: string,
  user: string,
  source: string,
  amount: number,
  description: string,
  isMain: boolean,
  createdAt: string,
  modifiedAt: string,
}
