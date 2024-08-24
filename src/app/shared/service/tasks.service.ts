import { Injectable } from '@angular/core';
import { Task } from '../interfaces/task';
import { Habits } from '../interfaces/habits';
import { v4 as uuidv4 } from 'uuid'; // Importa la función v4 para generar UUIDs
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private STORAGE_KEY = 'habits';
  private habitsSubject = new BehaviorSubject<Habits[]>([]);
  public habits$ = this.habitsSubject.asObservable();

  listHabits: Habits[] = [
    {
      name: 'Trabajo', listTask: [
        { position: 1, name: 'Revisar lista de entrada', completed: false, relation: 'Trabajo' },
        { position: 2, name: 'Enviar reporte', completed: false, relation: 'Trabajo' },
        { position: 3, name: 'Reunión de equipo', completed: false, relation: 'Trabajo' }
      ]
    },
    {
      name: 'Ejercicio', listTask: [
        { position: 1, name: 'Salir en bicicleta', completed: false, relation: 'Ejercicio' }
      ]
    },
    {
      name: 'Casa', listTask: [
        { position: 1, name: 'Preparar desayuno', completed: false, relation: 'Casa' },
        { position: 2, name: 'Limpiar la cocina', completed: false, relation: 'Casa' },
        { position: 3, name: 'Organizar habitación', completed: false, relation: 'Casa' }
      ]
    }
  ];

  listNameHabits: {name: string} [] | null = []


    constructor() {
    // Cargar hábitos desde el almacenamiento al iniciar el servicio
    this.loadHabits();
  }

  private async loadHabits(): Promise<void> {
    const habits = await this.getAllHabits();
    this.habitsSubject.next(habits); // Emitir los hábitos cargados
  }



  private async saveHabits(habits: Habits[]): Promise<void> {
    await Preferences.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(habits),
    });
    this.habitsSubject.next(habits); // Emitir los hábitos actualizados
  }

  // Obtener todos los hábitos
  public async getAllHabits(): Promise<Habits[]> {
    const { value } = await Preferences.get({ key: this.STORAGE_KEY });
    return value ? JSON.parse(value) : [];
  }

  // Crear un nuevo hábito
  public async createHabit(name: string): Promise<Habits> {
    const newHabit: Habits = {
      id: uuidv4(), 
      name,
      listTask: [],
    };
    const habits = await this.getAllHabits();
    habits.push(newHabit);
    await this.saveHabits(habits);
    return newHabit;
  }

  // Agregar una nueva tarea a un hábito
  public async addTaskToHabit(habitId: string, taskName: string, relation: string): Promise<Task | null> {
    const habits = await this.getAllHabits();
    const habit = habits.find((h) => h.id === habitId);

    if (habit) {
      const newTask: Task = {
        id: uuidv4(),
        name: taskName,
        completed: false,
        relation,
        status: 'pending',
        position: habit.listTask?.length || 0,
      };

      if (!habit.listTask) {
        habit.listTask = [];
      }
      habit.listTask.push(newTask);

      await this.saveHabits(habits); // Guardar y emitir la lista actualizada
      return newTask;
    }
    return null;
  }

  // Actualizar un hábito
  public async updateHabit(updatedHabit: Habits): Promise<void> {
    const habits = await this.getAllHabits();
    const habitIndex = habits.findIndex((habit) => habit.id === updatedHabit.id);
    if (habitIndex > -1) {
      habits[habitIndex] = updatedHabit;
      await this.saveHabits(habits);
    }
  }

  // Eliminar un hábito
  public async deleteHabit(id: string): Promise<void> {
    let habits = await this.getAllHabits();
    habits = habits.filter((habit) => habit.id !== id);
    await this.saveHabits(habits);
  }

  // Obtener las primeras 3 tareas según la posición
  public async getTopTasks(limit: number = 9): Promise<Task[]> {
    const habits = await this.getAllHabits();
    const allTasks: Task[] = [];

    for (const habit of habits) {
      if (habit.listTask && habit.listTask.length > 0) {
        const tasks = habit.listTask.slice(0, 3);
        allTasks.push(...tasks);
      }
      if (allTasks.length >= limit) {
        break;
      }
    }
    return allTasks.slice(0, limit);
  }

  public async deleteTask(habitId: string, taskId: string): Promise<void> {
    const habits = await this.getAllHabits();
    const habit = habits.find(h => h.id === habitId);

    if (habit && habit.listTask) {
      habit.listTask = habit.listTask.filter(task => task.id !== taskId);
      await this.saveHabits(habits);
    }
  }

  public async updateTask(habitId: string, updatedTask: Task): Promise<void> {
    const habits = await this.getAllHabits();
    const habit = habits.find(h => h.id === habitId);

    if (habit && habit.listTask) {
      const taskIndex = habit.listTask.findIndex(task => task.id === updatedTask.id);
      if (taskIndex > -1) {
        habit.listTask[taskIndex] = updatedTask;
        await this.saveHabits(habits);
      }
    }
  }

  
}
