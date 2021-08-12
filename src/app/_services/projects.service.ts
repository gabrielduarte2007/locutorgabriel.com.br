import { Injectable } from '@angular/core';
import { projects } from '_data/projects.data';
import { Project } from '../../_model/Project';
import slugify from 'slugify';
import { ProjectType } from '../../_model/ProjectType';
import { Router } from '@angular/router';
import { config } from '../../_data/config.data';

@Injectable({
    providedIn: 'root',
})
export class ProjectsService {
    public projects = projects;

    public currentProject: Project;

    public relatedProjects: Project[] = projects.slice(20, 26);

    constructor(private readonly router: Router) {
        this.loadCurrentProject();
    }

    private loadCurrentProject(): void {
        const slug = this.router.url?.replace('/', '');

        if (!slug) {
            return;
        }

        this.currentProject = projects.find(
            project => this.getSlug(project) === slug,
        );

        const relatedProjects: Project[] = this.projects.reduce(
            (previousValue, currentValue) => {
                if (currentValue !== this.currentProject) {
                    const tags = currentValue.tags;

                    const numberOfEqualTags = this.currentProject.tags
                        .map(tag => tags.includes(tag))
                        .reduce((a, b) => a + (b ? 1 : 0), 0);

                    if (numberOfEqualTags > 0) {
                        previousValue.push(currentValue);
                    }
                }

                return previousValue;
            },
            [] as Project[],
        );

        this.relatedProjects = relatedProjects.slice(
            0,
            config.maxRelatedProjects,
        );
    }

    // Slug

    public getSlug(project: Project): string {
        return slugify(project.slug || project.id);
    }

    // Media URL

    public getMediaUrl(projectType: ProjectType, project?: Project): string {
        if (!project) {
            project = this.currentProject;
        }

        const fileExtension = projectType === ProjectType.VIDEO ? 'mp4' : 'mp3';

        return `assets/media/${projectType.toLowerCase()}/${
            project.id
        }.${fileExtension}`;
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

    public getYouTubeIframeUrl(project?: Project): string {
        if (!project) {
            project = this.currentProject;
        }

        const videoId = this.getYouTubeVideoId(project);

        return `https://www.youtube.com/embed/${videoId}`;
    }
}
