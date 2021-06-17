import { Component } from '@angular/core';
import { Project } from '../../../../_model/Project';
import { projects } from '_data/projects.data';

@Component({
    selector: 'app-cards-list',
    templateUrl: './cards-list.component.html',
    styleUrls: ['./cards-list.component.sass'],
})
export class CardsListComponent {
    public projects = projects;

    getYouTubeVideoId(project: Project): string | undefined {
        if (project.youtube) {
            const url = new URL(project.youtube);

            return url.pathname.includes('watch')
                ? url.searchParams.get('v')
                : url.pathname.slice(1);
        }
    }

    getYouTubeImageUrl(project: Project, highRes = false): string {
        if (!project.youtube) {
            console.error(
                `Project ${project.id} is a VIDEO without youtube url.`,
            );

            return 'YOUTUBE_URL_NOT_FOUND';
        }

        const videoId = this.getYouTubeVideoId(project);

        const fileName = highRes ? 'maxresdefault' : 'hqdefault';

        return `https://img.youtube.com/vi/${videoId}/${fileName}.jpg`;
    }
}
