import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SortingStatsComponent} from '../../components/sorting-stats/sorting-stats.component';
import {ByzantineFaultToleranceComponent} from '../../components/byzantine-fault-tolerance/byzantine-fault-tolerance.component';
import {PrimalityTestComponent} from '../../components/primality-test/primality-test.component';

const routes: Routes = [
  { path: 'quicksort', component: SortingStatsComponent },
  { path: 'byzantineFaultTolerance', component: ByzantineFaultToleranceComponent },
  { path: 'primality', component: PrimalityTestComponent }
];
// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
