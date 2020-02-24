import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorComponent } from './components/editor/editor.component';
import { SequenceEditComponent } from './components/sequence-edit/sequence-edit.component';

const routes: Routes = [
  {
    path: "editor",
    component: EditorComponent
  },
  {
    path: "edit",
    component: SequenceEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditorRoutingModule { }
