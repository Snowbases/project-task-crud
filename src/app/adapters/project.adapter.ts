// import Dexie from 'dexie';
// import { Project } from '../interfaces/project.interface';

// export class ProjectDatabase extends Dexie {
//   project: Dexie.Table<Project, number>;

//   constructor() {
//     super('project');
//     this.version(1).stores({
//       project: '++, id, project_name, &project_slug, project_description, project_manager'
//     });
//     this.project = this.table('project');
//   }
// }