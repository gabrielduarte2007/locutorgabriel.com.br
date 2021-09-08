import { Injectable } from '@angular/core';
import { projects } from '_data/projects.data';
import { Project } from '../../_model/Project';
import slugify from 'slugify';
import { ProjectType } from '../../_model/ProjectType';
import { Router } from '@angular/router';
import { FilterService } from './filter.service';
import { delay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ProjectsService {
    public projects = projects;

    public currentProject: Project;

    constructor(
        private readonly router: Router,
        private readonly filterService: FilterService,
    ) {
        this.loadCurrentProject();

        this.filterService.onReady
            .pipe(delay(0))
            .subscribe(this.loadRelatedProjects.bind(this));
    }

    private loadCurrentProject(): void {
        const slug = this.router.url?.replace('/', '');

        if (!slug) {
            return;
        }

        this.currentProject = projects.find(
            project => this.getSlug(project) === slug,
        );
    }

    private loadRelatedProjects(): void {
        if (
            !this.filterService.searchTags.length
            && this.currentProject?.tags.length
        ) {
            const getRandomArbitrary = (min, max) =>
                Math.floor(Math.random() * (max - min) + min);

            const randomIndex = getRandomArbitrary(
                0,
                this.currentProject.tags.length,
            );

            const randomTag = this.currentProject.tags[randomIndex];

            this.filterService.addTag(randomTag);
        }
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
