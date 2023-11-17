import { Routes } from '@angular/router';

import { OcdFormComponent } from './ocd-form/ocd-form.component';
import { ArticleInputComponent } from './article-input/article-input.component';
import { PropertyEditorComponent } from './property-editor/property-editor.component';
import { PropclassEditorComponent } from './propclass-editor/propclass-editor.component';
export const routes: Routes = [

    { path: '', component: ArticleInputComponent },
    { path: 'ocd-form', component: OcdFormComponent },
    { path: 'second-component', component: OcdFormComponent },
    { path: 'editor', component: PropertyEditorComponent },
    { path: 'editor-propclass', component: PropclassEditorComponent },
    
];
