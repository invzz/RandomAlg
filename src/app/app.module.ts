import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatSliderModule} from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';
import {SortingComponent} from './components/sorting-stats/sorting/sorting.component';
import {BarsComponent} from './components/bars/bars.component';
import {BarChartModule} from '@swimlane/ngx-charts';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {SortingStatsComponent} from './components/sorting-stats/sorting-stats.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import {MatSelectModule} from '@angular/material/select';
import {RouterModule} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';


@NgModule({
  declarations: [
    AppComponent,
    SortingComponent,
    BarsComponent,
    SortingStatsComponent,
    SidenavComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSliderModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    BarChartModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatListModule,
    FormsModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatSidenavModule,
    MatSelectModule,
    RouterModule,
    MatToolbarModule,
    MatMenuModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
