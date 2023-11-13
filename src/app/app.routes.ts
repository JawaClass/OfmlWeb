import { Routes } from '@angular/router';

import { OcdFormComponent } from './ocd-form/ocd-form.component';
import { ArticleInputComponent } from './article-input/article-input.component';

export const routes: Routes = [

    { path: '', component: ArticleInputComponent },
    { path: 'ocd-form', component: OcdFormComponent },
    { path: 'second-component', component: OcdFormComponent },

];
