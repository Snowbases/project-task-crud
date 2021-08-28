// ○ ID (required)
// ○ Project Name (required)
// ○ Project Slug (required, autogenerated)
// ○ Project Description (optional)
// ○ Project Manager (required)

export interface Project {
  id: string,
  project_name: string,
  project_slug: string,
  project_description?: string,
  project_manager: string,
}