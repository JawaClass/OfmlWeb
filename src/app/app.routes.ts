import { Routes } from '@angular/router';
import { ArticleListComponent } from './ocd-edit/article/article-list/article-list.component';
import { ArticleDuplicateEditorComponent } from './session/article-duplicate-editor/article-duplicate-editor.component';
import { ArtbaseEditorComponent } from './ocd-edit/artbase/artbase-editor/artbase-editor.component';
import { ArtbaseEditorAllWithSummaryComponent } from './ocd-edit/artbase/artbase-editor-all-with-summary/artbase-editor-all-with-summary.component';
import { PropclassEditorComponent } from './ocd-edit/property/propclass-editor/propclass-editor.component';
import { PriceMultiplierComponent } from './ocd-edit/price/price-multiplier/price-multiplier.component';
import { authGuard } from './auth.guard';
import { ArticleManageComponent } from './ocd-edit/article/article-manage/article-manage.component';
export const routes: Routes = [
    // TODO: set names for each page etc., see https://angular.dev/guide/routing/common-router-tasks
    { path: '', component: ArticleManageComponent },
    { path: 'duplicates', component: ArticleDuplicateEditorComponent, canActivate: [authGuard] },
    { path: 'editor-artbase', component: ArtbaseEditorComponent, canActivate: [authGuard] },
    { path: 'editor-all', component: ArtbaseEditorAllWithSummaryComponent, canActivate: [authGuard] },
    { path: 'editor-propclass', component: PropclassEditorComponent, canActivate: [authGuard] },
    { path: 'price-multiplier', component: PriceMultiplierComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: "" },
    
];
