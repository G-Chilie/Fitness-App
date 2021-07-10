import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderModule, NgxUiLoaderConfig } from 'ngx-ui-loader';

import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ProfileComponent } from './profile/profile.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { ProgramComponent } from './program/program.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: '#363740',
  bgsOpacity: 0.9,
  bgsPosition: 'bottom-right',
  bgsSize: 60,
  bgsType: 'ball-spin-clockwise',
  blur: 3,
  delay: 0,
  fastFadeOut: true,
  fgsColor: '#363740',
  fgsPosition: 'center-center',
  fgsSize: 40,
  fgsType: 'rectangle-bounce',
  gap: 12,
  logoPosition: 'center-center',
  logoSize: 150,
  logoUrl: 'assets/logo.svg',
  masterLoaderId: 'master',
  overlayBorderRadius: '0',
  overlayColor: 'rgba(40, 40, 40, 0.8)',
  pbColor: 'red',
  pbDirection: 'ltr',
  pbThickness: 3,
  hasProgressBar: false,
  text: '',
  textColor: '#FFFFFF',
  textPosition: 'center-center',
  maxTime: -1,
  minTime: 300,
};

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    HomeRoutingModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    FormsModule,
  ],
  declarations: [HomeComponent, ProfileComponent, RecommendationsComponent, ProgramComponent],
})
export class HomeModule {}
