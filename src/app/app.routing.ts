import { Route } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [
    {
        path: '',
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('app/modules/home-view/home-view.module').then(
                        m => m.HomeViewModule,
                    ),
            },
            {
                path: 'busca/:search',
                loadChildren: () =>
                    import('app/modules/home-view/home-view.module').then(
                        m => m.HomeViewModule,
                    ),
            },
            {
                path: ':slug',
                loadChildren: () =>
                    import(
                        'app/modules/projects-view/projects-view.module'
                    ).then(i => i.ProjectsViewModule),
            },
        ],
    },
    {
        path: '**',
        redirectTo: '/',
    },
];
