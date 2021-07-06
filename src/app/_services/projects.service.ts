import { Injectable } from '@angular/core';
import { projects } from '_data/projects.data';
import { Project } from '../../_model/Project';
import slugify from 'slugify';

@Injectable({
    providedIn: 'root',
})
export class ProjectsService {
    public projects = projects;

    // Slug

    public getSlug(project: Project): string {
        return slugify(project.id);
    }

    // YouTube

    public getYouTubeVideoId(project: Project): string | undefined {
        if (project.youtube) {
            const url = new URL(project.youtube);

            return url.pathname.includes('watch')
                ? url.searchParams.get('v')
                : url.pathname.slice(1);
        }
    }

    public getYouTubeImageUrl(project: Project, highRes = false): string {
        if (!project.youtube) {
            // console.error(
            //     `Project ${project.id} is a VIDEO without youtube url.`,
            // );

            return 'YOUTUBE_URL_NOT_FOUND';
        }

        const videoId = this.getYouTubeVideoId(project);

        const fileName = highRes ? 'maxresdefault' : 'hqdefault';

        return `https://img.youtube.com/vi/${videoId}/${fileName}.jpg`;
    }

    public getYouTubeIframeUrl(project: Project): string {
        const videoId = this.getYouTubeVideoId(project);

        return `https://www.youtube.com/embed/${videoId}`;
    }
}
