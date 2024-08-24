import { Component, OnInit } from '@angular/core';
import { IonicModule, MenuController} from '@ionic/angular';
import { RouterModule } from '@angular/router'; //
import { Habits } from '../shared/interfaces/habits';
import { TasksService } from '../shared/service/tasks.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [IonicModule, RouterModule, CommonModule ],
})
export class LayoutComponent  implements OnInit {

  listHabits: Habits[] = []

  constructor(
    private taskService: TasksService,
    private menuCtrl: MenuController,
    private router : Router

  ) { 
    // this.listHabits = taskService.listHabits

    

    
  }

  async ngOnInit() {

    this.taskService.habits$.subscribe(data=>{
      this.listHabits = data
    })
    
  }

  async generateLInk(idHabit:string){
    // console.log('cerrar')
    await this.menuCtrl.close()
    this.router.navigateByUrl(`/habit/${idHabit}`)
    return

  }





}
