import Dexie from 'dexie';
import { Task } from '../interfaces/task.interface';

export class TaskDatabase extends Dexie {
  task: Dexie.Table<Task, number>;

  constructor() {
    super('task');
    this.version(1).stores({
      task: '++, id, project_id, user, title, &slug, description, due_date, status'
    });
    this.task = this.table('task');
  }
}