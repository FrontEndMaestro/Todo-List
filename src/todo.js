export class todo {
    constructor(title, description, date, priority) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.priority = priority;
        //this.checklist = [];
        this.completed=false;
    }

   /* addSubtask(subTask){
        this.checklist.push({subTask,completed:false});
        console.log("pushed");
        this.checklist.forEach(element=>{
            console.log(element)
        })
    }*/

    setCompleted(comp){
        this.completed=comp;
    }

   /* completeSubTask(index){
     this.checklist[index].completed=true;
     console.log("subtask value is",this.checklist[index].completed);
    }
    editSubTask(index,subTask,completed){
        this.checklist[index].subTask=subTask;
        this.checklist[index].completed=completed;
    }*/

    updateTodo(title,description,date,priority){
        this.title=title;
        this.description = description;
        this.date = date;
        this.priority = priority;
        console.log("updated");
    }
    
}

