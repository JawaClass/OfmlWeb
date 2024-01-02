import { Routes } from '@angular/router';

import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDuplicateEditorComponent } from './article-duplicate-editor/article-duplicate-editor.component';

import { ArtbaseEditorComponent } from './artbase-editor/artbase-editor.component';
import { ArtbaseEditorAllComponent } from './artbase-editor-all/artbase-editor-all.component';
import { PropclassEditorComponent } from './propclass-editor/propclass-editor.component';
export const routes: Routes = [
    // TODO: set names for each page etc., see https://angular.dev/guide/routing/common-router-tasks
    { path: '', component: ArticleListComponent },
    { path: 'duplicates', component: ArticleDuplicateEditorComponent },
    { path: 'editor', component: ArtbaseEditorComponent },
    { path: 'editor-all', component: ArtbaseEditorAllComponent },
    { path: 'editor-propclass', component: PropclassEditorComponent },
    //  { path: '**', component: PageNotFoundComponent },
    
];
