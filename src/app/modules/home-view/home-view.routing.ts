import { Route } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';
import { HomeViewComponent } from './home-view.component';
import { InitialDataResolver } from 'app/app.resolvers';

export const homeViewRoutes: Route[] = [
    {
        path: '',
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: '',
                component: HomeViewComponent,
            },
        ],
    },
];
