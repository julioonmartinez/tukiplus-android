import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, IonButton, IonIcon} from '@ionic/angular';
import { Habits } from 'src/app/shared/interfaces/habits';
import { TasksService } from 'src/app/shared/service/tasks.service';
import { ListTaskComponent } from "../../shared/components/list-task/list-task.component";
import { FormsModule } from '@angular/forms';
import { Task } from 'src/app/shared/interfaces/task';
import { CommonModule } from '@angular/common';
import { addOutline, checkmarkCircle, ellipseOutline } from 'ionicons/icons';


@Component({
  selector: 'app-habit',
  standalone: true,
  templateUrl: './habit.component.html',
  styleUrls: ['./habit.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ListTaskComponent,
 
]
})
export class HabitComponent  implements OnInit {

  habit: Habits ={
    name:'',
    listTask:[]
  }

  add = addOutline

  newTask : string = ''
  


  constructor(
    private routerActivate : ActivatedRoute,
    private taskService : TasksService,
    private router : Router
  ) { 
     
  }

  ngOnInit() {

    this.routerActivate.paramMap.subscribe(async data=>{
      console.log(data.get('id'))
      const idHabit = data.get('id')
      let  habits : Habits[] = await this.taskService.getAllHabits()
      this.habit = habits.find(habitt=> habitt.id == idHabit )!
     
    })
  }

  async addTask(){

    const newTask: Task | null = await this.taskService.addTaskToHabit(this.habit.id! , this.newTask, this.habit.name );
    if (newTask) {
      this.habit.listTask?.push(newTask)
      this.newTask = ''
    } else {
      console.error('Error al agregar la tarea.');
    }

    // Actualizar la vista con los hábitos actualizados
    
  }

  deleteTask(task:Task){
    this.taskService.deleteTask(this.habit.id!, task.id!).then(async ()=>{
      let  habits : Habits[] = await this.taskService.getAllHabits()
      this.habit = habits.find(habitt=> habitt.id == this.habit.id )!
    })
  }

  completeTask(task:Task){
    this.taskService.updateTask(this.habit.id!, task)
  }

  removeHabit(){
    this.taskService.deleteHabit(this.habit.id!)
    this.router.navigateByUrl('/home')
    
  }
    
      
    
  
  

}
