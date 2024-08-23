import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { trashOutline , checkmarkCircle, ellipseOutline } from 'ionicons/icons';
import { IonicModule} from '@ionic/angular';
import { Task } from '../../interfaces/task';
import { CommonModule } from '@angular/common';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.scss'],
  standalone: true,
  imports:[
    IonicModule,
    CommonModule,
  ]
})
export class ListTaskComponent  implements OnInit {



  @Input() tasks: Task[] = []

  @Output() deleteClick = new EventEmitter<Task>()
  @Output() completeClick = new EventEmitter<Task>()

  checkmarkCircleIcon = checkmarkCircle;
  ellipseOutlineIcon = ellipseOutline;
  trashOutlineIcon = trashOutline

  constructor() { }

  ngOnInit() {}

  toggleTask(task: Task) {
    task.completed = !task.completed;
    this.completeClick.emit(task)

  }

  deleteTask(task:Task, slidingItem: IonItemSliding){
    slidingItem.close()
    this.deleteClick.emit(task)

  }

  touchComplete(){

  }

}
