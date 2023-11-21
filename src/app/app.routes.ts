import { Routes } from '@angular/router';

import { ArticleInputComponent } from './article-input/article-input.component';
import { ArtbaseEditorComponent } from './artbase-editor/artbase-editor.component';
import { ArtbaseEditorAllComponent } from './artbase-editor-all/artbase-editor-all.component';
import { PropclassEditorComponent } from './propclass-editor/propclass-editor.component';
export const routes: Routes = [
    // TODO: set names for each page etc., see https://angular.dev/guide/routing/common-router-tasks
    { path: '', component: ArticleInputComponent },
    { path: 'editor', component: ArtbaseEditorComponent },
    { path: 'editor-all', component: ArtbaseEditorAllComponent },
    { path: 'editor-propclass', component: PropclassEditorComponent },
    //  { path: '**', component: PageNotFoundComponent },
    
];
