export type Priority = 'critical' | 'moderate' | 'optional'

export interface Todo {
  id: string
  text: string
  priority: Priority
  createdAt: Date
}
