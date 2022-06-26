import { Injectable } from '@angular/core';
import { projects } from '_data/projects.data';
import { Project } from '../../_model/Project';
import slugify from 'slugify';
import { ProjectType } from '../../_model/ProjectType';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { FilterService } from './filter.service';
import { delay, filter } from 'rxjs/operators';
import { Unsubscriber } from '../_decorators/unsubscriber.decorator';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProjectsService {
    public projects = projects;

    public currentProject = new BehaviorSubject<Project>(undefined);

    @Unsubscriber() subscriptions;

    constructor(
        private readonly router: Router,
        private readonly filterService: FilterService,
    ) {
        this.loadCurrentProject();

        this.subscriptions = this.router.events
            .pipe(
                filter(e => e instanceof NavigationStart),
                delay(0),
            )
            .subscribe(() => this.currentProject.next(undefined));

        this.subscriptions = this.router.events
            .pipe(
                filter(e => e instanceof NavigationEnd),
                delay(0),
            )
            .subscribe(this.loadCurrentProject.bind(this));

        // this.subscriptions = this.filterService.onReady
        //     .pipe(delay(0))
        //     .subscribe(this.loadRelatedProjects.bind(this));
    }

    private loadCurrentProject(): void {
        const slug = this.router.url?.replace('/', '');

        if (!slug) {
            this.currentProject.next(undefined);

            return;
        }

        this.currentProject.next(
            projects.find(project => this.getSlug(project) === slug),
        );
    }
    // unsed
    private loadRelatedProjects(): void {

        if (
            !this.filterService.searchTags.length
            && this.currentProject.value?.tags.length
        ) {
            const getRandomArbitrary = (min, max) =>
                Math.floor(Math.random() * (max - min) + min);

            const randomIndex = getRandomArbitrary(
                0,
                this.currentProject.value.tags.length,
            );

            const randomTag = this.currentProject.value.tags[randomIndex];

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
            project = this.currentProject.value;
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
            return project.imagem ? project.imagem : 'YOUTUBE_URL_NOT_FOUND';
        }

        const videoId = this.getYouTubeVideoId(project);

        const fileName = highRes ? 'maxresdefault' : 'hqdefault';

        return `https://img.youtube.com/vi/${videoId}/${fileName}.jpg`;
    }

    public getYouTubeIframeUrl(project?: Project): string {
        if (!project) {
            project = this.currentProject.value;
        }

        const videoId = this.getYouTubeVideoId(project);

        return `https://www.youtube.com/embed/${videoId}`;
    }
}
