import { NgModule } from '@angular/core';
import { ProfileListTableComponent } from '@app/home/profile/profile-list-table.component';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ProfileComponent } from '@app/home/profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared';

/**
 * Profile module.
 */
@NgModule({
  declarations: [ProfileListTableComponent, ProfileComponent],
  exports: [ProfileComponent],
  imports: [
    MatButtonModule,
    MatTableModule,
    CommonModule,
    MatMenuModule,
    MatIconModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatInputModule,
    SharedModule,
  ],
})
export class ProfileModule {}
