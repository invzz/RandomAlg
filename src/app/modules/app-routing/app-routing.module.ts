import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SortingStatsComponent} from '../../components/sorting-stats/sorting-stats.component';
import {ByzantineFaultToleranceComponent} from '../../components/byzantine-fault-tolerance/byzantine-fault-tolerance.component';

const routes: Routes = [
  { path: 'quicksort', component: SortingStatsComponent },
  { path: 'byzantineFaultTolerance', component: ByzantineFaultToleranceComponent },
];
// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
