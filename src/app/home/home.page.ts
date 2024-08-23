import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { add, checkmarkCircle, ellipseOutline } from 'ionicons/icons';
import { IonicModule} from '@ionic/angular';
import { Task } from '../shared/interfaces/task';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../shared/service/tasks.service';
import { Habits } from '../shared/interfaces/habits';
import { ListTaskComponent } from "../shared/components/list-task/list-task.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ListTaskComponent
],
})
export class HomePage {

   newTask: string = '';
   newHabit: string = '';



  tasks : Task [] = [
   
  ];
  constructor(
    private taskService : TasksService,
    private router : Router
  ) {

    this.getTask()
    console.log(this.tasks)
   
  }



  addTask(){

    const addTaskInfo: Task = {
      name: this.newTask,
      relation:'General',
      completed: false,
    }

     this.tasks.push(addTaskInfo)
  }

  async getTask(){

    let listTask : Task[] = await this.taskService.getTopTasks()

    this.tasks =  listTask
    
    
  }

  async addHabit(){
    const habitnew: Habits = await this.taskService.createHabit( this.newHabit);
    this.router.navigateByUrl(`habit/${habitnew.id}`)
  }
}
