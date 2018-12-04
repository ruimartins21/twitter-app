import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {SafePipe} from '../../pipes/safe-pipe.pipe';

@NgModule({
  declarations: [SafePipe],
  imports: [
  ],
  exports: [ CommonModule, ReactiveFormsModule, SafePipe]
})
export class SharedModule { }
