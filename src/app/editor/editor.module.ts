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
import { FilesManagerService } from './services/files-manager.service';
import { NgxElectronModule } from 'ngx-electron';
import { PreviewDisplayComponent } from './components/preview-display/preview-display.component';
import { SequenceStepDisplayComponent } from './components/sequence-step-display/sequence-step-display.component';
import { PreviewDisplayBlockComponent } from './components/preview-display-block/preview-display-block.component';
import { PreviewLineDisplayComponent } from './components/preview-line-display/preview-line-display.component';

@NgModule({
  declarations: [
    EditorComponent,
    SequenceEditComponent,
    PreviewDisplayComponent,
    SequenceStepDisplayComponent,
    PreviewDisplayBlockComponent,
    PreviewLineDisplayComponent
  ],
  providers: [
    FilesManagerService
  ],
  imports: [
    CommonModule,
    EditorRoutingModule,
    CodemirrorModule,
    FormsModule,
    NgxElectronModule
  ]
})
export class EditorModule { }
