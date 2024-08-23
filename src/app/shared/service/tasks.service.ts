import { Injectable } from '@angular/core';
import { Task } from '../interfaces/task';
import { Habits } from '../interfaces/habits';
import { v4 as uuidv4 } from 'uuid'; // Importa la función v4 para generar UUIDs
import { Preferences } from '@capacitor/preferences';


@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private STORAGE_KEY = 'habits';

  

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


  constructor(

    
  ) {

    

    
   }


  getFirstTasks(): Task[] {
    let listTaskFirst: Task[] = [];

    this.listHabits.forEach(habit => {
      const firstThreeTasks = habit.listTask!.slice(0, 3);  // Extrae las primeras 3 tareas
      listTaskFirst = listTaskFirst.concat(firstThreeTasks);  // Añade esas tareas a la lista principal
    });

    return listTaskFirst;
  }

  // Guardar o actualizar todos los hábitos
  private async saveHabits(habits: Habits[]): Promise<void> {
    await Preferences.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(habits),
    });
  }

  // Obtener todos los hábitos
  public async getAllHabits(): Promise<Habits[]> {
    const { value } = await Preferences.get({ key: this.STORAGE_KEY });
    return value ? JSON.parse(value) : [];
  }

  // Crear un nuevo hábito
  public async createHabit(name: string): Promise<Habits> {
    const newHabit: Habits = {
      id: uuidv4(), // Generamos un ID único
      name,
      listTask: [],
    };
    const habits = await this.getAllHabits();
    habits.push(newHabit);
    await this.saveHabits(habits);
    return newHabit;
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

  // Agregar una nueva tarea a un hábito
   public async addTaskToHabit(habitId: string, taskName: string, relation: string): Promise<Task | null> {
    const habits = await this.getAllHabits();
    const habit = habits.find((h) => h.id === habitId);

    if (habit) {
      const newTask: Task = {
        id: uuidv4(), // Generar un ID único para la tarea
        name: taskName,
        completed: false,
        relation,
        status: 'pending',
        position: habit.listTask?.length || 0,
      };

      // Agregar la nueva tarea a la lista de tareas del hábito
      if (!habit.listTask) {
        habit.listTask = [];
      }
      habit.listTask.push(newTask);

      // Guardar los hábitos actualizados
      await this.saveHabits(habits);

      // Devolver la nueva tarea con su ID y otros datos
      return newTask;
    }
    return null;
  }

  // Obtener las primeras 3 tareas según la posición
  public async getTopTasks(limit: number = 9): Promise<Task[]> {
    const habits = await this.getAllHabits();
    const allTasks: Task[] = [];

    // Recorremos todos los hábitos
    for (const habit of habits) {
      if (habit.listTask && habit.listTask.length > 0) {
        // Extraemos las primeras 3 tareas de cada hábito
        const tasks = habit.listTask.slice(0, 3);
        allTasks.push(...tasks);
      }

      // Si llegamos al límite de 9 tareas, salimos del bucle
      if (allTasks.length >= limit) {
        break;
      }
    }

    // Devolvemos solo las primeras 9 tareas
    return allTasks.slice(0, limit);
  }

  public async deleteTask(habitId: string, taskId: string): Promise<void> {
    const habits = await this.getAllHabits();
    const habit = habits.find(h => h.id === habitId);

    if (habit && habit.listTask) {
      habit.listTask = habit.listTask.filter(task => task.id !== taskId);
      await this.saveHabits(habits); // Guardar los hábitos actualizados
    }
  }

  public async updateTask(habitId: string, updatedTask: Task): Promise<void> {
    const habits = await this.getAllHabits();
    const habit = habits.find(h => h.id === habitId);

    if (habit && habit.listTask) {
      const taskIndex = habit.listTask.findIndex(task => task.id === updatedTask.id);
      if (taskIndex > -1) {
        habit.listTask[taskIndex] = updatedTask; // Actualizar la tarea
        await this.saveHabits(habits); // Guardar los hábitos actualizados
      }
    }
  }

  
}
