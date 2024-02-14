import { Routes } from '@angular/router';

import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDuplicateEditorComponent } from './article-duplicate-editor/article-duplicate-editor.component';

import { ArtbaseEditorComponent } from './artbase-editor/artbase-editor.component';
import { ArtbaseEditorAllWithSummaryComponent } from './artbase-editor-all-with-summary/artbase-editor-all-with-summary.component';
import { PropclassEditorComponent } from './propclass-editor/propclass-editor.component';
import { PriceMultiplierComponent } from './price-multiplier/price-multiplier.component';
export const routes: Routes = [
    // TODO: set names for each page etc., see https://angular.dev/guide/routing/common-router-tasks
    { path: '', component: ArticleListComponent },
    { path: 'duplicates', component: ArticleDuplicateEditorComponent },
    { path: 'editor-artbase', component: ArtbaseEditorComponent },
    { path: 'editor-all', component: ArtbaseEditorAllWithSummaryComponent },
    { path: 'editor-propclass', component: PropclassEditorComponent },
    { path: 'price-multiplier', component: PriceMultiplierComponent },
    
    //  { path: '**', component: PageNotFoundComponent },
    
];
