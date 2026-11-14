import { getCollection } from 'astro:content';

// Every project the site may show, in display order. Entries marked
// `hidden: true` stay in the repo but appear nowhere: not on /work, not in the
// homepage selection, not in the hero deck. Load projects through this helper
// rather than `getCollection('projects')` so a hidden one can't leak.
export async function getVisibleProjects() {
  return (await getCollection('projects'))
    .filter((project) => !project.data.hidden)
    .sort((a, b) => a.data.order - b.data.order);
}
