import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './components/editor/editor.component';
import { SequenceEditComponent } from './components/sequence-edit/sequence-edit.component';
import { FormsModule } from '@angular/forms';
import './tgs';
import 'codemirror/addon/hint/show-hint';
import './anyword-hint';

@NgModule({
  declarations: [EditorComponent, SequenceEditComponent],
  imports: [
    CommonModule,
    EditorRoutingModule,
    CodemirrorModule,
    FormsModule
  ]
})
export class EditorModule { }
