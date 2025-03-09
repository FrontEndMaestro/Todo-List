import { todo } from "./todo";
export class project{
    constructor(){
        this.tasks=[];
    }

    addtoproject(todo){
        this.tasks.push(todo);
    }

    removeTask(todo){
        const index=this.tasks.findIndex(element=>
            element.title===todo.title
        )
        if(index==-1){
            alert("task not found")
        }
        else{
            this.tasks.splice(index,1);
        }
    }

    displayAllTasks(){
        this.tasks.map(element=>console.log(element));
    }
}